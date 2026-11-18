> Imported studio reference, based on [f43b0ee](https://github.com/phoebus-84/video-studio/tree/f43b0ee50bedc4f78721e4aaf24300243d5cac78). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Stages are typed editorial or capability; "llm" is not a capability

## Status

Accepted for pipeline manifests. A skill's frontmatter may still list `llm`; that list is not a stage capability.

## Decision

Every manifest stage declares `type: editorial` or `type: capability`. Editorial stages (brief, script, safety review, art direction) are executed by Pi through skills and declare no capability. Capability stages declare exactly one capability from the canonical vocabulary owned by contracts (`image.generate`, `image.edit`, `speech.synthesize`, `graphics.render`, `terminal.record`, `video.compose`, `media.probe`). The former `llm` capability, which meant "the agent does something unspecified," is removed, making capability binding meaningful and letting the runtime validate that every capability stage can be bound before execution.
