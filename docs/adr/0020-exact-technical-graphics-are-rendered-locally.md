> Imported studio reference, based on [e2796c5](https://github.com/phoebus-84/video-studio/tree/e2796c57f66a019df41574d69bba41eb358e4e65). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Exact technical graphics are rendered locally

## Status

Accepted.

## Decision

Code, labels, diagrams, charts, title text, and other precision-critical visuals are rendered by a deterministic local graphics module rather than delegated to image generation. fal remains appropriate for illustrations and creative image editing, while the local path prevents hallucinated code and illegible infographic text and preserves exact source revision provenance.
