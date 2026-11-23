# Open Data Capture instruments

This repository holds instruments for [Open Data Capture](https://opendatacapture.org) (ODC). An ODC instance imports the instruments directly from the `main` branch of this repository.

## Specification

The instrument specification is `node_modules/@opendatacapture/instrument-guidelines/AGENTS.md`. Run `pnpm install`, then read the full specification before you write or change an instrument. The specification is the version that agrees with the installed runtime. The rules below add to it.

## Layout

Each instrument is one directory with an `index.ts` or `index.tsx` entrypoint:

- `lib/forms/<NAME>/` for `FORM` instruments
- `lib/interactive/<NAME>/` for `INTERACTIVE` instruments
- `lib/series/<NAME>/` for `SERIES` instruments
- `lib/file/<NAME>/` for `FILE` instruments

ODC imports these four directories only. An instrument in a different location is not imported.

## Edition

ODC identifies collected data by `internal.name` and `internal.edition`. When you change a file in the directory of an existing form, interactive or file instrument, increase its `internal.edition` by one. Increase it one time for each branch, not one time for each commit. If a series in `lib/series` refers to the instrument, set the `edition` in the series to the new value.

## Completion

A change is complete when `pnpm check` passes. If a step fails:

- Type or lint error: run `pnpm lint`, then correct the remaining errors.
- Format error: run `pnpm format`.
- Edition error: increase `internal.edition` as the Edition section tells you.

To see an instrument, run `pnpm exec serve-instrument lib/<category>/<NAME>` and open it with the `agent-browser` skill.

## Shared files

The CI workflows, the files in `scripts/` and `.github/scripts/`, the tool configuration, and the text of this file above the marker line are copies from [ODC_Instruments_Template](https://github.com/DouglasNeuroInformatics/ODC_Instruments_Template). Change them in the template first, then copy the change here. `pnpm check-template` shows the copies that are different from the template.

<!-- repository-specific -->

## This repository

- The forms record mouse experiment metadata for the CoBrA Lab. Form directories have the name `CoBrALab-<Name>-Form`.
- `src/`, `index.html` and `vite.config.js` are the Form Viewer website. `lib` is its Vite public directory, thus each form source is published at `/forms/<Form-Name>/index.ts`. `pnpm dev` starts the viewer locally and `pnpm build` builds it.
- A push to `main` deploys the viewer to GitHub Pages (`.github/workflows/deploy-site.yml`).

### Known failures

The forms were written before this repository had a type-check, ESLint and Prettier. Until a maintainer corrects them, `pnpm check` fails on `main`: one type error in `CoBrALab-Mouse-End-Of-Life-Form`, ESLint errors in 8 forms, and 28 forms that are not in Prettier format. Until then, a change is complete when these commands pass for the files that you changed:

```sh
pnpm exec eslint --fix <files>
pnpm exec prettier --write <files>
pnpm check-editions
```

Also make sure that `pnpm exec tsc` reports no error in the files that you changed. Use these commands and not `pnpm format`, because `pnpm format` changes all the forms and each changed form then needs a new edition.
