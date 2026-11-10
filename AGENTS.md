# Website repository

- This is the independent Video Studio product website, not the production application.
- Preserve the visual system in DESIGN.md and the product facts in PRODUCT.md.
- Use npm ci, npm test, npm run build. Do not add workspace:, file: or sibling-checkout dependencies.
- Source-owned website pages live in docs/. Imported technical pages are listed in data/studio-reference.json: change their source in the studio, then explicitly run reference:sync -- --from <checkout>. Never silently refresh during a build.
- Do not read/import the entire production library. Media preparation has an explicit allowlist and requires explicit source roots.
- Keep preview derivatives, production originals, credentials, node_modules, build outputs and review captures out of Git. Font files are licensed website source assets, not production media.
- Do not claim that the selected production candidates are approved releases. Publishing the site or media needs a separate operator decision.
- Browser tests use this project's own @playwright/test. Inspect desktop and mobile after visible changes.
- Do not implement production tools here. The asset-free demo renderer remains in the studio repository.
