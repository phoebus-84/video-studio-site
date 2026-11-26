> Imported studio reference, based on [1e25f11](https://github.com/phoebus-84/sergio/tree/1e25f1100ca4d1e88bae62681ef004b70c4f9b44). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Pi directs a deterministic pipeline runtime

## Status

Accepted. The executive producer may be Pi or any harness that calls MCP tools — Claude Code, Codex, Gemini CLI, Cursor, VS Code, OpenCode, … — with the same tools ([ADR-0048](./0048-tools-written-once-served-to-any-harness.md)).

## Decision

Pi acts as the executive producer and retains editorial, creative, and tool-selection authority, while a deterministic pipeline runtime resolves manifests, validates artifacts, enforces gates, records state, and supports resumption and stage re-execution. This preserves the flexibility of OpenMontage's agent-first model without making GUI state and production recovery depend on the agent remembering or consistently narrating workflow state.
