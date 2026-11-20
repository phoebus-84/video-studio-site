> Imported studio reference, based on [19c5681](https://github.com/phoebus-84/video-studio/tree/19c568188fc4404961e923cc38de93940e6eb1b3). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Bun is the package manager for all TypeScript modules

## Status

Accepted.

## Decision

All TypeScript modules standardize on Bun: `bun.lock` is the only lockfile, `package-lock.json` files are deleted, and install/test/build commands in READMEs and scripts use `bun` / `bunx`. Python modules (qwen-tts-worker) are unaffected. This removes the current mixed state where several modules carried both lockfiles and CI commands disagreed with local development.
