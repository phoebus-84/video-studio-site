---
title: Website maintenance
description: Build this independent Video Studio website, refresh its explicit technical-reference snapshot and prepare selected preview media safely.
---
# Maintaining this website

The website has its own Git repository, dependency lockfile and test suite. It
is not a workspace of the production application. A build does not need an
agent, gateway, production library or neighbouring studio checkout.

## Run and build

Use Node 22+ and npm **in the website repository**:

```bash
npm ci
npm run dev
npm run check
npm run preview
```

`check` runs the website tests, verifies imported-reference hashes and builds
VitePress with internal-link checking. Output is `docs/.vitepress/dist/`.

The installation commands elsewhere on this site, including `demo:render`,
are for the **Video Studio application**, not this repository.

## Prepare selected previews

`docs/showcase.mjs` holds editorial metadata. `tools/prepare-site-media.mjs`
reads six explicitly selected originals: Lontano v03, Kowloon’s one-hour
film, JaroMail pixel v4, Nothing Is Only One Thing V006, the underwater Blender
study and Sonnet 18. Selection is not production approval.

The preview bundle in `docs/public/showcase/` is ignored by Git. A clone
without it still builds and shows deliberate text fallbacks with recipe links.
To prepare the bundle, install FFmpeg/ffprobe and provide source roots
explicitly—there is no default sibling checkout or implicit library scan:

```bash
SITE_TESTS_ROOT=/path/to/experiments \
SITE_LIBRARY_ROOT=/path/to/library \
npm run media:prepare -- --dry-run
```

Inspect the printed selection, then run the same command without `--dry-run`.
Finally:

```bash
npm run media:check
npm run build
```

The tool prepares bounded H.264 excerpts at no more than 1280×720, preserves
aspect ratio, strips embedded metadata and verifies full decoding, codecs,
dimensions and duration. Four films retain audio with short edge fades;
Blender and Sonnet remain silent. Narrated excerpts get retimed English
captions; instrumental excerpts get non-speech captions. Posters, credit files
and SHA-256 receipts accompany the videos. Originals are never overwritten.

For the published selection, run `npm run media:restore-public` instead of
supplying production sources. It verifies the SHA-256-pinned release archive,
checks the filename allowlist and replaces the preview folder. It deliberately
excludes Nothing Is Only One Thing V006. This public bundle is distinct from
the six-item local review bundle checked by `media:check`. Never make the whole
library a public folder.

::: warning Publication remains a separate decision
A local preview or a Git commit does not grant publication rights. Retain
soundtrack/footage credits and applicable CC BY / CC BY-SA terms. Nothing Is
Only One Thing uses the operator-supplied “Acid In My Lounge” by Simio
Sakrecoer; its public redistribution licence has not been established. Clear
those rights before public hosting. Silent excerpts also require a rights check.
:::

## Technical reference snapshot

Technical source documentation stays with the application. This repository
commits a selected snapshot so visitors can read it and builds can run offline
without a studio checkout. `data/studio-reference.json` records the source
revision, whether local edits were present, the component catalog, registered
command names and exact file hashes. Imported pages identify themselves.

Refresh deliberately, not as an install/build side effect:

```bash
# First, in the selected Video Studio checkout:
npm run docs:generate
# Then, in this website repository:
npm run reference:sync -- --from /path/to/video-studio
npm run check
```

Review and commit the diff. The importer reads but does not execute or change
the application. It preserves edited local snapshot files by refusing to
replace them. Internal implementation reviews, planning archives, module trackers,
hidden caches, production media and application source are not copied. References
to excluded material go to the pinned upstream source instead. Previously imported
pages that are now excluded are removed only after their recorded hashes are checked.

To fix a technical claim, change its authoritative source first: schemas,
registrations, composition manifest and implementation—not a historical plan
or one library project. The import is explicit evidence of a particular
checkout, not a claim to follow the newest upstream commit automatically.

Named case studies belong to this website. The production repository's
library-name boundary check no longer needs to exempt marketing examples.

## Where to edit

| Surface | Website source |
|---|---|
| Homepage | `docs/.vitepress/theme/components/HomePage.vue` |
| Gallery | `ExamplesPage.vue` and `docs/showcase.mjs` |
| Recipes | `docs/recipes/` and the theme’s `recipes.mjs` |
| Collaboration / onboarding | `docs/collaboration.md`, `docs/quick-start.md` |
| Typography, colour and layout | `docs/.vitepress/theme/style.css` |
| Navigation and metadata | `docs/.vitepress/config.mts` |
| Media preparation | `tools/prepare-site-media.mjs` |
| Imported documentation | Original studio sources; then `reference:sync` |

Fraunces and Inter are self-hosted with their licences. No analytics, external
font requests or third-party video embeds are added.

## Browser checks

With a built site, local preview server and prepared media:

```bash
npx playwright install chromium
npm run test:browser
```

Playwright is a dependency of this repository. `SITE_URL` overrides the default
`http://127.0.0.1:4173/`. The test covers playback, captions, pause-on-switch,
retry, filters, searches, clipboard fallback, navigation, recipes, reduced
motion and 320/390px overflow. Results and screenshots stay ignored in
`.impeccable/review/`.

## Static hosting

The public source repository is [phoebus-84/video-studio-site](https://github.com/phoebus-84/video-studio-site).
The site is [hosted on GitHub Pages](https://phoebus-84.github.io/video-studio-site/).
Pushes to `main` run `.github/workflows/pages.yml`: install, test, explicitly
restore the public media archive, build for `/video-studio-site/`, then deploy
only `docs/.vitepress/dist/`. Pull requests cannot deploy. Pages uses the
workflow's short-lived token, not a committed credential.

Full-length files are hosted separately in the `showcase-v1` GitHub Release,
not in Git or the Pages artifact. `data/public-media.json` pins their URLs,
sizes, durations and hashes. The gallery provides download buttons and a
credits/licences download. Lontano and JaroMail retain audio; the hour-long
Kowloon web edition is 720p to stay below GitHub’s 2 GB asset limit. Blender
is silent. Sonnet 18 is a full-length **silent visual edition**, not its
original sound edition. V006 has neither public media nor a download button.

The explicit `media:stage-public` command prepares future release derivatives
from the named sources with both source-root variables set. It writes only
ignored `.site-media/` files and publication receipts; it never uploads.
Review rights, full-film credits and derivatives before uploading to a new
release and updating the pinned policy. Never overwrite an existing asset
silently; a changed preview checksum fails the deployment.

For a subdirectory:

```bash
npm run media:restore-public
DOCS_BASE=/video-studio-site/ npm run build
DOCS_BASE=/video-studio-site/ npm run preview
```

Verify extensionless routes, direct `.html` routes and media under that base.
Test a clean clone without media as well as the public media bundle. Never
publish the source library, local release staging or a development server.
