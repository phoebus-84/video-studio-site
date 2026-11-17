---
title: Change the line. Keep the film.
description: "Correct one thing in a rendered episode: find what depends on it, redo only that, keep the delivered version, and compare the two renders to see that nothing else moved."
---
# Change the line. Keep the film.

**You end with:** a new render in which one thing changed, the render you
delivered still on disk beside it, and a report of every section that differs
between the two.

<RecipeFilm id="nothing-is-only-one-thing" />

## Ingredients

- A rendered episode and its source files, in your library.
- The gateway running, for the staleness and rerun tools
  ([running the agent](../running)).
- The correction, said precisely: which sentence, shot or section, and what
  it should become.

**Costs:** the agent's model usage, and whatever the change itself needs
again. A text correction on a terminal-and-diagram film costs a local render.
A new sentence costs its narration; a new picture costs that picture. Nothing
that does not depend on the change is made again.

## 1. Say what may change, and what may not

```text
In the episode my-channel/my-series/ep004, the second section says the
filter runs on the GPU. It runs on the CPU. Correct that sentence.
Before changing anything, tell me which file owns it and what goes stale.
Do not regenerate any picture. Do not touch the other sections.
Show me the layout sheet before rendering, then compare the new render
with the one I delivered, expecting changes only in section two.
```

You do not need the diagnosis. “The middle drags” is a fair start: ask the
agent for the possible causes and two remedies before it touches the film.

## 2. What goes stale

The agent edits the file that owns the decision, not a file derived from it.
In a series made to a format, that is the episode's spec or its script: the
timeline is compiled from them, and a patched timeline is replaced at the
next compile.

Then it asks the runtime, not itself:

- `pva_check_staleness` marks the stages whose inputs changed.
- `pva_plan_rerun` lists what must run again, in order, before anything runs.

Read the plan. If one corrected sentence asks for new pictures, something
depends on more than it should: stop and ask why.

## 3. Redo only that

| What changed | What is made again |
|---|---|
| A sentence of narration, same length | that take, its alignment, the timeline; the picture where it follows the words |
| A sentence that got longer or shorter | the same, and every second after it: the picture's cache is keyed by time |
| Sound only: music, a level, a fade | the mix. The whole picture is reused |
| One title, caption or graphic | the seconds it is on screen |
| The template release, the resolution | everything |

The render keeps its picture in one-second segments and reuses the ones a
change did not touch. [See it happen on a six-second film](../correction-shown).

The render you delivered is not overwritten. Each render has its own id and
keeps its timeline beside it (`output/<render-id>.timeline.json`).

## 4. Look before you render

`pva_layout_sheet` makes stills of the timeline a render would use, at its
first and last frame, across its sections. It is written to
`artifacts/layout-sheet/sheet.jpg`. A corrected sentence that is longer than
the old one moves everything after it: the sheet is where you see a caption
pushed off its mark, before a render is spent.

## 5. Compare the two renders

```text
Compare the new render with <the id of the render I delivered>,
expecting changes only in section two.
```

`pva_compare_versions` decodes both videos at the same instants and aligns
them section by section through their timelines. The result is in
`reviews/compare/<old>--<new>/`:

- `report.json`: every pair of frames measured, the sections that changed
  shape, and a verdict: `ok`, or `unexpected-changes`.
- `changed.jpg` and `pairs/`: each changed frame as old, new and difference.

The comparison looks at about 24 instants, or the ones you name. It is
evidence, not proof of every frame. Sections added, removed or resized are
reported whatever was sampled.

## Where it goes wrong

- **The agent fixes the timeline.** It works until the next compile. Ask
  which source owns the sentence.
- **A longer sentence.** The comparison aligns the films section by section,
  so later sections that only moved still compare as unchanged, and the
  section itself is reported as resized. The render is another matter:
  everything after the change is rendered again, because it moved in time.
- **A correction that is really a new standard.** “Verse needs more time on
  screen” is not about one episode. Change the series' format in a new
  release; it does not reach back into delivered episodes by itself.
- **Approving on the agent's word.** A stage that waits for a person waits
  for you. The agent asks with `pva_request_approval`.

## What is not built

Drawing on the frame and having that piece made again without a conversation.
You tell the agent, in words. [Limits](../limits)

## Next

[Hand the episode to someone else](./team-handoff), with the old render, the
new one and the comparison between them.
