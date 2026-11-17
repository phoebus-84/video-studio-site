---
title: An illustrated short
description: "Make a short film from generated illustrations: settle the look on a few pictures before paying for the rest, hold the camera still, animate only what should move, and cut to the sound."
---
# An illustrated short

**You end with:** a short film made of illustrations you chose one by one,
with only the chosen elements moving, cut to narration or to music.

<RecipeFilm id="lontano" />

That film was made as an experiment outside the pipeline, with a score
composed for it; no narration. The built-in route below produces a narrated
illustrated film. The method is the same: few pictures, looked at, before
many.

## Ingredients

- %product% installed, an agent connected and the gateway running.
- A story with a turn in it: what is different at the end.
- An image provider that `npm run doctor` reports ready: a fal.ai key, or an
  OpenAI plan for the `openai-codex` provider.
- A voice, or music you may use ([borrow it with its licence](./research-and-materials)).

**Costs:** pictures are metered per image and animated clips per clip (a
Wan 2.2 clip of about five seconds is $0.05 to $0.10 by resolution). Set the
episode's budget first; the agent reads it with `pva_budget_status` before
spending and a call past the limit is refused.

## 1. Find the turn before the look

```text
Make a ninety-second illustrated film from this story: <the story>.
Start with writing. Give me the brief and a scene list, with the one moment
where the film turns. No pictures yet.
```

The agent uses `write-brief` and `write-script`. If you cannot say what
changes between the first scene and the last, more pictures will not find it.

## 2. Settle the look on three pictures

```text
Load the art-direction skill. Propose two visual treatments for scenes 1, 4
and 7: the same three scenes in each. Tell me the cost before generating.
```

`pva_generate_images` draws several at once, each saved to `assets/images/`
with its cost on the episode's ledger. Judge them at the size
the viewer will see, next to each other. Choose one treatment and write down
what makes it: palette, line, how a face is drawn, what is never shown.

Only then the rest of the scenes.

## 3. Hold the camera, move one thing

A generated clip that moves everything moves the faces too. Hold the
composition and animate what the scene is about:

- `pva_generate_wan_video` animates one picture; with `loop: true` it closes
  on its first frame.
- Whatever the composer draws itself (layers, type, simple motion) is not
  metered.

## 4. Cut to the sound

With narration, the timeline is built from the measured timing of the take
(`pva_align_take`, `pva_build_timeline`), not from guessed durations. Read
the layout sheet (`pva_layout_sheet`) before the render.

## Where it goes wrong

- **A new face in every scene.** Generated pictures do not hold a character
  by themselves. Keep reference pictures as a
  [character's form](./create-a-character) and check each new angle.
- **Generating all the scenes first.** The treatment changes after you see
  three. The other twenty were paid for the old one.
- **Text in the picture.** Titles and captions belong to the composer, where
  they can be corrected without a new image.
- **A story for children.** The `fairy-tale-adaptation` pipeline adds
  audience adaptation and a safety review; a person still reads the script.

## Next

[Change the line. Keep the film.](./revise-with-confidence) when one scene is
wrong. [A format worth repeating](./repeatable-series) when you want a second
story in the same hand.
