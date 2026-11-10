> Imported studio reference, based on [bfea2f8](https://github.com/phoebus-84/video-studio/tree/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc) with local source edits. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Artifact formats follow ownership

Human-authored editorial artifacts use Markdown with YAML frontmatter, declarative pipeline and timeline structures use YAML, machine-generated manifests and reports use JSON, and execution history uses JSONL. Each concept has one canonical representation, and derivatives record source artifact revisions so direct GUI or filesystem edits can mark downstream narration, visuals, and renders stale without destroying prior attempts.
