// Builds a Markdown comment with playground preview links for every form or interactive
// instrument changed in a pull request.
//
// Usage: node .github/scripts/instrument-preview-links.js <base-sha> <head-sha> <output-file>
//
// File contents are read from git objects (never executed), so this is safe to run
// against untrusted pull request commits. When no instrument is added or modified, the
// output file is left empty and the workflow removes any comment it posted before.

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';

// @opendatacapture/playground-url publishes raw TypeScript as its import entry
// (and relies on a dependency it does not declare for consumers), so it cannot
// be imported here. Its compiled CLI is the supported standalone interface;
// resolve it relative to the package entry so it works whatever the install layout.
const PLAYGROUND_URL_CLI = path.resolve(
  path.dirname(createRequire(import.meta.url).resolve('@opendatacapture/playground-url')),
  '../dist/cli.js'
);

/** The file types the playground can receive in a share link (the same set as the playground-url CLI). */
const TEXT_EXTENSIONS = new Set(['.css', '.html', '.js', '.json', '.jsx', '.svg', '.ts', '.tsx']);

/**
 * `lib/<category>/<directory>/<file>` — an instrument is a directory, so a file directly
 * in `lib/forms` does not count. Series are not included: the playground shows one
 * scalar instrument at a time.
 */
const INSTRUMENT_PATH = /^(lib\/(?:forms|interactive)\/[^/]+)\/.+$/;

// GitHub rejects comments longer than 65536 characters
const MAX_COMMENT_LENGTH = 65000;

const COMMENT_MARKER = '<!-- form-preview-links -->';

/** @param {string[]} args */
function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

/**
 * Runs a git command with NUL-separated output, so non-ASCII paths are not quoted
 * @param {string[]} args
 */
function gitPaths(args) {
  const [command, ...rest] = args;
  return git([command, '-z', ...rest])
    .split('\0')
    .filter(Boolean);
}

/**
 * Encode an instrument's source files into a playground share link.
 *
 * The CLI reads an instrument from a directory, so the files (already read from
 * git objects) are written to a throwaway directory — as data, never executed —
 * because only the base branch is checked out. The URL is printed
 * to stdout; status and warnings go to stderr, which we forward to our own.
 * @param {{ content: string, name: string }[]} files
 * @param {string} label
 */
function generatePlaygroundURL(files, label) {
  const dir = mkdtempSync(path.join(tmpdir(), 'odc-instrument-'));
  try {
    for (const file of files) {
      const dest = path.resolve(dir, file.name);
      // Defence in depth against a crafted path escaping the temp directory.
      if (dest !== dir && !dest.startsWith(dir + path.sep)) {
        throw new Error(`Refusing to write outside the temp directory: ${file.name}`);
      }
      mkdirSync(path.dirname(dest), { recursive: true });
      writeFileSync(dest, file.content);
    }
    return execFileSync(process.execPath, [PLAYGROUND_URL_CLI, dir, '--label', label], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'inherit']
    }).trim();
  } finally {
    rmSync(dir, { force: true, recursive: true });
  }
}

const [baseSha, headSha, outputFile] = process.argv.slice(2);
if (!baseSha || !headSha || !outputFile) {
  console.error('Usage: node instrument-preview-links.js <base-sha> <head-sha> <output-file>');
  process.exit(1);
}

// Three-dot diff: only changes introduced by the PR since it diverged from the base branch
const changedPaths = gitPaths(['diff', '--name-only', `${baseSha}...${headSha}`, '--', 'lib/']);

/** Instrument directories (e.g. "lib/forms/GAD_7") touched by the pull request */
const changed = [...new Set(changedPaths.map((filepath) => INSTRUMENT_PATH.exec(filepath)?.[1]).filter(Boolean))].sort();

/** Instrument directories that still exist at the head commit; fully deleted instruments need no preview. */
const existing = new Set(
  gitPaths(['ls-tree', '-r', '--name-only', headSha, '--', 'lib/'])
    .map((filepath) => INSTRUMENT_PATH.exec(filepath)?.[1])
    .filter(Boolean)
);

const instruments = changed.filter((directory) => existing.has(directory));

if (instruments.length === 0) {
  writeFileSync(outputFile, '');
  console.log('No instruments added or modified.');
  process.exit(0);
}

const lines = [COMMENT_MARKER, '### Instrument previews', ''];
lines.push('Open the instruments changed in this pull request in the Open Data Capture playground:', '');

const skipped = [];
for (const directory of instruments) {
  const label = directory.slice('lib/'.length);
  const files = [];
  let omitted = 0;
  for (const filepath of gitPaths(['ls-tree', '-r', '--name-only', headSha, '--', `${directory}/`])) {
    const name = filepath.slice(directory.length + 1);
    // The playground-url CLI reads only the text files directly in the instrument directory.
    if (!name.includes('/') && TEXT_EXTENSIONS.has(path.extname(name).toLowerCase())) {
      files.push({ content: git(['show', `${headSha}:${filepath}`]), name });
    } else {
      omitted += 1;
    }
  }
  if (!files.some((file) => /^index\.(js|jsx|ts|tsx)$/.test(file.name))) {
    skipped.push(`- **${label}**: no \`index\` entrypoint found`);
    continue;
  }
  const note = omitted > 0 ? ` (${omitted} file${omitted === 1 ? '' : 's'} not included: binary or nested)` : '';
  const entry = `- **${label}**: [Open in playground](${generatePlaygroundURL(files, label)})${note}`;
  if ([...lines, entry].join('\n').length > MAX_COMMENT_LENGTH) {
    skipped.push(`- **${label}**: link too long to include in a comment`);
    continue;
  }
  lines.push(entry);
}

if (skipped.length > 0) {
  lines.push('', 'No preview link could be generated for:', '', ...skipped);
}

lines.push('', `<sub>Generated for ${headSha.slice(0, 7)}</sub>`);
writeFileSync(outputFile, lines.join('\n') + '\n');
console.log(lines.join('\n'));
