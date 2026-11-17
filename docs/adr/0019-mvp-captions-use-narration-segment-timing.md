> Imported studio reference, based on [aea888a](https://github.com/phoebus-84/video-studio/tree/aea888a3b007ec8530cf98fb3abdb2f8dc6e9f63). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# MVP captions use narration-segment timing

## Status

Partly superseded by [ADR-0038](./0038-word-timing-comes-from-forced-alignment.md). Episodes built from takes get word timing by forced alignment; episodes without a spec are still captioned by narration segment.

## Decision

The MVP derives captions from revision-linked Narration Segments and their measured placement in the edit timeline rather than adding a speech-alignment dependency. This gives deterministic sentence- or phrase-level captions for generated narration; word-level highlighting is deferred until an aligner can be introduced as a separate capability without coupling TTS generation to subtitle mechanics.
