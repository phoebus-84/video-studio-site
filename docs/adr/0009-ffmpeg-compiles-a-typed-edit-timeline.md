> Imported studio reference, based on [bfea2f8](https://github.com/phoebus-84/video-studio/tree/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc) with local source edits. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# FFmpeg compiles a typed edit timeline

Episodes express editorial decisions in a versioned declarative timeline rather than agent-authored shell commands. A dedicated composer validates that timeline, compiles FFmpeg filter graphs, runs FFmpeg and ffprobe, and emits the deliverable plus a render report; preserving the resolved command gives debuggability without making unsafe, opaque command text the production source of truth.

**Superseded by [ADR-0034](./0034-a-layered-kit-based-edit-timeline.md).** The principle stands — editorial intent is a declarative, reviewable timeline, never agent-authored render commands — but the timeline is now layered and kit-based, and Remotion renders it.
