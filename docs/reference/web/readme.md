> Imported studio reference, based on [bfea2f8](https://github.com/phoebus-84/video-studio/tree/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc) with local source edits. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# video-studio-web

Browser production studio for inspecting and steering every stage of an episode.

## Core surfaces

Channel and series library, pipeline/stage rail, editable editorial documents, scene timeline, asset attempt comparison, audio and video review, anchored comments, generation progress, staleness explanations, budget/provenance views, approvals, and targeted reruns.

## Product constraints

The GUI is a projection over the canonical workspace. Every mutation uses revision checks. It must remain useful while Pi is offline, expose errors and degraded states, support keyboard navigation and accessible media controls, and avoid hiding production history behind a chat-only interface.

## Approved product direction

The studio is a desktop-first localhost companion for a technical solo creator. Creation begins in Pi; the GUI optimizes for exception supervision while allowing granular artifact, media, review, and rerun work.

The approved direction is **The Provenance Workbench**: restrained hierarchy and keyboard fluency inspired by Linear, focused media inspection inspired by DaVinci Resolve, and structural trees and panes inspired by VS Code. It follows the operating-system theme and targets WCAG 2.2 AA.

Required design context:

- [`PRODUCT.md`](./product.md)
- [`DESIGN.md`](./design.md)
- [`docs/SHAPE-BRIEF.md`](./docs/shape-brief.md)

## Trust boundary

The GUI is a projection over the canonical workspace. It talks only to the trusted Agent Gateway, never owns Pi processes or provider credentials, never accesses unrestricted filesystem paths, and never overwrites immutable generated attempts. See [`docs/CONTRACT.md`](./docs/contract.md).

## Development

This repository currently contains the approved design context and its deterministic validator. The Svelte application scaffold begins in `vsw-pbt.2`.

```bash
npm run check
```

Contributor and operator guidance:

- [`docs/CONTRIBUTING.md`](./docs/contributing.md)
- [`docs/OPERATOR.md`](./docs/operator.md)

## Plan

Run `bd list`, `bd graph`, and `bd show <id>`.
