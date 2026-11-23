/**
 * Checks that every instrument whose files changed between a base ref and the
 * current tree also incremented its `internal.edition`.
 *
 * Completed data in Open Data Capture is associated with an instrument's
 * `{ name, edition }` pair, so redefining an instrument without bumping its
 * edition silently changes the meaning of data already collected under the
 * old definition.
 *
 * As a secondary check, when an instrument's edition was bumped, any series
 * that pins that instrument by edition is verified against the new edition — a
 * stale pin means the series would keep serving the old version.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

import ts from 'typescript';

/** Candidate entrypoint filenames, in the order the bundler searches for them. */
const ENTRYPOINTS = ['index.tsx', 'index.jsx', 'index.ts', 'index.js'];

/**
 * `lib/<category>/<directory>/...` for the categories that hold scalar
 * instruments. Series (`lib/series`) have no `internal.edition` of their own.
 */
const INSTRUMENT_FILE = /^(lib\/(?:file|forms|interactive)\/[^/]+)\//;

const DEFAULT_BASES = ['origin/main', 'main'];

type Identity = {
  edition: null | number;
  name: null | string;
};

type Finding = {
  message: string;
  severity: 'error' | 'warning';
};

/** An instrument as it exists at the base ref. */
type BaseInstrument = {
  edition: null | number;
  entry: string;
};

function usage(): string {
  return [
    'Usage: node scripts/check-edition-bumps.ts [options]',
    '',
    'Compares the current tree against a base ref. For every instrument',
    'directory under lib/forms, lib/interactive or lib/file touched by the',
    'difference, its entrypoint must',
    'declare an `internal.edition` strictly greater than the one at the base',
    'ref. Instruments added by the branch are exempt. Exits nonzero when a',
    'bump is missing.',
    '',
    'Options:',
    '  --base <ref>  Ref to compare against (default: the first of',
    `                ${DEFAULT_BASES.join(', ')} that resolves)`,
    '  -h, --help    Print this message'
  ].join('\n');
}

/** Runs git and throws on failure; git's stderr is kept so the error explains itself. */
function git(root: string, args: string[]): string {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

/** Runs git, returning `null` instead of throwing. Only for calls where failure is an expected answer. */
function tryGit(root: string, args: string[]): null | string {
  try {
    return git(root, args);
  } catch {
    return null;
  }
}

function resolveBase(root: string, explicit: null | string): null | string {
  for (const candidate of explicit ? [explicit] : DEFAULT_BASES) {
    const resolved = tryGit(root, ['rev-parse', '--verify', '--quiet', `${candidate}^{commit}`]);
    if (resolved?.trim()) {
      return resolved.trim();
    }
  }
  return null;
}

/** Strips parentheses and `as`/`satisfies` wrappers to reach the underlying expression. */
function unwrap(node: ts.Expression): ts.Expression {
  let expression = node;
  while (
    ts.isParenthesizedExpression(expression) ||
    ts.isAsExpression(expression) ||
    ts.isSatisfiesExpression(expression)
  ) {
    expression = expression.expression;
  }
  return expression;
}

function findDefaultExportCall(source: ts.SourceFile): null | ts.CallExpression {
  for (const statement of source.statements) {
    if (!ts.isExportAssignment(statement) || statement.isExportEquals) {
      continue;
    }
    const expression = unwrap(statement.expression);
    if (ts.isCallExpression(expression)) {
      return expression;
    }
  }
  return null;
}

function getPropertyName(name: ts.PropertyName): null | string {
  return ts.isIdentifier(name) || ts.isStringLiteral(name) ? name.text : null;
}

function getProperty(object: ts.ObjectLiteralExpression, name: string): null | ts.Expression {
  for (const property of object.properties) {
    if (ts.isPropertyAssignment(property) && getPropertyName(property.name) === name) {
      return unwrap(property.initializer);
    }
  }
  return null;
}

function getString(node: null | ts.Expression): null | string {
  if (node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))) {
    return node.text;
  }
  return null;
}

function getNumber(node: null | ts.Expression): null | number {
  return node && ts.isNumericLiteral(node) ? Number(node.text) : null;
}

function parseInstrumentDefinition(source: string, filename: string): null | ts.ObjectLiteralExpression {
  const kind = /\.[jt]sx$/.test(filename) ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, kind);
  const definition = findDefaultExportCall(sourceFile)?.arguments[0];
  return definition && ts.isObjectLiteralExpression(definition) ? definition : null;
}

/** Reads `internal.edition` and `internal.name` from an instrument definition. */
function parseIdentity(filename: string, source: string): Identity | null {
  const definition = parseInstrumentDefinition(source, filename);
  if (!definition) {
    return null;
  }
  const internal = getProperty(definition, 'internal');
  if (!internal || !ts.isObjectLiteralExpression(internal)) {
    return null;
  }
  return {
    edition: getNumber(getProperty(internal, 'edition')),
    name: getString(getProperty(internal, 'name'))
  };
}

/**
 * Reads the `{ name, edition }` pins of a series instrument. Its `content` may be
 * a bare array of identities, or an object wrapping the array under `items`.
 */
function parseSeriesPins(filename: string, source: string): Map<string, number> | null {
  const definition = parseInstrumentDefinition(source, filename);
  if (!definition) {
    return null;
  }
  const content = getProperty(definition, 'content');
  let items: null | ts.ArrayLiteralExpression = null;
  if (content && ts.isArrayLiteralExpression(content)) {
    items = content;
  } else if (content && ts.isObjectLiteralExpression(content)) {
    const wrapped = getProperty(content, 'items');
    if (wrapped && ts.isArrayLiteralExpression(wrapped)) {
      items = wrapped;
    }
  }
  if (!items) {
    return null;
  }
  const pins = new Map<string, number>();
  for (const element of items.elements) {
    if (!ts.isObjectLiteralExpression(element)) {
      continue;
    }
    const name = getString(getProperty(element, 'name'));
    const edition = getNumber(getProperty(element, 'edition'));
    if (name !== null && edition !== null) {
      pins.set(name, edition);
    }
  }
  return pins;
}

/**
 * Paths (git style, relative to the repo root) of every file changed since the
 * branch diverged from the base, including uncommitted and untracked files.
 * Any git failure throws: an empty list must mean "nothing changed", never
 * "could not tell".
 */
function changedFiles(root: string, base: string): Set<string> {
  const mergeBase = tryGit(root, ['merge-base', base, 'HEAD'])?.trim();
  if (!mergeBase) {
    throw new Error(`could not find a merge base between ${base} and HEAD (is the clone shallow?)`);
  }
  const listings = [
    git(root, ['diff', '-z', '--name-only', '--no-renames', mergeBase, 'HEAD']),
    git(root, ['diff', '-z', '--name-only', '--no-renames', 'HEAD']),
    git(root, ['ls-files', '-z', '--others', '--exclude-standard'])
  ];
  const files = new Set<string>();
  for (const listing of listings) {
    for (const path of listing.split('\0')) {
      if (path.length > 0) {
        files.add(path);
      }
    }
  }
  return files;
}

function findEntrypoint(root: string, directory: string): null | string {
  for (const filename of ENTRYPOINTS) {
    const path = `${directory}/${filename}`;
    if (existsSync(join(root, path))) {
      return path;
    }
  }
  return null;
}

function seriesEntrypoints(root: string): string[] {
  const seriesRoot = join(root, 'lib', 'series');
  if (!existsSync(seriesRoot)) {
    return [];
  }
  const found: string[] = [];
  for (const directory of readdirSync(seriesRoot, { withFileTypes: true })) {
    if (!directory.isDirectory()) {
      continue;
    }
    const entry = findEntrypoint(root, `lib/series/${directory.name}`);
    if (entry) {
      found.push(entry);
    }
  }
  return found;
}

/**
 * Every instrument at the base ref, keyed both by directory and by `internal.name`,
 * so that a instrument whose directory or entrypoint was renamed is still matched
 * to its previous edition instead of being mistaken for a new instrument.
 */
function baseInstruments(
  root: string,
  base: string
): { byDirectory: Map<string, BaseInstrument>; byName: Map<string, BaseInstrument> } {
  const byDirectory = new Map<string, BaseInstrument>();
  const byName = new Map<string, BaseInstrument>();
  const paths = new Set(git(root, ['ls-tree', '-r', '-z', '--name-only', base, '--', 'lib/']).split('\0'));
  const directories = new Set(
    [...paths].map((path) => INSTRUMENT_FILE.exec(path)?.[1]).filter((name) => name !== undefined)
  );
  for (const directory of directories) {
    const entry = ENTRYPOINTS.map((filename) => `${directory}/${filename}`).find((path) => paths.has(path));
    if (!entry) {
      continue;
    }
    const identity = parseIdentity(entry, git(root, ['show', `${base}:${entry}`]));
    const instrument = { edition: identity?.edition ?? null, entry };
    byDirectory.set(directory, instrument);
    if (identity?.name) {
      byName.set(identity.name, instrument);
    }
  }
  return { byDirectory, byName };
}

/**
 * Fails every changed instrument whose edition is not strictly greater than at the
 * base. Returns how many instruments were touched and which were bumped, keyed by
 * `internal.name`.
 */
function checkEditions(
  root: string,
  base: string,
  findings: Finding[]
): { bumped: Map<string, { directory: string; head: number }>; touched: number } {
  const touchedInstruments = new Set<string>();
  for (const file of changedFiles(root, base)) {
    const match = INSTRUMENT_FILE.exec(file);
    if (match?.[1]) {
      touchedInstruments.add(match[1]);
    }
  }

  const bumped = new Map<string, { directory: string; head: number }>();
  if (touchedInstruments.size === 0) {
    return { bumped, touched: 0 };
  }
  const previous = baseInstruments(root, base);

  for (const directory of [...touchedInstruments].sort()) {
    const entry = findEntrypoint(root, directory);
    if (!entry) {
      findings.push({
        message: `${directory}: no recognised entrypoint (instrument removed, moved, or misnamed)`,
        severity: 'warning'
      });
      continue;
    }

    const headIdentity = parseIdentity(entry, readFileSync(join(root, entry), 'utf8'));
    if (!headIdentity) {
      findings.push({
        message: `${entry}: could not read an instrument with an \`internal\` block from the default export`,
        severity: 'error'
      });
      continue;
    }
    if (headIdentity.edition === null) {
      findings.push({
        message: `${entry}: \`internal.edition\` is missing or not a plain number`,
        severity: 'error'
      });
      continue;
    }

    const before =
      (headIdentity.name ? previous.byName.get(headIdentity.name) : undefined) ?? previous.byDirectory.get(directory);
    if (!before) {
      // The instrument does not exist at the base ref under this name or
      // directory: it was added by this branch, so there is no previous
      // edition to increment.
      continue;
    }
    if (before.edition === null) {
      findings.push({
        message: `${before.entry}: could not read the instrument's edition at the base ref; cannot verify the bump`,
        severity: 'error'
      });
      continue;
    }

    if (headIdentity.edition <= before.edition) {
      const moved = before.entry === entry ? '' : ` (was ${before.entry})`;
      findings.push({
        message: `${entry}${moved}: changed since the branch diverged but \`edition\` ${headIdentity.edition} is not greater than ${before.edition} on the base ref`,
        severity: 'error'
      });
      continue;
    }

    if (headIdentity.name) {
      bumped.set(headIdentity.name, { directory, head: headIdentity.edition });
    }
  }
  return { bumped, touched: touchedInstruments.size };
}

/**
 * Warns when a series pins a bumped instrument at an edition other than its new one.
 * Stale pins never block a PR: this repo has historically updated series pins
 * in separate pull requests. They are surfaced as notices so the author can
 * decide whether to include the update.
 */
function checkSeriesPins(
  root: string,
  bumped: Map<string, { directory: string; head: number }>,
  findings: Finding[]
): void {
  for (const entry of seriesEntrypoints(root)) {
    const pins = parseSeriesPins(entry, readFileSync(join(root, entry), 'utf8'));
    if (!pins) {
      findings.push({
        message: `${entry}: could not read the series' item list; cannot verify its edition pins`,
        severity: 'warning'
      });
      continue;
    }
    for (const [name, { directory, head }] of bumped) {
      const pin = pins.get(name);
      if (pin === undefined || pin === head) {
        continue;
      }
      const message =
        pin < head
          ? `${entry}: ${name} was bumped to edition ${head}, but the series still pins edition ${pin}`
          : `${entry}: ${name} pins edition ${pin}, but ${directory} declares edition ${head}; the pin matches no current edition`;
      findings.push({ message, severity: 'warning' });
    }
  }
}

function parseOptions(argv: string[]): null | { base: null | string } {
  const args = [...argv];
  let base: null | string = null;
  while (args.length > 0) {
    const arg = args.shift();
    if (arg === undefined) {
      break;
    } else if (arg === '--base') {
      const value = args.shift();
      if (value === undefined) {
        process.stderr.write('check-edition-bumps: --base requires a value\n');
        return null;
      }
      base = value;
    } else if (arg.startsWith('--base=')) {
      base = arg.slice('--base='.length);
    } else {
      process.stderr.write(`check-edition-bumps: unknown option: ${arg}\n`);
      return null;
    }
  }
  return { base };
}

function main(argv: string[]): number {
  if (argv.includes('--help') || argv.includes('-h')) {
    process.stdout.write(`${usage()}\n`);
    return 0;
  }
  const options = parseOptions(argv);
  if (!options) {
    process.stderr.write(`${usage()}\n`);
    return 1;
  }

  const root = tryGit(process.cwd(), ['rev-parse', '--show-toplevel'])?.trim();
  if (!root) {
    process.stderr.write('check-edition-bumps: not inside a git repository\n');
    return 1;
  }

  const base = resolveBase(root, options.base);
  if (!base) {
    const tried = options.base ? `--base ${options.base}` : DEFAULT_BASES.join(', ');
    process.stderr.write(`check-edition-bumps: could not resolve a base ref (tried ${tried})\n`);
    return 1;
  }

  const findings: Finding[] = [];
  const { bumped, touched } = checkEditions(root, base, findings);
  if (bumped.size > 0) {
    checkSeriesPins(root, bumped, findings);
  }

  let errors = 0;
  for (const finding of findings) {
    if (finding.severity === 'error') {
      errors += 1;
    }
    process.stdout.write(`${finding.severity}: ${finding.message}\n`);
  }

  if (touched === 0) {
    process.stdout.write('check-edition-bumps: no instruments changed\n');
  } else if (findings.length === 0) {
    process.stdout.write('check-edition-bumps: every changed instrument incremented its edition\n');
  }
  return errors > 0 ? 1 : 0;
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (error) {
  process.stderr.write(`check-edition-bumps: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
