> Imported studio reference, based on [1e25f11](https://github.com/phoebus-84/sergio/tree/1e25f1100ca4d1e88bae62681ef004b70c4f9b44). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Sergio gateway

Trusted local backend connecting browser clients, the agent (Pi RPC, Claude through the Claude Agent SDK, or any agent that speaks the Agent Client Protocol), and filesystem production state.

## Owns

Pi RPC process lifecycle, strict JSONL framing, session-to-episode association, contextual prompt/steer/follow-up routing, extension UI bridging, workspace read APIs, revision-safe edits, review threads, file watching, projections, authentication, and WebSocket/SSE delivery.

Which agent runs each episode's session is `AVG_AGENT_BACKEND`: `pi` (the default, `src/rpc/process-manager.ts`), `claude` (`src/rpc/claude-manager.ts`), or an ACP agent — `codex`, `gemini`, `opencode`, `goose`, `qwen`, `copilot`, `cursor`, `kiro`, or `acp` with `AVG_ACP_COMMAND` (`src/rpc/acp-manager.ts`, ADR-0057). The last two give the agent the same production tools over the agent's MCP server, and say the same turns (`src/rpc/turns.ts`). All three implement `AgentSessionManager`.

## Boundary

The gateway does not make creative decisions and does not replace the pipeline runtime. The browser never receives Pi credentials, provider secrets, or unrestricted filesystem access.

## Plan

Work is tracked once, for the whole repository, at its root; this module keeps no plan of its own.
