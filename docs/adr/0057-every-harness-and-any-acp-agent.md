> Imported studio reference, based on [1e25f11](https://github.com/phoebus-84/sergio/tree/1e25f1100ca4d1e88bae62681ef004b70c4f9b44). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# ADR-0057: Every harness runs the studio, and the gateway drives any ACP agent

## Status

Accepted. Implemented:
- project files for Codex (`.codex/config.toml`), Gemini CLI
  (`.gemini/settings.json`), Cursor (`.cursor/mcp.json`), OpenCode
  (`opencode.json`, both versions' forms) and VS Code with Copilot (the
  shared `.mcp.json`), all starting the MCP server of ADR-0048;
- `AGENTS.md`, the instructions every harness reads, imported by `CLAUDE.md`;
- `.agents/skills/`, written by `npm run compose` beside `.claude/skills/`;
- `studio/agent/mcp/start.mjs`, the server started from any directory;
- the MCP server's inbox delivered in tool results to every client but
  Claude Code (`AVG_MCP_INBOX`), with the library-visibility warning;
- the gateway's `AcpSessionManager` (`studio/gateway/src/rpc/acp-manager.ts`),
  chosen by `AVG_AGENT_BACKEND=codex|gemini|opencode|goose|qwen|copilot|cursor|kiro|acp`.

## Context

ADR-0048 served the studio's tools over MCP, and wired one harness besides
Pi around them: Claude Code, with its hooks, and the Claude Agent SDK in the
gateway. The tools themselves already worked in any MCP client. What did not
carry over was everything around them: the project file each harness reads to
start a server, the instructions file, the skills directory, and the two
things Claude Code's hooks did — say at session start whether the studio sees
this library, and hand the agent review activity and stage updates.

Most harnesses now share three conventions: `AGENTS.md` for instructions,
`.agents/skills/<name>/SKILL.md` for skills (Agent Skills), and a stdio MCP
server named in a project file. Few have hooks, and those that do differ.
For being driven by another program, most speak the Agent Client Protocol
(ACP): Gemini CLI, OpenCode, Goose, Qwen Code, Copilot CLI, Cursor's CLI and
Kiro natively, Codex and Claude through adapters.

## Decision

- **A project file per harness, one server.** Each starts the same
  `pva` server; nothing about a tool changes per harness. Codex's file
  approves the same read-only tools `.claude/settings.json` allows (a test
  keeps the two lists equal). Harnesses without a project file (Goose, Zed,
  Windsurf, …) are given one command, `start.mjs`, which works from any
  directory.
- **`AGENTS.md` is the instructions.** `CLAUDE.md` imports it and adds what
  is Claude Code's alone; Gemini CLI is pointed at it.
- **Skills in both layouts.** `.agents/skills/` gets the same directories as
  `.claude/skills/`; `pva_load_skill` remains for a harness that reads none.
- **The inbox goes where the client can see it.** The server knows its client
  by the name it gives at `initialize`. Claude Code keeps its hooks. Every
  other client gets the inbox appended to its next pva tool result, and the
  library-visibility warning in the first one. A tool result is the one
  channel every MCP client reads; review activity waits for the agent's next
  pva call, not for the next prompt.
- **The gateway drives any ACP agent.** `AcpSessionManager` implements
  `AgentSessionManager` as `ClaudeSessionManager` does: one agent process and
  ACP session per episode, intents as prompt turns in the same words
  (`turns.ts`), review activity as a turn, cancel as `session/cancel`, events
  on the agent channel named as Pi's. The studio's MCP server is handed to the
  agent in `session/new`. A preset names the command for each agent;
  `AVG_ACP_COMMAND` names any other. Permission requests are answered by tool
  kind (`AVG_ACP_ALLOWED_KINDS`): what Pi has, without web fetches.

## Consequences

- A new harness that reads `AGENTS.md`, `.agents/skills/` and a stdio MCP
  server needs, at most, a project file.
- Outside Claude Code, review activity reaches an idle agent only when it
  next calls a pva tool, or the operator prompts it. A harness with hooks can
  be given Claude Code's treatment with `AVG_MCP_INBOX=hook` and a hook that
  drains the same inbox.
- Codex, Gemini CLI and OpenCode were checked against their real CLIs: each
  lists `pva` and connects. Cursor's and VS Code's files follow their
  documented formats. The ACP backend was checked against a stand-in agent
  that starts the real MCP server, and against the real Codex, Gemini CLI and
  OpenCode agents up to their login.
- Each ACP agent uses the login or key of the user running the gateway, and
  its own model settings; the gateway sets neither.
- MCP prompts, the studio's slash commands, exist only where the harness
  shows them (Gemini CLI, OpenCode 2, Zed). Elsewhere the agent is asked in
  words.
