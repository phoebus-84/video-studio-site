> Imported studio reference, based on [7f73c14](https://github.com/phoebus-84/video-studio/tree/7f73c14cedca6c53bd96e135865f619e70c2af69). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Sergio gateway

Trusted local backend connecting browser clients, the agent (Pi RPC, or Claude through the Claude Agent SDK), and filesystem production state.

## Owns

Pi RPC process lifecycle, strict JSONL framing, session-to-episode association, contextual prompt/steer/follow-up routing, extension UI bridging, workspace read APIs, revision-safe edits, review threads, file watching, projections, authentication, and WebSocket/SSE delivery.

Which agent runs each episode's session is `AVG_AGENT_BACKEND`: `pi` (the default, `src/rpc/process-manager.ts`) or `claude` (`src/rpc/claude-manager.ts`, the same production tools over the agent's MCP server). Both implement `AgentSessionManager`.

## Boundary

The gateway does not make creative decisions and does not replace the pipeline runtime. The browser never receives Pi credentials, provider secrets, or unrestricted filesystem access.

## Plan

Work is tracked once, for the whole repository, at its root; this module keeps no plan of its own.
