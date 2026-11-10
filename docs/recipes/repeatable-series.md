---
title: A format worth repeating
description: Develop a series through an agreed format, visual and voice tests, a pilot, human feedback and a versioned production method.
---
# A format worth repeating

**Goal:** make episode two easier without making it a copy of episode one.

A series is a recurring agreement with the viewer. It might be a miniature nature lesson, a quiet illustrated story, a software walkthrough or a recital. Before that agreement becomes a template, you and the agent have to discover what makes it work.

You can start with a [channel concept](./build-a-channel), or with a one-off film you liked enough to make again. Neither starting point requires you to know the compiler or schema in advance.

## Ingredients

- An audience, a channel direction and an intended recurring product.
- A subject for the pilot and a different subject for the second test.
- An agent with the studio tools available.
- Existing material or a plan for [research and acquisition](./research-and-materials).
- A reviewed pilot, if one already exists; otherwise, a budget for developing one.

**You leave with:** a written format, tested layout and voice rules, a pilot, a versioned release where appropriate, and instructions that explain how to make the next episode.

**Costs:** development and testing, followed by the variable cost of each episode. A reusable format saves repeated decisions and unnecessary generation; it does not make new research, assets or render compute free.

## 1. Agree what this series promises

Ask the agent to compare a few plausible structures, using the same subject. An object-led story, a presenter-led explanation and a live demonstration can all cover the same invention, but they create different expectations.

```text
Help me develop a recurring series within this channel.
Start by reading the channel brief and selected references.
Propose two episode structures for this subject, with a rough beat sheet,
a visual treatment and a plan for the voice.
Explain what would stay fixed and what each new episode would need.
Do not implement the format or generate paid media until we choose a direction.
```

**The agent prepares:** a format proposal, sample opening, sequence of beats, visual references, asset requirements and likely costs.

**You decide:** the experience, scope and format. A duration range is useful; a fixed duration that forces every subject into the same shape may not be.

Save the agreed standard in plain language. The format document should explain *what a good episode does*, not only its frame size.

## 2. Test the difficult parts cheaply

Before a full pilot, ask for the smallest material that can answer the open questions:

| Uncertainty | Useful test | Your decision |
|---|---|---|
| Can this amount of text be read? | A still with the longest likely passage at delivery size | Layout, type size or less text |
| Does the guide fit? | A frame with the real character asset and subject | Position, scale or less screen time |
| Does the voice carry the tone? | The same short passage in a few authorised takes | Performance direction and voice |
| Will the transformation work? | A short motion test | Keep the idea, simplify or change technique |
| Do two aspect ratios tell the same story? | One deliberately composed scene in each | Shared material versus separate layouts |

These are human decisions. Technical checks can tell you that a frame renders; they cannot tell you that its pacing or emotional register is right.

[Prepare a reusable character before casting it in the pilot →](./create-a-character)

## 3. Separate the format from the story

| Stable standard | Episode-specific choice |
|---|---|
| Aspect ratio, safe zones and type conventions | Topic, source text and teaching question |
| Roles and permitted voice choices | Performance and selected takes |
| Opening/closing mechanism | Title, author or subject details |
| Available layouts and drawing kits | Composition and imagery within them |
| Checks that stop an invalid episode | Credits, timing and source references |

Do not standardise what should remain creative. An opening may repeat; the argument, images, transitions and emphasis should serve the new subject.

A second output can be a separate series in the same channel. A vertical recital and a horizontal lesson share a poem, not necessarily a script or an edit.

## 4. Let the agent build the production method

For a **spec-driven series**, use the studio’s `author-series` workflow after agreeing the format. The agent writes the series-specific implementation in the channel’s library, not in the application.

You do not need to hand-code every piece, but you should know what you are receiving:

- **Format document:** the standard and the procedure, readable by people.
- **Episode schema and starting spec:** what changes each time, what is required, and what remains fixed.
- **Compiler:** turns the spec, assets and measured narration into an edit timeline.
- **Validator:** catches violations meaningful to this format.
- **Kits and theme:** the necessary drawing behaviour and look, with explicit versions.
- **Fixtures:** examples that exercise the compiler and check expected results.
- **Series-local instructions:** where the next session starts and what it should ask.

This is real development work. If the agreed design needs a drawing behaviour that does not exist, it may require a new kit and another test—not an assurance that a generic template already supports it.

Not every recurring project needs a spec compiler. A recurring Blender film may use a scene-based workflow and series instructions instead. Choose the production method that fits the work.

## 5. Make and review the pilot

Produce one complete episode from the proposed method. Check the script and source claims; inspect pictures and listen to takes; review the layout before committing to a full render. Honour the configured review policy and any additional checkpoints you agreed.

Watch the result in its actual viewing situation: a phone, a desktop with small speakers, or a television at a distance. First watch normally, then investigate the problems.

Useful feedback is concrete:

> “The introduction explains the premise before we have seen anything interesting. Start with the object, then let the guide ask the question. Keep that rule for this series.”

Ask the agent to propose a correction and identify its scope. Does it change one episode, the series, or the whole channel? Write the accepted decision at that level.

## 6. Prove it with a second subject

A template that can reproduce its own pilot has passed only the easiest test. Try a different subject: a longer quotation, a shorter narration, an unusual image shape, or a topic with no presenter.

The agent should report unsupported cases, not force the new subject into a bad layout. You might expand the format, choose a different episode structure or decide that this topic belongs in another series.

For a spec-driven series, seal and verify the release and pin episodes to an exact version. Keep accepted compile inputs as fixtures. A sealed release, kit or theme is not edited in place; a changed standard needs a new version and review of affected episodes.

## 7. Write the next-episode conversation

Ask for a handoff that answers:

1. What can I ask for in one short request?
2. What must already exist at channel or series level?
3. What research and new material will each episode still need?
4. Which decisions can follow the saved standard, and which return to me?
5. Where are the accepted examples, and which release do we use?
6. What happens when a requested subject does not fit?

Then test that handoff in a fresh session. A short prompt works when it can resolve this context, not because the model remembers a previous conversation.

## Acceptance check

The pilot works as a film; a second subject works as a different film; the agent can identify missing inputs; the standard catches useful errors; versions and sources are explicit; and another person can continue without guessing.

A golden reference is an operator-accepted example, not a render the agent simply labels “approved”.

[See a prepared poetry channel turn one request into two films →](./poetry-lesson) · [Technical series contracts →](../studio/series)
