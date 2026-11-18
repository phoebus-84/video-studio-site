> Imported studio reference, based on [e728acc](https://github.com/phoebus-84/video-studio/tree/e728accfa468a736558b34b8032bcacfee52218b). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Exact technical graphics are rendered locally

## Status

Accepted.

## Decision

Code, labels, diagrams, charts, title text, and other precision-critical visuals are rendered by a deterministic local graphics module rather than delegated to image generation. fal remains appropriate for illustrations and creative image editing, while the local path prevents hallucinated code and illegible infographic text and preserves exact source revision provenance.
