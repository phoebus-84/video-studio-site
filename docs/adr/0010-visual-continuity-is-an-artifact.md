> Imported studio reference, based on [3f8895a](https://github.com/phoebus-84/video-studio/tree/3f8895af15f019d98afe93a6af8753128060a747). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Visual continuity is an artifact

## Status

Accepted, partly implemented. Channels and series have a `visual-bible/` folder, and the look a release pins is a sealed theme ([ADR-0040](./0040-channel-themes-carry-the-look-as-data.md)). No Art Direction Pack contract exists.

## Decision

Series capture recurring visual language in a Visual Bible, and each episode resolves it into an Art Direction Pack containing concrete references and continuity constraints. Scene prompts combine those artifacts with scene intent and provider-specific guidance, while every generation is preserved as an immutable Asset Attempt and selected explicitly; this supports consistent characters and diagrams without overwriting evidence during regeneration.
