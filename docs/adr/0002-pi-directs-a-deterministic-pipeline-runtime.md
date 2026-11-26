> Imported studio reference, based on [3dee4dc](https://github.com/phoebus-84/sergio/tree/3dee4dc69199ab145af8d2c35d72328c9d70dd37). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Pi directs a deterministic pipeline runtime

## Status

Accepted. The executive producer may be Pi or Claude Code, with the same tools ([ADR-0048](./0048-tools-written-once-served-to-any-harness.md)).

## Decision

Pi acts as the executive producer and retains editorial, creative, and tool-selection authority, while a deterministic pipeline runtime resolves manifests, validates artifacts, enforces gates, records state, and supports resumption and stage re-execution. This preserves the flexibility of OpenMontage's agent-first model without making GUI state and production recovery depend on the agent remembering or consistently narrating workflow state.
