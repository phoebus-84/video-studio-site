---
title: How it works
description: "Understand the Video Studio workflow: an agent, specialised media tools, a file-based library, and human review."
---
# A studio, not a single model.

Video Studio coordinates the work between an idea and a finished video. An AI agent helps make creative decisions and operates specialised tools; a deterministic runtime tracks production state.

You can start with your own footage, a script, a poem, a code repository, or a visual idea. You decide what the project is for, what it should look like, and when it is ready.

## The four parts

| Part | What it does | What you can inspect |
|---|---|---|
| **The agent** | Plans, writes and calls production tools in Pi or Claude Code | Conversation, prompts and tool results |
| **The tools** | Work on images, audio, graphics, Blender scenes and edit timelines | Inputs, generated files and supported provenance records |
| **The library** | Holds channels, series, episodes and their media | Ordinary folders, scripts, settings, sources and outputs |
| **The production runtime** | Tracks stages, dependencies, stale work and review gates | Snapshots, journals, candidates and review records |

The browser studio is an optional interface to this system, not the place where your work is locked away. **Optional browser does not mean optional gateway for every workflow:** the agent’s pipeline tools use the gateway for stage tracking, approval requests and budget status, even in a terminal session. Standalone media tools and the first-render demo can work without that interface; their own prerequisites still apply.

The same file-based design also makes the production shareable: a channel can have its own Git history and an S3-compatible media remote.

## Prepare once. Direct each episode.

You can make a one-off film, or develop a channel with an agent over several conversations. Research an audience, contribute references, compare creative proposals, audition characters and voices, then make a pilot. The agent helps turn your selected direction into reusable material and instructions.

| Layer | What you establish | What the next session can read |
|---|---|---|
| Channel | Audience, world, tone, recurring cast and source standards | The creative brief, shared assets and working rules |
| Series | A recurring product with its own structure and visual grammar | The tested format, production procedure and versioned implementation |
| Episode | A new subject, argument, performance and edit | Its research, script/spec, selected sources and review history |

That preparation is why a later prompt can be brief. In *Poesie al museo*, asking for *Il sabato del villaggio* as both a vertical recital and a full lesson refers to two established series. The agent can prepare the shared poem material once, then make two distinct treatments. It has not invented the museum, its cast and its formats in that single exchange.

New subjects still need research and judgement. A new author may need a room proposal; an unfamiliar performance may need an audition. Saved standards reduce repeated setup without removing your authorship.

[Develop a channel](./recipes/build-a-channel) · [Create a recurring character](./recipes/create-a-character) · [Follow the paired poetry production](./recipes/poetry-lesson)

## From a brief to a film

### Decide what you are making

A short explainer needs different pacing from an illustrated story. Give the agent the audience, source material, duration, aspect ratio and constraints. Ask it to propose a plan before generating anything.

[Find a workflow that fits →](./recipes/)

### Make only the missing pieces

Use existing images and recordings when they already work. Add generated media when it serves the project. A scene can come from Blender, a licensed archive, generated imagery or footage you shot yourself.

Providers are explicit choices. Missing software, credentials or capabilities are reported; the system should not silently choose a cheaper or different substitute.

### Compose and review

The edit is a structured timeline, not a pile of shell commands. It describes the layers, timing, assets and versioned kits that draw the video.

For episode workflows, a **layout sheet** lets you inspect representative frames before spending on a full render. Check the text, safe zones, framing, transitions and any visual overlap. This complements—not replaces—watching and listening to the finished cut.

Human review gates require an operator decision. The agent may request approval; it does not approve on your behalf. A gate holds stage completion—it is not a blanket lock on every media tool or shell command.

### Render, then verify

The studio renders episode timelines with Remotion and uses FFmpeg for media processing and audio normalisation. Reusable composition packages are also available independently.

Review the actual deliverable: decode, dimensions, duration, sound, text and pacing. A technically valid file can still be a weak film.

### Revise without losing the thread

Keep previous deliveries. Change the source that owns the decision, rebuild what became stale and compare the new version with the old one. Sampled frame comparisons help identify unexpected changes; they are not proof about every frame or the audio.

[The revision recipe →](./recipes/revise-with-confidence)

## A library you can understand

```text
library/
  my-channel/
    settings.yaml
    series/
      my-series/
        episodes/
          ep001/
            ...episode source, media and production records
```

This is an orientation sketch, not a file-generation contract. See the [workspace specification](./workspace) for the precise layout. The application ships no channel’s creative format; a series’ templates and theme belong with its library. The gallery’s named productions are case studies, not application defaults or formats installed by the quick start.

## Built to leave one laptop

**Git carries the decisions. S3 carries the media. The lock connects them.**

Each channel can be its own repository: version the script, episode specs, templates, timelines and production records with ordinary commits, branches and reviews. Keep images, recordings, clips and Blender files out of Git.

The versioned `media.lock.jsonl` records each media path, SHA-256 hash and size. An optional S3-compatible remote stores those bytes by content hash. A collaborator clones the text, restores the selected media and verifies that the local files match.

New takes and render candidates preserve earlier work. Sealed format releases remain immutable. Changed local media is reported rather than overwritten during a pull.

This is versioned collaboration, not real-time cloud co-editing. Repository permissions, storage access and operator approval authority remain explicit.

[Set up a shared channel →](./collaboration)

## Local does not mean every model is local

The application, files, graphics and composition can run on your machine. Cloud providers receive the inputs you send them. Agent conversations also use your chosen model provider.

Local MLX narration needs Apple Silicon and its own worker. Blender needs a supported local installation. Cloud generation needs credentials and may incur charges.

Before sending sensitive footage, voices or documents to a provider, check its terms and your permissions.

## Costs and control

There is no website subscription or hosted account offered here. Installing source code is separate from the costs of agent access, cloud generation, hardware and any external software.

Set a budget in episode, series or channel settings before using supported paid tools. Reservations and spend are tracked for those tools. This is **not** a universal billing firewall: direct API calls outside the tools can bypass the ledger.

[Budget behaviour and limits →](./running#budget)

## Go deeper when you need to

- [Architecture](./architecture): boundaries and execution.
- [Domain language](./context): what “channel”, “series” and “stage” mean here.
- [Packages](./guide#packages): reuse tools without adopting the whole studio.
- [Get started](./quick-start): the shortest route to a working local render.
