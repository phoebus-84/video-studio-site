---
title: Your first local render
description: Render and audit a six-second title sequence with Video Studio’s real composer. No API key or production assets required.
---
# Your first local render

**Goal:** prove that your machine can turn an edit timeline into a playable file.

This is a small, runnable example—not an agent prompt. It uses the real Remotion composer, needs no AI account, and does not depend on the private production library.

## Ingredients

- The workspace installed using the [quick start](../quick-start).
- FFmpeg and ffprobe on your PATH.
- Network access for Remotion’s first headless-browser download.

No image provider, local voice worker, Blender installation or stock footage is required. It uses local compute and makes no paid API calls.

## Render

From the **Video Studio application** repository root (not the website):

```bash
npm run demo:render
```

The command creates a unique `library/_demos/first-render-*` directory and prints its path. It renders **144 frames at 24 fps**, **1280 × 720**, with three two-second title cards.

| Time | Text |
|---|---|
| 0–2 s | An idea. |
| 2–4 s | A little direction. |
| 4–6 s | Your first render. |

The video is intentionally silent. This proves composition, not speech generation or mixing.

## Check the result

Open `hello.mp4`. The title sequence should play through all three cards without clipping or missing frames.

Read `audit.json`: it must report `passed: true`. The audit checks full-file decoding, the expected video stream and duration. If a check fails, the command exits unsuccessfully and leaves the diagnostic files for inspection.

`timeline.json` is the exact input the composer received. Notice:

- `fps` and `durationInFrames` define the clock.
- A visual track contains timed items.
- Each item names a versioned `captions` kit and its props.
- The output profile and safe zone travel with the timeline.
- There are no external media assets.

## Make one change

The source recipe lives in the application's `tools/first-render.mjs`, alongside the compositor—not in this website project. In `firstTimeline()`, change one `text` value and run the command again.

```js
props: {
  text: 'A small film starts here.',
  position: 'center',
  fontSize: 80,
  color: '#f7f5ef',
  backgroundColor: '#b63d28'
}
```

Keep the first edit short enough to fit. Each run creates a new directory, so you can compare results. Editing an old output `timeline.json` alone does not affect the next run—the script creates a new timeline from its source.

::: tip Why this first?
A ten-stage creative workflow is a poor diagnostic for a missing binary. This tiny render isolates the compositor before you add an agent, provider credentials, voice models or library formats.
:::

## Where to go next

- [Edit existing media](./existing-media) to work with your own pictures and voice.
- [Explore the composer](../packages/remotion-composer) for the package API.
- [Connect an agent](../quick-start#_4-choose-your-agent) for a creative workflow.
