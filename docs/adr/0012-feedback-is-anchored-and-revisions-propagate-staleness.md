> Imported studio reference, based on [f43b0ee](https://github.com/phoebus-84/video-studio/tree/f43b0ee50bedc4f78721e4aaf24300243d5cac78). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Feedback is anchored and revisions propagate staleness

## Status

Accepted.

## Decision

GUI feedback persists as Review Threads anchored to exact artifact revisions, ranges, scenes, asset attempts, narration segments, or render timecodes, and direct edits create new artifact revisions. The dependency graph marks affected derivatives stale, re-execution creates preserved Stage Attempts, and a render becomes the Current Deliverable only when its dependencies are current or their staleness has been explicitly accepted.
