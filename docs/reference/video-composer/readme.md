> Imported studio reference, based on [bfea2f8](https://github.com/phoebus-84/video-studio/tree/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc) with local source edits. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# ffmpeg-video-composer

Compiler and validator for typed video edit timelines.

## Owns

Timeline validation, media normalization, deterministic FFmpeg filter-graph compilation, image motion, transitions, overlays, caption burn-in, narration/music mixing, loudness normalization, encoding profiles, ffprobe reports, frame sampling, audio QA, cancellation, and reproducibility bundles.

## Boundary

The edit timeline is canonical editorial intent. Generated shell commands are preserved diagnostics, not editable production state. Arbitrary shell fragments are rejected.

## Plan

Run `bd list`, `bd graph`, and `bd show <id>`.
