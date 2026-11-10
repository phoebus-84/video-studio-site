# Documentation

Everything is here, in one place.

## Start

| Document | What it answers |
|---|---|
| [Install and composition](./install) | How do I install this, and choose which pieces are wired? |
| [Collaboration, Git and S3](./collaboration) | How do we version a channel, share media and continue work on another machine? |
| [Running the agent](./running) | How do I actually run it? |
| [Repository layout](./repository-layout) | Why is the tree split into `packages/` and `studio/`, and where does my code go? |
| [Contributing](./contributing) | How do I add a package, capability, skill or pipeline? |

## Understanding the system

| Document | What it answers |
|---|---|
| [Architecture](./architecture) | How does the system behave, and where are the boundaries? |
| [Domain language](./context) | What does each term mean? Read this before naming anything. |
| [Workspace layout](./workspace) | What does the on-disk channel/series/episode tree look like? |
| [Pipelines](./pipelines) | How are pipeline manifests and overrides structured? |
| [DaVinci Resolve handoff](./resolve-handoff) | How do I bring reviewed cuts, assets and revised narration to a human editor through upstream MCP? |

## Packages

Reusable outside this project. They know nothing about episodes or pipelines.

| Package | Capabilities |
|---|---|
| [remotion-composer](./packages/remotion-composer) | `video.compose`: layered episode timelines |
| [blender](./packages/blender) | `scene.create`, `scene.render` |
| [voice](./packages/voice) | `speech.synthesize`; the worker also supports alignment |
| [fal-media](./packages/fal-media) | `image.generate`, `image.edit`, `video.generate` |
| [codex-image](./packages/codex-image) | `image.generate`, `image.edit` |
| [graphics](./packages/graphics) | `graphics.render` |
| [infographics](./packages/infographics) | `graphics.animate` |
| [terminal-recorder](./packages/terminal-recorder) | `terminal.record` |
| [video-composer](./packages/video-composer) | `video.compose`: multitrack work; `media.probe` |

The [component reference](./reference/) and sidebar follow the studio's
composition manifest as captured in this site's [versioned snapshot](./site-maintenance#technical-reference-snapshot), not a neighbouring checkout. Three additional packages used by agent tools are not
currently in that manifest: `packages/archive-media` (licensed acquisition),
`packages/audio-edit` (audio recipes) and `packages/elevenlabs` (alignment).
Their READMEs live with their code; they do not yet have generated component
pages. A vocabulary entry, a wired provider and a ready local installation are
different things.

## Studio

The product. Depends on `packages/`. All studio-specific integration lives here.

| Module | Role |
|---|---|
| [contracts](./studio/contracts) | Canonical schemas, vocabulary, bindings |
| [series](./studio/series) | Series compilers: episode spec and narration → edit timeline |
| [episode](./studio/episode) | An episode on disk, produced: timeline built or compiled, checked, rendered |
| [runtime](./studio/runtime) | Snapshots, leases, staleness, journal, policy |
| [pipelines](./studio/pipelines) | Built-in pipeline manifests |
| [agent](./studio/agent) | The executive-producer package: a Pi extension, served to Claude Code over MCP |
| [adapters](./studio/adapters) | Stage adapters: the code that performs a stage, matched by contract |
| [gateway](./studio/gateway) | Agent sessions (Pi RPC or the Claude Agent SDK) and event streaming |
| [web](./studio/web) | Browser studio |

Each component page links to a snapshot of that component's README and `docs/`.
The originals stay with the studio code. Refreshing the snapshot is explicit;
a normal website build neither reads nor executes the application.

## Decision records

Decision records preserve design history, not a list of universally current
contracts. Read each record's status where provided and follow superseding
decisions; old plans are not implementation evidence. These records most shape
the current code:

| ADR | Decision |
|---|---|
| [0015](./adr/0015-stages-request-capabilities-not-providers) | Stages request capabilities, not providers |
| [0024](./adr/0024-canonical-pipeline-manifest-owned-by-contracts) | The pipeline manifest schema is owned by contracts |
| [0026](./adr/0026-capability-dispatch-via-package-imports) | Capability dispatch uses package imports, never path guessing |
| [0029](./adr/0029-skills-single-source-of-truth) | `skills/` is the source of truth; `.pi/skills/` is generated |
| [0030](./adr/0030-secrets-are-environment-only-and-dev-auth-is-explicit) | Secrets are environment-only |
| [0032](./adr/0032-single-repository-with-reusable-packages) | One repository, split into reusable packages and the product |
| [0034](./adr/0034-a-layered-kit-based-edit-timeline) | The edit timeline is layered, kit-based and derived from the spec |
| [0035](./adr/0035-shared-material-is-pinned-never-copied) | Shared material is pinned with an inventory, never copied |
| [0036](./adr/0036-the-studio-renders-episodes-through-the-edit-timeline) | The studio renders episodes through the edit timeline, with Remotion |
| [0037](./adr/0037-series-templates-pin-editorial-standards) | Series templates pin editorial standards |
| [0038](./adr/0038-word-timing-comes-from-forced-alignment) | Word timing comes from forced alignment against the text |
| [0039](./adr/0039-format-kits-share-frozen-libraries) | Format kits share frozen libraries, locked with them |
| [0040](./adr/0040-channel-themes-carry-the-look-as-data) | Channel themes carry the look as data |
| [0041](./adr/0041-a-series-release-carries-its-own-code) | A series release carries its own code |
| [0042](./adr/0042-kits-a-channel-or-series-carries) | Kits a channel or a series carries |
| [0043](./adr/0043-the-toolbox-for-library-code) | The toolbox for a channel's and a series' code |
| [0044](./adr/0044-the-application-ships-no-channel) | The application ships no channel's format |
| [0045](./adr/0045-a-channel-is-its-own-repository) | A channel is its own repository; its media are named by hash |
| [0046](./adr/0046-archive-media-carry-licence-and-evidence) | Archive media carry their licence and its evidence |
| [0047](./adr/0047-audio-edits-are-recipes) | Audio edits are recipes: cut on words, mixed, mastered, reproducible |
| [0048](./adr/0048-tools-written-once-served-to-any-harness) | The agent's tools are written once, for Pi, and served to other harnesses over MCP |
| [0049](./adr/0049-channel-media-use-a-content-addressed-s3-remote) | Channel media use a content-addressed S3-compatible remote |

ADR-0022 (independent repositories per module) is superseded by 0032.
ADR-0009 (FFmpeg compiles a typed edit timeline) is superseded by 0034.
ADR-0023's flat layout is superseded by the current workspace contract.
