---
title: A scene you can open in Blender
description: "Have the agent build an editable Blender scene by script, direct it from cheap previews, and keep the .blend so a person can change the camera or the light and render again."
---
# A scene you can open in Blender

**You end with:** a `.blend` file you can open, the Python that rebuilds it,
and a render. The scene is the deliverable; the video is one view of it.

<RecipeFilm id="underwater" />

## Ingredients

- Blender 4.2 to 4.x, or 5.2.x, installed. `pva_blender_probe` says which
  one the studio found; it does not substitute another renderer.
- %product% installed and an agent connected ([quick start](../quick-start)).
- A reference for the technique or the look, and what you want to be able to
  change afterwards.

**Costs:** the agent's model usage and your machine's time. This route makes
no paid API calls. A Cycles render of a long shot can take hours.

## 1. Ask for a scene, not a video

```text
Build an underwater scene in Blender: light through a moving ocean surface,
a shark passing below it, fifteen seconds. Load the blender-scene skill.
I want an editable .blend: procedural water, named objects, a camera I can
move. Show me the Python before running it, then a still preview.
No downloaded models.
```

## 2. Read the script before it runs

`pva_blender_create_scene` runs Blender Python on your machine with full
access to it. It is not sandboxed. The tool takes reviewed code: read what
the agent proposes, as you would any script you are about to run.

It writes a new attempt each time and never replaces a delivered file.

Assets come from Poly Haven through `pva_poly_haven`: CC0 models, textures
and skies, downloaded with a checksum and a record of where they came from.
It does not install add-ons or run downloaded code.

## 3. Direct from previews

`pva_blender_render` renders a still or a sequence, with Eevee or Cycles.
Its defaults are cheap preview settings; final settings must be asked for.

Give direction a person on set would give: “the key light is too frontal”,
“the shark crosses too fast, give it nine seconds”, “less particles near the
lens”. Each change is a new attempt, so you can go back.

## 4. Open it yourself

Open the `.blend`. Move the camera, change a material, render a frame.
`pva_blender_render` accepts a scene an artist edited. Tell the agent you
changed it, so that it renders your file and does not rebuild from its
script.

The built-in pipeline is `blender-animation`: scene plan, build, preview,
render, QA. It makes a silent shot. Sound, captions and other shots are
added by the composer, or the shot becomes a clip in a
[film](./existing-media).

## Where it goes wrong

- **A scene that only renders.** Unnamed objects, baked values, no camera
  rig: it plays, and nobody can change it. Ask for names and controls.
- **Final settings on the first try.** An hour of Cycles to learn the camera
  is wrong. Preview in Eevee or at low samples.
- **A `.blend` that is not portable.** Packed images are not everything:
  linked libraries, fonts and caches may stay behind on your machine.
- **Renders that differ between machines.** A GPU and a CPU do not produce
  the same pixels.

## Next

[A film from the footage you have](./existing-media) cuts the shot with
others. [Pick up where your collaborator left off](./team-handoff) hands the
scene to an artist.
