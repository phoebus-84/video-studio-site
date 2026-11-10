> Imported studio reference, based on [bfea2f8](https://github.com/phoebus-84/video-studio/tree/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc) with local source edits. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Bun is the package manager for all TypeScript modules

All TypeScript modules standardize on Bun: `bun.lock` is the only lockfile, `package-lock.json` files are deleted, and install/test/build commands in READMEs and scripts use `bun` / `bunx`. Python modules (qwen-tts-worker) are unaffected. This removes the current mixed state where several modules carried both lockfiles and CI commands disagreed with local development.
