/**
 * Checks that the files this repository shares with ODC_Instruments_Template
 * are the same as in the template.
 *
 * Every instrument repository holds a copy of the template's agent
 * instructions, CI workflows, scripts and tool configuration. This check
 * finds the copies that have drifted, so that a change is made in the
 * template first and then copied, never made in one repository only.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import process from 'node:process';

const TEMPLATE_URL = 'https://github.com/DouglasNeuroInformatics/ODC_Instruments_Template.git';

/** Files that must be byte-for-byte identical to the template. */
const IDENTICAL_FILES = [
  '.agents/skills/agent-browser/SKILL.md',
  '.github/scripts/instrument-preview-links.js',
  '.github/workflows/ci.yml',
  '.github/workflows/instrument-previews.yml',
  '.github/workflows/template-sync.yml',
  '.husky/pre-commit',
  '.nvmrc',
  '.prettierignore',
  'CLAUDE.md',
  'eslint.config.js',
  'lib/env.d.ts',
  'scripts/check-edition-bumps.ts',
  'scripts/check-template-sync.ts',
  'skills-lock.json',
  'tsconfig.json'
];

/** `package.json` keys whose value must be equal to the template. */
const PACKAGE_KEYS = ['packageManager', 'prettier', 'type'];

/** `package.json` objects in which every template entry must be present with the same value. */
const PACKAGE_SUBSETS = ['dependencies', 'devDependencies', 'scripts'];

/** Everything in `AGENTS.md` before this line is shared; everything after it belongs to the repository. */
const AGENTS_MARKER = '<!-- repository-specific -->';

function usage(): string {
  return [
    'Usage: node scripts/check-template-sync.ts [options]',
    '',
    'Compares the shared files of this repository with ODC_Instruments_Template.',
    'Exits nonzero when a shared file is different.',
    '',
    'Options:',
    '  --template <dir>  A checkout of the template (default: a temporary clone',
    `                    of ${TEMPLATE_URL})`,
    '  -h, --help        Print this message'
  ].join('\n');
}

function read(root: string, path: string): null | string {
  const absolute = join(root, path);
  return existsSync(absolute) ? readFileSync(absolute, 'utf8') : null;
}

function sharedAgentsBlock(content: string): null | string {
  const index = content.indexOf(AGENTS_MARKER);
  return index === -1 ? null : content.slice(0, index);
}

function compare(root: string, template: string): string[] {
  const problems: string[] = [];

  for (const path of IDENTICAL_FILES) {
    const expected = read(template, path);
    const actual = read(root, path);
    if (expected === null) {
      problems.push(`${path}: not in the template (is the template checkout current?)`);
    } else if (actual === null) {
      problems.push(`${path}: missing`);
    } else if (actual !== expected) {
      problems.push(`${path}: different from the template`);
    }
  }

  const ignored = new Set((read(root, '.gitignore') ?? '').split('\n').map((line) => line.trim()));
  for (const line of (read(template, '.gitignore') ?? '').split('\n').map((entry) => entry.trim())) {
    if (line.length > 0 && !ignored.has(line)) {
      problems.push(`.gitignore: does not contain \`${line}\``);
    }
  }

  const expectedAgents = sharedAgentsBlock(read(template, 'AGENTS.md') ?? '');
  const actualAgents = sharedAgentsBlock(read(root, 'AGENTS.md') ?? '');
  if (expectedAgents === null) {
    problems.push(`AGENTS.md: the template has no \`${AGENTS_MARKER}\` line`);
  } else if (actualAgents === null) {
    problems.push(`AGENTS.md: missing, or has no \`${AGENTS_MARKER}\` line`);
  } else if (actualAgents !== expectedAgents) {
    problems.push(`AGENTS.md: the text before \`${AGENTS_MARKER}\` is different from the template`);
  }

  const expectedPackage = JSON.parse(read(template, 'package.json') ?? '{}') as { [key: string]: unknown };
  const actualPackage = JSON.parse(read(root, 'package.json') ?? '{}') as { [key: string]: unknown };
  for (const key of PACKAGE_KEYS) {
    if (JSON.stringify(actualPackage[key]) !== JSON.stringify(expectedPackage[key])) {
      problems.push(`package.json: \`${key}\` must be ${JSON.stringify(expectedPackage[key])}`);
    }
  }
  for (const key of PACKAGE_SUBSETS) {
    const expected = (expectedPackage[key] ?? {}) as { [name: string]: string };
    const actual = (actualPackage[key] ?? {}) as { [name: string]: string };
    for (const [name, value] of Object.entries(expected)) {
      if (actual[name] !== value) {
        problems.push(`package.json: \`${key}.${name}\` must be ${JSON.stringify(value)}`);
      }
    }
  }
  return problems;
}

function main(argv: string[]): number {
  if (argv.includes('--help') || argv.includes('-h')) {
    process.stdout.write(`${usage()}\n`);
    return 0;
  }
  let template: null | string = null;
  if (argv[0] === '--template' && argv[1] !== undefined && argv.length === 2) {
    template = argv[1];
  } else if (argv.length > 0) {
    process.stderr.write(`${usage()}\n`);
    return 1;
  }

  let temporary: null | string = null;
  if (template === null) {
    temporary = mkdtempSync(join(tmpdir(), 'odc-template-'));
    execFileSync('git', ['clone', '--quiet', '--depth', '1', TEMPLATE_URL, temporary], { stdio: 'inherit' });
    template = temporary;
  }
  try {
    const problems = compare(process.cwd(), template);
    for (const problem of problems) {
      process.stdout.write(`error: ${problem}\n`);
    }
    if (problems.length === 0) {
      process.stdout.write('check-template-sync: every shared file is the same as the template\n');
    }
    return problems.length > 0 ? 1 : 0;
  } finally {
    if (temporary !== null) {
      rmSync(temporary, { force: true, recursive: true });
    }
  }
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (error) {
  process.stderr.write(`check-template-sync: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
