---
title: Change the line. Keep the film.
description: Revise a rendered episode, preserve the previous delivery and inspect unexpected changes with Video Studio’s comparison workflow.
---
# Change the line. Keep the film.

**Goal:** make a specific correction without casually changing everything around it.

## Ingredients

- An existing rendered episode and its source files.
- The actual previous deliverable, not a newly recreated approximation.
- An authenticated agent and working render tools.
- A precise description of what should change.

**Costs:** agent work, rerendering and any explicitly requested regeneration. A text correction should not automatically trigger new paid imagery.

## Make the change bounded

```text
Revise the second section's explanation; keep every other section unchanged.
First identify the source file that owns that text.
Preserve the delivered render and list which downstream outputs become stale.
Do not regenerate unrelated images or narration.
Show me the revised layout before rendering.
Then compare the new output with the delivered version,
expecting changes only in the second section.
Do not approve any review gate on my behalf.
```

## Turn a reaction into a change you can judge

You do not need to arrive with a technical diagnosis. “The middle drags” or “I lose the argument here” is a legitimate starting point. Ask the agent to identify possible causes and show a small set of remedies before touching the whole film.

| Your observation | What the agent can investigate | What you decide |
|---|---|---|
| “The explanation feels rushed” | Reading pace, dense wording, visual holds | Rewrite, rerecord or give it more time |
| “This does not look like our character” | Reference version, selected asset, framing | Replace the shot or deliberately revise the identity |
| “The room is too busy” | Competing layers, contrast, motion and sound | Which elements should recede or disappear |
| “The lesson repeats itself” | Script structure and repeated examples | The argument and material worth keeping |

Separate symptoms from solutions. More transitions will not fix a redundant script, and a new voice will not necessarily fix an unclear explanation.

## Agree what the change is allowed to affect

Have the agent propose a short change plan: owning source, intended remedy, downstream work, possible costs and material that stays untouched.

For a paired poetry production, changing only the lesson’s commentary should not automatically recreate the shared recital. Correcting a word in the shared poem text may affect both films and needs a different plan.

Also choose the scope of the lesson learned:

- **This episode:** a particular image does not work.
- **The series:** verse needs more reading time in this layout.
- **The channel:** the guide’s tone should change for future work.

Save a reusable decision where the next session will find it. A changed standard does not retroactively authorise replacing every delivered episode.

## Change the source that owns the decision

For a spec-driven episode, the timeline is compiled from the episode spec, takes and series release. Change those sources rather than patching a derived timeline that the next compile replaces.

For other edits, inspect the actual workflow first. If the timeline has deliberate manual edits, do not rebuild it blindly.

## Check, render, compare

1. Record the previous render ID and preserve its timeline.
2. Inspect staleness after the source change.
3. Run episode checks; resolve errors rather than rendering an older valid state.
4. Review a fresh layout sheet.
5. Ask for the required human review.
6. Render to a new version.
7. Use the comparison workflow with the old render ID and the sections expected to change.
8. Read the report and inspect the changed frame pairs.
9. Watch and listen to the corrected section and its boundaries.

The comparison writes reports and paired images under `reviews/compare/` in the episode. It samples selected instants and detects structural changes in sections.

::: warning Know what the evidence proves
A sampled pixel comparison does not inspect every frame and does not verify the soundtrack. Listen to audio revisions and watch timing-sensitive transitions. A clean report is supporting evidence, not a universal quality guarantee.
:::

## When the change is a new direction

A complete creative re-edit is different from a bounded correction. Agree on what may change and what must survive, then preserve the previous candidate rather than treating it as an error to erase.

[Nothing Is Only One Thing V006](../examples#nothing-is-only-one-thing) is a real example: the images, transitions and music-led edit were recomposed around the existing V005 narration. Earlier films and voice takes remain intact. It demonstrates a revision approach, not a bundled format or a pixel-identical correction. Selecting it for the gallery does not approve its production review gate.

## Acceptance check

- The requested correction is visible or audible.
- No unrelated section is marked as unexpectedly changed.
- New line breaks, durations and transitions still work.
- The old deliverable remains accessible.
- Reviews apply to the current bytes, not an earlier version.
- The person who requested the correction agrees it is resolved.

[Comparison details and limitations →](../running#comparing-two-versions)
