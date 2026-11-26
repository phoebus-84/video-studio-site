> Imported studio reference, based on [1e25f11](https://github.com/phoebus-84/sergio/tree/1e25f1100ca4d1e88bae62681ef004b70c4f9b44). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Exact technical graphics are rendered locally

## Status

Accepted.

## Decision

Code, labels, diagrams, charts, title text, and other precision-critical visuals are rendered by a deterministic local graphics module rather than delegated to image generation. fal remains appropriate for illustrations and creative image editing, while the local path prevents hallucinated code and illegible infographic text and preserves exact source revision provenance.
