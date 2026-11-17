---
title: Your first local render
description: "Render and audit a six-second title sequence with the real composer, then change one title and see what is rendered again. No account, no key, no paid call."
---
# Your first local render

**You end with:** `hello.mp4`, six seconds of three title cards at 1280 × 720,
an audit that says the file is what the timeline asked for, and proof that
this machine can turn a timeline into a film.

| | | |
|---|---|---|
| ![A title card reading “An idea.”](/proof/take-2-second-0.jpg) | ![A title card reading “A little direction.”](/proof/take-1-second-2.jpg) | ![A title card reading “Your first render.”](/proof/take-2-second-4.jpg) |

It is a command, not a conversation with an agent. Do it first: a ten-stage
production is a poor way to find a missing binary.

## Ingredients

- The workspace installed ([quick start](../quick-start)).
- FFmpeg and ffprobe on your `PATH`.
- A network connection the first time: Remotion downloads a headless
  browser, about 90 MB.

No agent, no image provider, no voice worker, no Blender, no footage. It uses
your machine and makes no paid API calls.

## Render

From the root of the application's repository, not of this website's:

```bash
npm run demo:render
```

It creates a new `library/_demos/first-render-*` directory, prints its path,
renders 144 frames at 24 frames a second, audits the file and ends with:

```text
Passed: 6 seconds · 1280×720 · 24 fps · H.264 · silent
```

| Time | Title |
|---|---|
| 0–2 s | An idea. |
| 2–4 s | A little direction. |
| 4–6 s | Your first render. |

It is silent on purpose. This proves composition, not speech or mixing.

## Read what it left

- `hello.mp4`: play it. Three cards, none clipped.
- `audit.json`: `passed: true`. The audit decodes the whole file and checks
  the stream and the duration against the timeline. If a check fails, the
  command exits with an error and leaves the files to inspect.
- `timeline.json`: exactly what the composer was given. A clock (`fps`,
  `durationInFrames`), one visual track of timed items, each naming a
  versioned kit and its props, an output profile with its safe zone, and no
  media at all.

Every film the studio renders through this composer is a larger file of the
same shape.

## Change one title

The timeline is made by `firstTimeline()` in `tools/first-render.mjs`. Change
one `text` there and run the command again. Each run writes a new directory,
so the two films sit side by side. Editing an old `timeline.json` does
nothing: the script makes a new one each time.

To see what a change costs, render the two takes through the composer's
cache: [the correction, shown](../correction-shown). Two of the six seconds
are rendered again; four are not.

## Where it goes wrong

- **`ffmpeg: command not found`.** Install FFmpeg; `npm run doctor` says what
  else is missing.
- **The browser download fails.** A proxy or an offline machine: run it once
  with a connection.
- **The composer package is not found.** You are in the wrong directory, or
  `bun install` did not finish.
- **A long title does not fit.** Keep the first change short.

## Next

- [Explain a repository](./software-explainer), the first real film most
  people make.
- [A film from the footage you have](./existing-media), if you have material
  and no need to generate any.
- [The composer's own reference](../packages/remotion-composer).
