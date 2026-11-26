> Imported studio reference, based on [1e25f11](https://github.com/phoebus-84/sergio/tree/1e25f1100ca4d1e88bae62681ef004b70c4f9b44). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# pi-video-agent

A distributable Pi package that turns Pi into Sergio's executive producer.

## Owns

- Pi extensions and production tools.
- Idempotent filesystem authoring for channels, series, and episode workspaces.
- Commands for channel, series, episode, run, resume, review, and rerun operations.
- Dynamic discovery of built-in and series-local skills.
- Runtime and adapter clients with compact, abort-aware tool output.
- TUI status, progress, and approval interactions.
- Context injection from current channel, series, episode, snapshot, and stale dependency state.
- Deterministic rigged SVG animation rendering, local nonverbal character-audio synthesis, and frame-addressed multitrack composition.

## Constraints

The package uses Pi's extension and package APIs, supports TUI and RPC modes, starts long-lived resources only after `session_start`, cleans them at `session_shutdown`, throws on tool failure, truncates large output, and never stores production truth only in the Pi session.

## Outside Pi

`mcp/` hosts this extension, unchanged, outside Pi: `mcp/host.ts` gives it the
part of Pi's API it uses, and `mcp/server.ts` serves its tools over MCP stdio
and its slash commands as MCP prompts (ADR-0048). The repository's project
files start it for Claude Code (`.mcp.json`, also read by VS Code), Codex
(`.codex/config.toml`), Gemini CLI (`.gemini/settings.json`), Cursor
(`.cursor/mcp.json`) and OpenCode (`opencode.json`); `mcp/start.mjs` starts it
from any directory, for every other MCP client (ADR-0057). `claude/` holds
Claude Code's hooks and status line; other clients get what the hooks deliver
in their tool results. Add a tool here once, against Pi's API — every harness
gets it.

## Durable narration client

`src/tts-client.ts` exports an abort-aware `QwenTtsClient` for API 0.1.x. It submits complete canonical segment/profile jobs, resumes polling after restart, preserves worker machine errors, supports cancellation, validation, bounded retry, processing, and final mastering. Legacy `synthesize-speech` remains available during migration; composition prefers the canonical manifest's measured final WAV and fails closed when a present manifest is corrupt.

## Plan

Work is tracked once, for the whole repository, at its root; this module keeps no plan of its own.
