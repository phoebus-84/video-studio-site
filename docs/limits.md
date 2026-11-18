---
title: Limits
description: "What %product% does not do yet, what it does only partly, what changed since release 0.2.0 and what that release fixed."
---
# What does not work yet

This page is the project's own review of itself, rewritten for someone
deciding whether to install it. It is dated: **18 November 2026**, against
the main branch, which is release 0.2.0 and what was merged after it. The
[changelog](./changelog) says what moved, release by release.

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
video clips, 3D models and their skeletons, OpenAI for images, Qwen3-TTS for speech on your own
machine or through a ComfyUI server, ElevenLabs for speech and word alignment. Adding a provider
touches several files; there is no one-file plug-in.

ComfyUI is used for speech only. Images and video through your own ComfyUI
are not built.

## A generated character acts alone, and has no face

A character, its forms, their releases and a production's cast are kept,
hashed and pinned ([recipe](./recipes/create-a-character)). Since 0.2.0 a 3D
model can be made from one picture, for $0.20 to $0.65. On the main branch
that model can be given a skeleton for $0.20, posed and measured on your
machine, given a motion (picked by name, carried from another skeleton, or
asked for in a sentence for $0.08) and filmed into a clip of video, with no
script written by hand.

What is missing:

- **A face.** A generated rig has bones for the body and the fingers and
  none for the face. The character cannot speak or change expression.
- **A set, and company.** A rig is filmed alone on an empty stage, in front
  of one colour. A place, a second character, a camera that moves on its own
  are still a Blender scene the agent writes.
- **A motion that fits the body.** A motion made for a person's proportions
  puts the hand of a character with a large head inside its face, and
  nothing corrects it. Fingers are not carried from one skeleton to another.
- **All that was asked.** Asked for a wave and then a bow, the motion
  service gave the wave. A generated motion is a person's motion only, and
  has to be played and looked at before it is used.
- **Other bodies.** Skeletons and stock clips for a quadruped, a bird, a
  dragon and a body described in words are offered by one service and have
  not been tried. A clip is carried by name between two-legged bodies only;
  any other needs a map of its bones, and none was made for a real animal.
- **Motion from a video.** For a creature no stock clip fits, the skill
  describes filming the model and copying a generated video onto its
  skeleton. It is a method, not a tool.
- **A release in one step.** Recording a rig, its clips and its sheet as a
  character's form is still files copied by the agent and one call. A model
  arrives facing sideways with its origin at its middle, and every scene
  turns and lifts it again.
- **Judgement.** A rig is checked at rest and measured in seven poses. A
  clip and a shot are not measured at all. The numbers say where to look;
  whether the character still looks right is for a person, and how the
  character was drawn decides more than the service that rigs it.

The browser studio has no view of a cast.

## Music is written by something that cannot hear

Music is procedural: [Strudel](https://strudel.cc) code the agent writes and
your machine renders ([recipe](./recipes/music-in-code)). The agent works from measurements and is
told never to say how a piece sounds. Whether it is good is judged by a
person, by ear, and nobody has judged the examples that way.

The engine has oscillators and noise: no piano, no drum kit, no sampled
instrument unless the recording is already in your workspace. Rendering
needs a Chrome on the machine.

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
