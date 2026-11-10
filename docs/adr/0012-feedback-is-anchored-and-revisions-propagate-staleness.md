> Imported studio reference, based on [bfea2f8](https://github.com/phoebus-84/video-studio/tree/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc) with local source edits. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Feedback is anchored and revisions propagate staleness

GUI feedback persists as Review Threads anchored to exact artifact revisions, ranges, scenes, asset attempts, narration segments, or render timecodes, and direct edits create new artifact revisions. The dependency graph marks affected derivatives stale, re-execution creates preserved Stage Attempts, and a render becomes the Current Deliverable only when its dependencies are current or their staleness has been explicitly accepted.
