> Imported studio reference, based on [9aef661](https://github.com/phoebus-84/video-studio/tree/9aef661ac127f5234a4f4889e3215c0c8b4e1fb2). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Stages request capabilities, not providers

## Status

Accepted.

## Decision

Pipeline stages declare provider-neutral capabilities and artifact contracts, while the Pi executive producer records an explicit provider binding in the episode snapshot before execution. Adapters never perform silent provider fallback, so a new model or local backend can be introduced without rewriting pipelines and any material provider change remains visible, reviewable, and reproducible.
