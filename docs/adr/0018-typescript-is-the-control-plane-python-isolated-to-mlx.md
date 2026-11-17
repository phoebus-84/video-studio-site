> Imported studio reference, based on [e2796c5](https://github.com/phoebus-84/video-studio/tree/e2796c57f66a019df41574d69bba41eb358e4e65). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# TypeScript is the control plane; Python is isolated to MLX

## Status

Accepted, amended. Remotion renders the edit timeline ([ADR-0034](./0034-a-layered-kit-based-edit-timeline.md), [ADR-0036](./0036-the-studio-renders-episodes-through-the-edit-timeline.md)); Blender runs its own Python ([ADR-0033](./0033-blender-is-a-reusable-scene-provider.md)).

## Decision

Contracts, runtime, Pi package, fal adapter, graphics renderer, FFmpeg composer, gateway, and web client use TypeScript to share generated bindings and Node/Pi integration directly. The Qwen3-TTS worker remains Python because MLX Audio is its native ecosystem and communicates through a versioned local API; this limits cross-language complexity to a deliberate service boundary.
