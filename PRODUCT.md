# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

Video Studio is a local, agent-directed video production system. This English-language website explains the product, makes installation approachable, and teaches through recipes and selected real examples. This purpose is explicit in the operator's request.

## Users

Confirmed by the operator in the interactive brief: technically comfortable creators and small production teams evaluating a local production workflow. They need to understand the product, install it locally and start from reproducible examples. No claim that this is a no-code hosted service.

## Positioning

An agent coordinates reusable media tools while files, timelines, production state, review gates and budget records remain inspectable. Tools are written once for Pi and exposed to Claude Code through MCP.

## Operating Context

Independent VitePress website in its own Git repository, using Node 22 and npm. The Video Studio application remains a separate Bun workspace. Technical documentation is an explicitly imported, hash-recorded snapshot; normal site builds do not read a studio checkout or production library. Users can start with existing media and add generation providers later.

## Capabilities and Constraints

- Packages cover graphics, archive media, audio edits, speech, generated imagery, Blender and composition.
- Optional capabilities require their own software, hardware, authentication or provider fees. Local MLX speech requires Apple Silicon.
- Only the operator grants production approvals. Agents request them.
- Generated production media is never committed to git. Website derivatives remain ignored and are prepared explicitly from selected sources.
- Preserve technical documentation in the application; import only explicit, versioned reference snapshots into this website. Never add workspace or sibling-checkout build dependencies.
- Collaboration is a core product message explicitly requested by the operator: each channel’s text is versioned in its own Git repository; the media lock identifies exact binary versions, and optional S3-compatible storage restores them across machines. Do not imply real-time co-editing, automatic distributed locking or per-person approval signatures.
- The operator requested public GitHub and Pages publication: source at `phoebus-84/video-studio-site`, site at `https://phoebus-84.github.io/video-studio-site/`. This is not production approval or a blanket distribution licence. V006 soundtrack redistribution permission remains unestablished; its media is withheld. Published full downloads retain credits; Sonnet 18 is explicitly a silent full-length edition.

## Brand Commitments

English site content; the existing Video Studio / Agentic Video Studio name. No existing marketing visual identity was found.

## Evidence on Hand

The studio's documentation, package READMEs and manifests establish functionality; `data/studio-reference.json` records the version used here. Production libraries and experiment folders live outside this repository, with explicit roots required only for optional media preparation. The operator explicitly selected Lontano, a dicembre instead of Negative Space, and requested the latest Ambient Through Time, JaroMail and Nothing Is Only One Thing videos. The latter is V006, a review candidate rather than an approved release. The site pins the exact inspected source selections rather than assuming every current pointer is newest. The user permits selecting and refining examples; source recordings and production originals must remain untouched. There are no confirmed testimonials or usage metrics.

## Product Principles

1. Explain the workflow before the architecture.
2. Start with the smallest useful installation; make optional requirements explicit.
3. Show real outputs and distinguish experiments from repeatable recipes.
4. Do not turn provider availability, test results or local previews into unsupported promises.
5. Teach development as well as production: the operator wants substantial promotional/educational guides showing research, agent proposals, contributed material, human decisions and reusable channel/character/series preparation. Short prompts are the outcome of that preparation, not a substitute for it. The paired recital/lesson request for Poesie al museo is the concrete case study.
