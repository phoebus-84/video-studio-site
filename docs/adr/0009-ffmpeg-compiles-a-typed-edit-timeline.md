> Imported studio reference, based on [f43b0ee](https://github.com/phoebus-84/video-studio/tree/f43b0ee50bedc4f78721e4aaf24300243d5cac78). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# FFmpeg compiles a typed edit timeline

## Status

Superseded by [ADR-0034](./0034-a-layered-kit-based-edit-timeline.md).

## Decision

Episodes express editorial decisions in a versioned declarative timeline rather than agent-authored shell commands. A dedicated composer validates that timeline, compiles FFmpeg filter graphs, runs FFmpeg and ffprobe, and emits the deliverable plus a render report; preserving the resolved command gives debuggability without making unsafe, opaque command text the production source of truth.

**Superseded by [ADR-0034](./0034-a-layered-kit-based-edit-timeline.md).** The principle stands — editorial intent is a declarative, reviewable timeline, never agent-authored render commands — but the timeline is now layered and kit-based, and Remotion renders it.
