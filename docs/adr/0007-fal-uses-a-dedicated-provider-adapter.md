> Imported studio reference, based on [e728acc](https://github.com/phoebus-84/video-studio/tree/e728accfa468a736558b34b8032bcacfee52218b). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# fal uses a dedicated provider adapter

## Status

Accepted. fal is one image route among others: OpenAI images go through `@av/codex-image`.

## Decision

The MVP integrates fal.ai only through a dedicated provider adapter rather than exposing fal's MCP server to the production agent. The adapter owns endpoint invocation, asynchronous job persistence, cancellation and resumption, output download, provenance, and cost reconciliation; model discovery through MCP can be reconsidered later without changing the pipeline or asset contracts.
