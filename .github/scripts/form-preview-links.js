// Builds a Markdown comment with playground preview links for every form changed in a pull request.
//
// Usage: node .github/scripts/form-preview-links.js <base-sha> <head-sha> <output-file>
//
// File contents are read from git objects (never executed), so this is safe to run
// against untrusted pull request commits.

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

const FORMS_DIR = 'lib/forms';
const TEXT_EXTENSIONS = new Set(['.css', '.html', '.js', '.json', '.jsx', '.ts', '.tsx']);

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
 * because only the pull request's base branch is checked out. The URL is printed
 * to stdout; status and warnings go to stderr, which we forward to our own.
 * @param {{ content: string, name: string }[]} files
 * @param {string} label
 */
function generatePlaygroundURL(files, label) {
  const dir = mkdtempSync(path.join(tmpdir(), 'odc-form-'));
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
  console.error('Usage: node form-preview-links.js <base-sha> <head-sha> <output-file>');
  process.exit(1);
}

// Three-dot diff: only changes introduced by the PR since it diverged from the base branch
const changedPaths = gitPaths(['diff', '--name-only', '--diff-filter=d', `${baseSha}...${headSha}`, '--', FORMS_DIR]);

/** Names of form directories (e.g. "GAD_7") with at least one added or modified file */
const changedForms = [...new Set(changedPaths.map((filepath) => filepath.split('/')[2]).filter(Boolean))].sort();

const lines = [COMMENT_MARKER, '### Form previews', ''];

if (changedForms.length === 0) {
  lines.push('This pull request does not add or modify any forms.');
} else {
  lines.push('Open the forms changed in this pull request in the Open Data Capture playground:', '');
  const skipped = [];
  for (const formName of changedForms) {
    const formDir = `${FORMS_DIR}/${formName}/`;
    const files = [];
    for (const filepath of gitPaths(['ls-tree', '-r', '--name-only', headSha, '--', formDir])) {
      if (TEXT_EXTENSIONS.has(path.extname(filepath))) {
        files.push({ content: git(['show', `${headSha}:${filepath}`]), name: filepath.slice(formDir.length) });
      } else {
        console.warn(`Skipping non-text file: ${filepath}`);
      }
    }
    if (!files.some((file) => /^index\.(js|jsx|ts|tsx)$/.test(file.name))) {
      skipped.push(`- **${formName}**: no \`index\` entrypoint found`);
      continue;
    }
    const entry = `- **${formName}**: [Open in playground](${generatePlaygroundURL(files, formName)})`;
    if ([...lines, entry].join('\n').length > MAX_COMMENT_LENGTH) {
      skipped.push(`- **${formName}**: link too long to include in a comment`);
      continue;
    }
    lines.push(entry);
  }
  if (skipped.length > 0) {
    lines.push('', 'No preview link could be generated for:', '', ...skipped);
  }
}

lines.push('', `<sub>Generated for ${headSha.slice(0, 7)}</sub>`);
writeFileSync(outputFile, lines.join('\n') + '\n');
console.log(lines.join('\n'));
