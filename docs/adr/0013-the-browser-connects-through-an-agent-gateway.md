> Imported studio reference, based on [1e25f11](https://github.com/phoebus-84/sergio/tree/1e25f1100ca4d1e88bae62681ef004b70c4f9b44). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# The browser connects through an Agent Gateway

## Status

Accepted, amended by [ADR-0048](./0048-tools-written-once-served-to-any-harness.md) and [ADR-0057](./0057-every-harness-and-any-acp-agent.md): the gateway runs a Pi process, a Claude Agent SDK session, or any agent that speaks ACP (`AVG_AGENT_BACKEND`).

## Decision

The web GUI connects to a trusted Agent Gateway rather than directly owning Pi subprocesses, JSONL streams, filesystem access, or credentials. The gateway associates persistent Pi RPC sessions with episodes, translates anchored comments into prompt, steer, or follow-up messages, bridges extension UI requests, survives browser refreshes and process restarts, and multiplexes production events to authenticated clients.
