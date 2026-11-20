> Imported studio reference, based on [9fd61f7](https://github.com/phoebus-84/video-studio/tree/9fd61f7611eb4e9557c057547aa7de3c3e71f02e). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# video-built-in-pipelines

Built-in YAML pipelines and Pi skills for the first production use cases.

## Pipelines

- `narrated-illustrated-video`: shared downstream production stages.
- `fairy-tale`: audience adaptation and illustrated narration.
- `repository-content-plan`: repository-to-series curriculum planning.
- `repository-documentation-episode`: source-grounded technical episode production.

## Principles

Pipeline manifests define what must happen and what contracts prove completion. Skills teach Pi how to perform and review each stage. Series folders may inherit, patch, replace, or add pipelines and skills without changing this repository.

## Skills sync

```bash
bun run skills:sync     # Copy skills/ → ../.pi/skills/ + manifest
bun run skills:check    # Verify no drift (read-only)
```

Per ADR-0029: `skills/` here is the single source of truth. `../.pi/skills/` is generated at sync time — never edit it by hand.

## Plan

Work is tracked once, for the whole repository, at its root; this module keeps no plan of its own.
