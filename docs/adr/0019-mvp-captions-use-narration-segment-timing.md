> Imported studio reference, based on [3dee4dc](https://github.com/phoebus-84/sergio/tree/3dee4dc69199ab145af8d2c35d72328c9d70dd37). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# MVP captions use narration-segment timing

## Status

Partly superseded by [ADR-0038](./0038-word-timing-comes-from-forced-alignment.md). Episodes built from takes get word timing by forced alignment; episodes without a spec are still captioned by narration segment.

## Decision

The MVP derives captions from revision-linked Narration Segments and their measured placement in the edit timeline rather than adding a speech-alignment dependency. This gives deterministic sentence- or phrase-level captions for generated narration; word-level highlighting is deferred until an aligner can be introduced as a separate capability without coupling TTS generation to subtitle mechanics.
