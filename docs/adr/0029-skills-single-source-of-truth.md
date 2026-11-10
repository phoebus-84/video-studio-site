> Imported studio reference, based on [bfea2f8](https://github.com/phoebus-84/video-studio/tree/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc) with local source edits. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# video-built-in-pipelines is the single source of truth for production skills

The canonical copies of all production skills (write-brief, write-script, art-direction, compose-video, safety-review, and the rest) live in `video-built-in-pipelines/skills/`. A sync script installs them into `.pi/skills/` and writes a checksum manifest so drift is detectable; the `.pi/skills/` copies are generated artifacts that must never be edited directly. The `pva-executive-producer` skill remains in `pi-video-agent` because it documents that package's own commands and tools. This eliminates the three divergent copies that previously contradicted each other (including the `final.mp4` versus `output.mp4` naming conflict).
