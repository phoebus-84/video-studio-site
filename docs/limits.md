---
title: Limits
description: "What %product% does not do yet, what it does only partly, and what release 0.2.0 fixed."
---
# What does not work yet

This page is the project's own review of itself, rewritten for someone
deciding whether to install it. It is dated: **17 November 2026**, against
release 0.2.0. The [changelog](./changelog) says what moved since.

If one of these is the thing you need, [use something else](./compare) for now.

## It is not unattended

%product% is useful today as an agent directed by a person. It should not be
described as production that runs by itself under enforced policy.

- **An approval is a person's.** The agent can ask for one
  (`pva_request_approval`); it cannot grant one. A decision made with the
  operator's key is signed and bound to what was approved, so a changed source
  or render setting invalidates it.
- **The key file is the boundary.** A process running as the same user that
  deliberately reads the operator's key can still sign as the operator.
  Keeping the agent apart from that file at the operating-system level is not
  built.
- **Scripts the agent writes are not sandboxed.** A Blender scene is built by
  Python the agent wrote. Blender's own switches are not a sandbox.

## A correction is asked for in words

The parts exist: stages that go stale when what they depend on changes
(`pva_check_staleness`, `pva_plan_rerun`), a picture cache by the second, a
film that re-renders only the shots that changed, and a comparison of two
renders (`pva_compare_versions`). [See them run](./correction-shown).

What is missing is the gesture. You cannot stop the video, draw on the frame
and have that one piece made again. You tell the agent what to change.

The comparison looks at about 24 instants, or the ones you name; it does not
compare every frame. Sections added, removed or resized are always reported.

## Long work blocks the conversation

Many tools run inside the agent's session and wait for the result. A long
render holds the conversation until it ends; closing the session can end the
render with it. There is no queue of jobs that outlives the agent.

One render of a film runs at a time. A second is refused with a message that
says what is rendering; it is not queued.

## Few providers, added by hand

Generation goes through a short list chosen on purpose: fal.ai for images,
video clips and 3D models, OpenAI for images, Qwen3-TTS for speech on your own
machine or through a ComfyUI server, ElevenLabs for speech and word alignment. Adding a provider
touches several files; there is no one-file plug-in.

ComfyUI is used for speech only. Images and video through your own ComfyUI
are not built.

## A generated character stands still

A character, its forms, their releases and a production's cast are kept,
hashed and pinned ([recipe](./recipes/create-a-character)). Since 0.2.0 a 3D
model can be made from one picture, for $0.20 to $0.65.

What comes back has no skeleton and no motion. It can be placed, turned and
lit, not posed. Rigging and motion are named in the design and not built: a
generated model is a statue until they exist. The browser studio has no view
of a cast.

## Receipts are assembled by hand

The [films](./examples) carry receipts read from their files and journals.
The studio does not print one. No film has a figure for a person's time or
the machine's, because neither is measured.

## Installation is heavy

There is no single command. You clone the repository and install runtimes
with mise, packages with bun, and FFmpeg; local speech needs Python 3.12.
The first thing you can make without any account is
[six seconds of titles](./recipes/first-render), not a narrated video.

The pipeline tools (stages, approvals, budgets) need the gateway running.
Every other tool works without it.

## Nothing is measured yet

There is no result showing that %product% does better than a capable model
working on its own. The test is [written down](./retake) and has not been run.

## Remotion is not free software

The renderer depends on [Remotion](https://www.remotion.dev/docs/license),
which is free for individuals and for companies of up to three people and
needs a company licence beyond that. Installing %product% does not give you
one.

## Fixed in 0.2.0

From the [changelog](./changelog), the faults that were found and closed:

- Two processes could write the same cut and the second replaced the first
  unseen. A lock now holds the read, the check and the write together, and
  `pva_edit_cut` must name the revision it read.
- An edit made by the agent did not show in an open editor.
- A file replaced by other bytes of the same length, with its date put back,
  counted as unchanged.
- A render that finished late could take the place of a newer one.
- A render's line in the journal could be dropped in silence.
