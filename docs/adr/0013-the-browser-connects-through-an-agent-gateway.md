> Imported studio reference, based on [e728acc](https://github.com/phoebus-84/video-studio/tree/e728accfa468a736558b34b8032bcacfee52218b). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# The browser connects through an Agent Gateway

## Status

Accepted, amended by [ADR-0048](./0048-tools-written-once-served-to-any-harness.md): the gateway runs a Pi process or a Claude Agent SDK session (`AVG_AGENT_BACKEND`).

## Decision

The web GUI connects to a trusted Agent Gateway rather than directly owning Pi subprocesses, JSONL streams, filesystem access, or credentials. The gateway associates persistent Pi RPC sessions with episodes, translates anchored comments into prompt, steer, or follow-up messages, bridges extension UI requests, survives browser refreshes and process restarts, and multiplexes production events to authenticated clients.
