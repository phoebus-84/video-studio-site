---
title: A scene you can open in Blender
description: Produce a short Blender shot while preserving editable geometry, materials, lighting and animation.
---
# A scene you can open in Blender

**Goal:** a short, silent animated shot and a source scene a person can continue editing.

[Watch the underwater experiment →](../examples#underwater)

That example studies an underwater lighting technique with original procedural geometry. Its scene remains editable; the downloaded tutorial footage is not part of the rendered output.

## Ingredients

- A supported Blender installation: see the current [Blender package requirements](../packages/blender).
- A working studio workspace and authenticated agent.
- Enough local compute for the chosen renderer.
- FFmpeg for video assembly and inspection.

Choose the dedicated profile:

```bash
npm run compose -- --profile=blender
npm run doctor
```

This changes your active composition. Return to `--profile=studio` afterwards if that is your usual setup. Composition does not install Blender. Set `BLENDER_BIN` if the executable is not discovered.

**Costs:** agent access and local rendering. No cloud generation is required for a procedural scene.

## Ask for an editable deliverable

```text
Create a five-second Blender study of light moving through water.
Use original procedural geometry and materials.
Start with a simple scene plan and a low-cost still preview.
Keep geometry, lights, camera and animation clearly named and editable.
Save the .blend and the scene-building script.
Use no external assets or paid APIs.
Do not start the full render until I review the preview.
```

## Turn a reference into a scene brief

You can start with a tutorial, an image, a piece of footage or a sketch. Tell the agent which property you want to study: moving light, the depth of the water, floating particles, or the relationship between a foreground object and the background.

Ask it to separate the technique from the content. What can be reproduced procedurally? What would require external models, textures or a simulation? What will remain editable? Research a reference’s method without assuming its assets or footage may be redistributed.

**The agent proposes:** a simple scene diagram, camera and lighting options, a rough object list and the likely cost of each approach in render time.

**You choose:** the subject and the visual priority. “I want the light to move, not the camera” is a valuable direction that affects the whole scene.

For the underwater experiment, learning from a tutorial did not mean inserting tutorial footage into the finished shot. That distinction also belongs in the source and credit notes.

## Direct the preview with specific feedback

First compare composition and lighting in a low-cost still. If useful, ask for the same frame with two lighting treatments rather than two entirely different scenes.

Then inspect motion with a cheap preview. A pleasing still can hide camera collisions, repeating particles or an object leaving the frame halfway through.

Example feedback:

> “Keep the camera and geometry. The highlights are too busy; lower their contrast. Move the foreground plant out of the focal area. Show the same frame again before raising render quality.”

Have the agent name the changed objects or parameters and retain the earlier preview. This makes the exchange both a creative review and a useful record for whoever opens the scene later.

## Preview before you commit

1. **Plan:** establish the subject, camera, duration, scale and render engine.
2. **Block:** get the composition working with simple geometry.
3. **Light:** evaluate one still at low resolution and modest samples.
4. **Move:** inspect the first, middle and final poses. Check for intersections, framing drift and unstable simulation.
5. **Estimate:** measure representative frames before extrapolating the full render.
6. **Render:** use a named output directory and retain logs.
7. **Reopen:** verify the saved scene without relying on the original authoring session.

A tutorial’s settings are a technique reference, not a promise of identical results at a different scene scale.

## The handoff should include

- An editable `.blend` file.
- The source script when the scene was built procedurally.
- A preview still and the final silent clip.
- The selected render settings and diagnostic logs.
- External asset credits, if any.
- A short note explaining which objects and parameters control the look.

## Acceptance check

- Does the file open with the intended camera and materials?
- Are there missing linked files, textures or caches?
- Does the motion change smoothly across the full clip?
- Is the renderer and device choice explicit?
- Is the delivered video’s duration, resolution and frame rate correct?
- Have you preserved a clean source before any destructive edit?

This is a scene-production workflow, not automatic narration or publication. Bring the rendered clip into the episode’s edit as a separate step.

[Blender setup and API reference →](../packages/blender)
