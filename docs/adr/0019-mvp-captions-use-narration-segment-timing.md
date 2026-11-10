> Imported studio reference, based on [bfea2f8](https://github.com/phoebus-84/video-studio/tree/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc) with local source edits. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# MVP captions use narration-segment timing

The MVP derives captions from revision-linked Narration Segments and their measured placement in the edit timeline rather than adding a speech-alignment dependency. This gives deterministic sentence- or phrase-level captions for generated narration; word-level highlighting is deferred until an aligner can be introduced as a separate capability without coupling TTS generation to subtitle mechanics.
