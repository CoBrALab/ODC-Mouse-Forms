// Increments the edition of every form changed between two commits whose edition was left unchanged.
//
// Usage: node .github/scripts/bump-form-editions.js <base-sha> <head-sha>
//
// Edits the working tree (expected to be checked out at <head-sha>) and prints the
// bumped forms. New and deleted forms are skipped, as are forms whose edition was
// already changed.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const FORMS_DIR = 'public/forms';
const ENTRYPOINTS = ['index.tsx', 'index.jsx', 'index.ts', 'index.js'];
const EDITION_PATTERN = /(\bedition\s*:\s*)(\d+)/g;

/** @param {string[]} args */
function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

/**
 * Returns the file's contents at the given commit, or null if it does not exist there
 * @param {string} sha
 * @param {string} filepath
 */
function readAt(sha, filepath) {
  try {
    return execFileSync('git', ['show', `${sha}:${filepath}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
}

/**
 * Returns the edition declared in the source, or null if there is not exactly one
 * @param {string} source
 */
function parseEdition(source) {
  const matches = [...source.matchAll(EDITION_PATTERN)];
  return matches.length === 1 ? Number(matches[0][2]) : null;
}

const [baseSha, headSha] = process.argv.slice(2);
if (!baseSha || !headSha) {
  console.error('Usage: node bump-form-editions.js <base-sha> <head-sha>');
  process.exit(1);
}

const changedPaths = git(['diff', '-z', '--name-only', '--diff-filter=d', baseSha, headSha, '--', FORMS_DIR])
  .split('\0')
  .filter(Boolean);

/** Names of form directories with at least one added or modified file */
const changedForms = [...new Set(changedPaths.map((filepath) => filepath.split('/')[2]).filter(Boolean))].sort();

for (const formName of changedForms) {
  const entrypoint = ENTRYPOINTS.map((name) => `${FORMS_DIR}/${formName}/${name}`).find((filepath) => {
    return readAt(headSha, filepath) !== null;
  });
  if (!entrypoint) {
    console.warn(`${formName}: no index entrypoint found, skipping`);
    continue;
  }
  const baseSource = readAt(baseSha, entrypoint);
  if (baseSource === null) {
    console.log(`${formName}: new form, skipping`);
    continue;
  }
  const headSource = readFileSync(entrypoint, 'utf8');
  const baseEdition = parseEdition(baseSource);
  const headEdition = parseEdition(headSource);
  if (baseEdition === null || headEdition === null) {
    console.warn(`${formName}: could not find exactly one edition in ${entrypoint}, skipping`);
    continue;
  }
  if (headEdition !== baseEdition) {
    console.log(`${formName}: edition already changed (${baseEdition} -> ${headEdition}), skipping`);
    continue;
  }
  writeFileSync(entrypoint, headSource.replace(EDITION_PATTERN, (_, prefix) => `${prefix}${headEdition + 1}`));
  console.log(`${formName}: bumped edition ${headEdition} -> ${headEdition + 1}`);
}
