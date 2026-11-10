# Video Studio website

The English-language product website for [Video Studio](https://github.com/phoebus-84/video-studio): introduction, installation guide, collaboration, recipes and six selected real examples.

**This is an independent Git project, not a studio workspace.** It needs Node 22+ and npm. Building it does not require the studio, a production library, FFmpeg, an agent, provider credentials or a sibling directory.

## Develop

```bash
npm ci
npm run dev             # local VitePress server
npm run check           # unit tests, reference receipts and static build
npm run preview         # serve the built site on port 4173
```

The output is `docs/.vitepress/dist/`. Source: https://github.com/phoebus-84/video-studio-site. Public site: https://phoebus-84.github.io/video-studio-site/.

Pushes to `main` deploy through `.github/workflows/pages.yml`. The workflow tests the source, restores only the checksum-pinned public preview bundle from GitHub Releases, builds with `DOCS_BASE=/video-studio-site/`, and deploys the static output using GitHub Pages’ short-lived token. Pull requests only run checks; they do not deploy.

## Test in a browser

```bash
npx playwright install chromium
npm run build
npm run preview         # leave running in another terminal
npm run test:browser
```

Playwright is declared here, not borrowed from the studio. Restore the public preview bundle with `npm run media:restore-public` before the full browser test; a normal clone without that bundle builds with useful text fallbacks. `SITE_URL` overrides the test URL. Review captures remain ignored in `.impeccable/review/`.

## Selected films

`docs/showcase.mjs` and `tools/prepare-site-media.mjs` are the explicit selection, not a recursive export. Prepared excerpts have been moved here locally under `docs/public/showcase/`, which stays **out of Git**. Production originals remain wherever the operator keeps them.

To regenerate, explicitly provide both source roots:

```bash
SITE_TESTS_ROOT=/path/to/experiments \
SITE_LIBRARY_ROOT=/path/to/production-library \
npm run media:prepare -- --dry-run
# Use the same environment without --dry-run after checking the selection.
npm run media:check
npm run build
```

Preparation/checking requires FFmpeg and ffprobe. No uploads or paid generation occur. The local review bundle includes receipts that are not part of the public archive. All six selected films now have public excerpts and full-length download editions. The operator confirmed permission to publish the V006 soundtrack, identified as CC BY-NC-SA (version unspecified); retain its attribution, non-commercial and share-alike terms.

## Published media

`data/public-media.json` pins the public selection, release URLs, sizes, durations and SHA-256 hashes. Preview derivatives and full films remain outside Git. The gallery offers six full-length downloads from the `showcase-v2` GitHub Release, with a separate credits file:

- Lontano v03 and JaroMail pixel v4: 1080p, original audio; JaroMail retains embedded captions.
- Kowloon: the complete hour at 720p, original audio. The 3.4 GB original exceeds GitHub’s per-asset limit; the web derivative stays below 2 GB. Full soundtrack and embedded-footage attributions accompany it.
- Nothing Is Only One Thing V006: complete 1080p review candidate, original audio and embedded English/Italian captions. Music: Simio Sakrecoer, “Acid In My Lounge” — CC BY-NC-SA, version unspecified; publication permission confirmed by the operator. This soundtrack licence does not automatically license the whole film.
- Underwater: the complete 15-second silent study.
- Sonnet 18: the complete 54-second visual edition, deliberately silent as in the excerpt. This is not a download of its original audio edition.

To restore only public excerpts (no FFmpeg or production sources needed):

```bash
npm run media:restore-public
DOCS_BASE=/video-studio-site/ npm run build
DOCS_BASE=/video-studio-site/ npm run preview
SITE_URL=http://127.0.0.1:4173/video-studio-site/ npm run test:browser
```

The restore verifies the archive checksum and filename allowlist, and replaces the local preview folder so only the explicit public selection can enter a deployment. A build itself never fetches or refreshes media.

For a future media release, explicitly prepare the local excerpts, review the selection and rights, then stage derivatives:

```bash
SITE_TESTS_ROOT=/path/to/experiments \\
SITE_LIBRARY_ROOT=/path/to/production-library \\
npm run media:stage-public
```

This website utility reads only named sources, strips container metadata, checks complete duration and decoding, confirms source hashes are unchanged, and writes ignored `.site-media/` files plus updated receipts. It does **not** upload. Review the files and credits before explicitly uploading to a new GitHub Release and committing the matching policy. Do not silently replace existing release assets: the Pages workflow intentionally rejects checksum mismatches.

Public distribution is not production approval. V006 remains a review candidate even though the operator has permitted its website distribution. The initial public commit is a clean snapshot; pre-publication local history containing the removed internal review is not pushed.

## Technical reference snapshot

Technical documentation remains owned by the studio. This site commits an explicit snapshot, with source revision, file hashes and a local-edit flag in `data/studio-reference.json`. A regular build checks only those local files. It neither fetches nor executes studio code.

To refresh deliberately:

```bash
# In the chosen studio checkout first:
npm run docs:generate
# Then in THIS repository:
npm run reference:sync -- --from /path/to/video-studio
npm run check
```

Review and commit the imported diff. The importer never changes the source checkout. Historical plans, module trackers, hidden caches, application code, private library files and secrets are not imported. Links to excluded historical material point to the pinned source on GitHub. Local modifications to an imported copy are refused rather than overwritten.

Homepage, gallery, recipes, collaboration, onboarding and maintenance pages belong here. Edit imported technical pages in their original repository, then refresh. See [website maintenance](docs/site-maintenance.md).

## The first-render recipe is a studio command

`npm run demo:render` and `tools/first-render.mjs` belong to **video-studio**, where the compositor is installed. They are intentionally not dependencies or scripts of this website. Product-install commands shown on the site are for that repository, not this one.

## Dependencies and rights

Dependencies are locked in `package-lock.json`. Fraunces and Inter are self-hosted with their licence files in `docs/public/fonts/`. Run `npm audit` when updating dependencies; stable VitePress 1.6 currently carries upstream Vite/esbuild development-server advisories. Keep development servers private; do not serve untrusted projects or treat the development server as a production host. No unsupported major-version override is applied just to hide those advisories.
