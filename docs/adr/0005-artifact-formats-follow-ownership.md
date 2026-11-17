> Imported studio reference, based on [aea888a](https://github.com/phoebus-84/video-studio/tree/aea888a3b007ec8530cf98fb3abdb2f8dc6e9f63). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Artifact formats follow ownership

## Status

Accepted, amended. JSON also holds the edit timeline (`artifacts/edit-timeline.json`, [ADR-0034](./0034-a-layered-kit-based-edit-timeline.md)) and the episode spec ([ADR-0037](./0037-series-templates-pin-editorial-standards.md)); YAML holds settings and pipeline manifests.

## Decision

Human-authored editorial artifacts use Markdown with YAML frontmatter, declarative pipeline and timeline structures use YAML, machine-generated manifests and reports use JSON, and execution history uses JSONL. Each concept has one canonical representation, and derivatives record source artifact revisions so direct GUI or filesystem edits can mark downstream narration, visuals, and renders stale without destroying prior attempts.
