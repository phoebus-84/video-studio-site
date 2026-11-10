---
title: A film from the footage you have
description: Use your own stills, clips and recorded narration to make a short edit without paying for new media generation.
---
# A film from the footage you have

**Goal:** a 30–60 second edit made from material you already own.

This is the best first creative project. It separates editorial decisions from the cost and variability of generation.

## Ingredients

- A working [local render](./first-render) and an authenticated agent.
- A folder of stills or clips you have permission to use.
- Optional: a clean recorded voice track and licensed music.
- A clear audience and one intended outcome.

**Costs:** your agent’s model access and local compute. This recipe asks for no paid media generation.

## Give the agent a bounded brief

Replace the source-folder placeholder with your own path:

```text
Make a 30-second introduction for a small independent ceramics studio.
The audience is people discovering the work for the first time.
My source folder is <my-media-folder>; use only material from that folder.

First inspect the files and tell me what is usable.
Create a new episode, leaving the sources untouched.
Propose a three-part edit: process, details, finished objects.
No generated images, voices, music or video. No paid media calls.
Use simple cuts and restrained text. Ask me to review the plan.
```

## Decide what the material can honestly say

Have the agent return a labelled contact sheet or a short inventory with useful time ranges. Resolution is only one test: a sharp clip may show the wrong stage of the process, while a modest phone recording may contain the only meaningful human moment.

For the ceramics example, you can add the context a file probe cannot discover: which piece is finished, whose hands appear, which sound belongs to the workshop, and whether a customer has agreed to appear.

**Ask for two treatments using the same material.** One might follow an object from clay to shelf; another might introduce the maker through gestures and details. Each should include an opening, a few selected moments and a proposed ending. No new media is needed to compare these ideas.

**You choose the story**, not just the nicest clips. Save the selection and the reasons. If the footage cannot support a proposed claim, change the claim or record the missing evidence.

## Review a rough cut before adding finish

Ask for a simple assembly with cuts, approximate titles and the original sound. Do not spend the first review on elaborate transitions.

Watch once without pausing. Can you tell what the studio makes and why someone might care? Then give specific feedback:

> “Open on the hands, not the logo. Keep the sound of the wheel. The finished bowl needs longer on screen, and the second title repeats what we already see.”

Have the agent explain the effect on timing and propose the revised cut. If an important shot is missing, decide together whether to reshoot, use a still or simplify. “No new generation” remains a constraint even when the edit becomes difficult.

For horizontal and vertical deliveries, discuss a second composition. A mechanical crop may remove the object or the person whose action tells the story.

## Work through the edit

1. **Inventory:** have the agent probe resolution, duration, frame rate and audio. Exclude corrupt, duplicated or irrelevant material.
2. **Select:** agree on a short shot list. A good clip needs a reason to be here, not just enough pixels.
3. **Time:** fit cuts around the action or recorded speech. Do not stretch a small set of stills to hit an arbitrary duration.
4. **Compose:** build the timeline and check the layout sheet. Read every text overlay at the intended delivery size.
5. **Review:** listen to the mix and watch a preview. Approve any required human gates yourself.
6. **Deliver:** render, inspect the output and preserve the source selection alongside it.

## What should be left on disk

The episode should retain its editorial inputs, the asset references, `artifacts/edit-timeline.json`, layout review material and a versioned render in `output/`. Exact supporting files depend on the selected pipeline.

Do not let the agent “clean up” the only copy of an original clip. Keep external media available or bring it into the library deliberately.

## Before calling it finished

- Does the first shot establish the subject?
- Do captions stay clear of important details and platform UI?
- Does music remain below speech, if you have both?
- Does every source have a known permission or licence?
- Can you explain why each shot is included?
- Does the exported file play correctly from beginning to end?

## Next move

[Revise one part without losing the rest](./revise-with-confidence), or [add an illustrated sequence](./illustrated-story). If the film becomes a regular way of presenting new work, keep the successful structure as a [series](./repeatable-series), while giving each object its own story.
