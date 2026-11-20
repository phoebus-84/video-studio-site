> Imported studio reference, based on [9fd61f7](https://github.com/phoebus-84/video-studio/tree/9fd61f7611eb4e9557c057547aa7de3c3e71f02e). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Feedback is anchored and revisions propagate staleness

## Status

Accepted.

## Decision

GUI feedback persists as Review Threads anchored to exact artifact revisions, ranges, scenes, asset attempts, narration segments, or render timecodes, and direct edits create new artifact revisions. The dependency graph marks affected derivatives stale, re-execution creates preserved Stage Attempts, and a render becomes the Current Deliverable only when its dependencies are current or their staleness has been explicitly accepted.
