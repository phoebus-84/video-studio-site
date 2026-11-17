---
title: A film from the footage you have
description: "Bring your own footage, sound and music into a film, have every clip looked at and logged, cut it at three levels, and re-render only the shots you change. Nothing is generated."
---
# A film from the footage you have

**You end with:** a film in your library made from material you shot,
recorded or bought: a log of every clip, a cut for each shot, each scene and
the film, and a render made with FFmpeg on your machine.

A film is one self-contained work, short or feature length, beside the
library's channels. It is produced at three levels (the film, its scenes,
their shots), each with its own cut and its own render.

## Ingredients

- %product% installed and an agent connected ([quick start](../quick-start)).
- A folder of footage, and any location sound or music, that you may use.
- What the film is for, in a sentence, and roughly how long.

**Costs:** the agent's model usage. Ingesting, cutting and rendering are
local: this route makes no paid API calls.

## 1. Ask for the film

```text
Make a two-minute film from the footage in ~/shoot/harbour. It is a portrait
of the morning shift, no narration. Load the film-producer skill.
Ingest and log everything first and show me what is usable.
Propose two possible films from that material before cutting either.
Generate nothing.
```

## 2. Ingest and log

`pva_ingest_footage` brings each file into the film's `footage/`: named by
its content, with a proxy a browser can play, a contact sheet, the instants
where its picture cuts and its loudness. `link: true` leaves large originals
where they are. `pva_footage` searches and annotates the log; the
`footage-ingest` skill has the agent look at every clip and say what it
shows, whether it is usable and which scene it serves.

Read the log before anything is cut. What the material cannot say, the edit
cannot make it say.

## 3. Cut at three levels

| The agent uses | What it does |
|---|---|
| `pva_create_film`, `pva_create_scene`, `pva_create_shot` | the units, in running order |
| `pva_assemble_cut` | makes a unit's cut from what is under it, and keeps it in step |
| `pva_edit_cut` | edits a cut with operations applied together or not at all |
| `pva_cut_effects`, `pva_cut_frame` | lists the picture and sound effects; composes one frame with all of them, to judge a grade without rendering |
| `pva_check_cut` | checks a cut and prints its revision |
| `pva_film` | every scene and shot with its state, and what stands between the film and its final render |

A shot's render is a source of its scene's cut; a scene's, of the film's.

`pva_edit_cut` must name the revision it read (`expectedRevision`) or say the
edit is right on any revision (`latest: true`). An edit that names neither is
refused, so the agent cannot write over a change you made meanwhile.

## 4. Edit it yourself, too

In the browser studio a film opens on its board, and every level has a Cut
view: sources, a monitor, the timeline and an inspector. You edit a draft
with undo and save it as the next revision; your save is refused if the agent
wrote one meanwhile, and the agent's edit is refused the same way.

Lock a clip or a track, and the agent and assembly leave it as it is.

## 5. Render

`pva_render_cut` renders a unit with FFmpeg, first rendering whatever under
it is out of date and nothing that is not. A change to one shot costs that
shot and the joins above it. `preview` is small and fast; `final` is the
film's format.

One render of a film runs at a time. A second is refused with a message
saying what is rendering.

## Where it goes wrong

- **Cutting before logging.** An agent that has not looked at the clips cuts
  by filename.
- **Originals copied twice.** Large camera files fill the disk. Use `link`.
- **A film that is really narration over pictures.** That is an
  [episode](./software-explainer), not a film; it has its own pipeline.
- **Expecting a shared screen.** You and the agent take turns on revisions.
  It is not simultaneous editing.

## Next

[Hand it to a human editor in DaVinci Resolve](../resolve-handoff), or
[bring in a collaborator](./team-handoff).
