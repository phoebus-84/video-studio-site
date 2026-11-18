> Imported studio reference, based on [f43b0ee](https://github.com/phoebus-84/video-studio/tree/f43b0ee50bedc4f78721e4aaf24300243d5cac78). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Visual continuity is an artifact

## Status

Accepted, partly implemented. Channels and series have a `visual-bible/` folder, and the look a release pins is a sealed theme ([ADR-0040](./0040-channel-themes-carry-the-look-as-data.md)). No Art Direction Pack contract exists.

## Decision

Series capture recurring visual language in a Visual Bible, and each episode resolves it into an Art Direction Pack containing concrete references and continuity constraints. Scene prompts combine those artifacts with scene intent and provider-specific guidance, while every generation is preserved as an immutable Asset Attempt and selected explicitly; this supports consistent characters and diagrams without overwriting evidence during regeneration.
