> Imported studio reference, based on [3dee4dc](https://github.com/phoebus-84/sergio/tree/3dee4dc69199ab145af8d2c35d72328c9d70dd37). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Exact technical graphics are rendered locally

## Status

Accepted.

## Decision

Code, labels, diagrams, charts, title text, and other precision-critical visuals are rendered by a deterministic local graphics module rather than delegated to image generation. fal remains appropriate for illustrations and creative image editing, while the local path prevents hallucinated code and illegible infographic text and preserves exact source revision provenance.
