> Imported studio reference, based on [bfea2f8](https://github.com/phoebus-84/video-studio/tree/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc) with local source edits. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Stages are typed editorial or capability; "llm" is not a capability

Every manifest stage declares `type: editorial` or `type: capability`. Editorial stages (brief, script, safety review, art direction) are executed by Pi through skills and declare no capability. Capability stages declare exactly one capability from the canonical vocabulary owned by contracts (`image.generate`, `image.edit`, `speech.synthesize`, `graphics.render`, `terminal.record`, `video.compose`, `media.probe`). The former `llm` capability, which meant "the agent does something unspecified," is removed, making capability binding meaningful and letting the runtime validate that every capability stage can be bound before execution.
