> Imported studio reference, based on [19c5681](https://github.com/phoebus-84/video-studio/tree/19c568188fc4404961e923cc38de93940e6eb1b3). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Stages request capabilities, not providers

## Status

Accepted.

## Decision

Pipeline stages declare provider-neutral capabilities and artifact contracts, while the Pi executive producer records an explicit provider binding in the episode snapshot before execution. Adapters never perform silent provider fallback, so a new model or local backend can be introduced without rewriting pipelines and any material provider change remains visible, reviewable, and reproducible.
