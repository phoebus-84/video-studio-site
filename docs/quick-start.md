---
title: Get started
description: Install Video Studio, prove the local renderer works, and connect Pi or Claude Code. Keep optional generation services separate.
---
# Your first video starts here.

Start small: install the workspace, render a tiny example, then connect an agent. You do **not** need cloud generation credentials or a local speech model for the first render.

## 1. Get the essentials

You need **Git**, **Node 22**, **Bun**, and **FFmpeg** (including ffprobe). The repository pins its runtimes in `mise.toml`; [mise](https://mise.jdx.dev/getting-started.html) is the simplest way to keep them aligned.

::: code-group
```bash [macOS · Homebrew]
brew install git mise ffmpeg
```
```bash [Ubuntu / Debian]
sudo apt-get update
sudo apt-get install -y git ffmpeg
# Install mise using its official getting-started guide.
```
:::

Follow the [mise shell activation instructions](https://mise.jdx.dev/getting-started.html#activate-mise) before continuing. Already managing runtimes? Match `mise.toml`: Node 22, Bun 1.2.0, and Python 3.12 if you use the local voice worker.

::: info Platform expectations
The local studio is developed on macOS; JavaScript packages are also checked on Linux CI. The MLX speech worker is **Apple-Silicon-only**. Native Windows setup is not covered by this quick start; use a Linux environment for this path and check each tool’s requirements.
:::

## 2. Install the workspace

<CopyCommand label="Install Video Studio" command="git clone https://github.com/phoebus-84/video-studio.git&#10;cd video-studio&#10;mise install&#10;bun install&#10;npm run compose -- --profile=studio&#10;npm run doctor" />

If mise asks you to trust the repository configuration, review `mise.toml` and run `mise trust`. Use the **Video Studio application repository** root for every command on this page—not the separate website repository.

**What happens:** Bun installs the workspace dependencies and builds required packages. Composition wires the studio profile without the local MLX voice worker. Doctor reports what this machine can actually do.

**What does not happen:** this does not install Blender, fetch speech weights, buy API access, or launch an agent. The `studio` profile wires tools, not every external prerequisite.

Doctor may report missing optional tools or credentials. For the next step, focus on **FFmpeg / ffprobe** and the renderer. Remotion downloads its headless Chrome on the first render; that needs network access and disk space.

## 3. Prove rendering works

```bash
npm run demo:render
```

This creates a new directory under `library/_demos/first-render-*` with:

| File | What to check |
|---|---|
| `hello.mp4` | A six-second, 720p silent title sequence |
| `timeline.json` | The editable timeline used by the composer |
| `audit.json` | Decode, streams and duration checks; `passed: true` |

The command prints the exact output path. Every run gets a new directory; it does not overwrite an episode. Your library is gitignored.

[Understand and change this recipe →](./recipes/first-render)

## 4. Choose your agent

Install and authenticate **one** agent separately. Model access is not included in Video Studio.

::: code-group
```bash [Claude Code]
# Install and sign in using Claude Code's official instructions.
# Then, from the video-studio repository root:
claude
```
```bash [Pi]
# Install and sign in using Pi's official instructions.
# Then, from the video-studio repository root:
pi -e studio/agent/extensions/index.ts
```
:::

- [Claude Code setup](https://code.claude.com/docs/en/setup): on first launch here, review and trust the repository’s `pva` MCP server.
- [Pi setup](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent): load the studio extension with the command above.

The same production tool registrations are exposed through both harnesses.

::: info Pipeline tools need the gateway
The browser UI is optional, but the agent’s stage tracking, approval-request and budget-status tools call the gateway. Before using those workflows, [start the gateway](./running#_2-agent-plus-gateway-plus-web-studio) and configure its URL/token as described there; you can leave the browser UI closed. The asset-free render above does not need it.
:::

A useful first message:

```text
Inspect the studio's available capabilities and the library.
Tell me what is ready and what is missing.
Do not generate paid media or change any existing project yet.
```

Then try a project with material you already own:

```text
Help me make a 30-second video from my own images and recorded voice.
Start by asking for the source folder and intended audience.
Create a new channel, series and episode rather than changing an existing one.
Use existing media only. Propose a short edit, check the layout,
and ask me to review it before rendering.
```

## Add capabilities when you need them

| You want to… | Add next |
|---|---|
| Edit your own media | [Existing-media recipe](./recipes/existing-media) |
| Generate illustrations | Configure an image provider and an episode budget; [illustrated-story recipe](./recipes/illustrated-story) |
| Synthesize speech locally | Apple Silicon, Python 3.12, models and the [voice worker](./running#speech-start-the-voice-worker-first) |
| Make editable 3D shots | A supported Blender installation; [Blender recipe](./recipes/blender-scene) |
| Work in the browser studio | The gateway and browser setup in [Running the agent](./running) |
| Use just the reusable packages | [Profiles and composition](./install#composition) |

## Bringing in a collaborator?

Your first project can stay entirely local. When you are ready to share it, make the channel its own Git repository, version its text and media lock, and configure an S3-compatible remote for the large files.

A collaborator installs the studio, clones the channel, restores its media and verifies the hashes. Git and S3 are separate from the application install—neither a hosted team account nor a storage bucket is required for the first render.

[Set up Git, media storage and a team handoff →](./collaboration)

## If something gets stuck

- **`bun` or `node` not found:** activate mise in your shell, or use `mise exec -- bun install` and `mise exec -- npm run doctor`.
- **A workspace package cannot resolve:** run `bun install` at the repository root, not inside an individual package.
- **FFmpeg is missing:** install it and check `ffmpeg -version` and `ffprobe -version`.
- **Chrome download fails:** check network/proxy access and available disk space; retry the render after fixing it.
- **Pipeline or budget-status tools cannot connect:** start the gateway and check `AVG_GATEWAY_URL` and its authentication token. Launching Pi or Claude alone does not start that service.
- **A generation tool is not ready:** enable that provider’s requirements. A working install does not mean every optional capability is available.
- **The agent sees the wrong library:** start it from the repository root. For an external library, set `AVG_LIBRARY_ROOT`; runtime CLI commands should pass `--library` explicitly.

The [complete installation reference](./install) covers profiles, credentials and operator keys. The [running guide](./running) covers review, budgets and advanced workflows.
