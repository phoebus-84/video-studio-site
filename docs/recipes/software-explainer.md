---
title: Explain the software, not the hype
description: Turn verified repository research into a narrated software explainer with clear terminal scenes and word-synchronised motion graphics.
---
# Explain the software, not the hype

**Goal:** a useful technical video whose commands, diagrams and claims match the actual software.

[Watch JaroMail pixel v4 →](../examples#jaromail)

The selected example is the newest rendered format experiment, not the older version named by the episode’s current-delivery pointer. Its research pins a source commit; demo people and email addresses are fictional.

## Ingredients

- A source repository and a specific revision.
- An authenticated agent with access to that source.
- A target audience and a realistic user task.
- Narration: a recording or a ready speech capability.
- Terminal capture and/or graphics tools suitable for the scenes.

**Costs:** agent access, optional narration services and local rendering. A graphics-and-terminal treatment need not use generated imagery.

## Brief from the source

```text
Make a three-minute English introduction to this software repository.
Pin the revision you research. Explain one useful workflow for a newcomer.
Verify every command and feature claim against that revision.
Use fictional example.org addresses and no real credentials or personal data.
Separate conceptual diagrams from actual terminal captures.
Propose the script and scene list before producing narration or visuals.
```

## Choose a viewer, not a feature list

A maintainer may know what the software does without knowing which part a newcomer will find confusing. Tell the agent who is watching and what they should be able to understand or try afterwards.

Ask it to propose two angles grounded in the repository: a task-based demonstration and a conceptual explanation, for example. Each should name a question, a sequence and the evidence available at the pinned revision.

**You bring:** domain knowledge, a realistic task and the mistakes people actually make. **The agent brings:** repository research, candidate examples and a list of claims that need checking. Choose the useful story together.

For a recurring channel, save audience assumptions, terminology and the distinction between a tutorial, a review and a promotional overview. They are different promises.

## Build a safe demonstration kit

Prepare fictional inputs, a disposable working directory and exact commands. Never demonstrate against real accounts or private inboxes just because they are already configured.

Ask the agent to identify commands with external effects before running them. Where a safe live demonstration is not available, use a clearly labelled diagram or illustrative example—not invented output presented as proof.

Keep a small claim-to-source note: the sentence in the script, its evidence at the selected revision and any limitation the viewer should know. A maintainer can then correct the film without repeating the research.

## Compare one scene in two treatments

Try the same explanation as a terminal-led scene and as a diagram with a short command reveal. A restrained character can connect the beats, but should not cover the information or distract from it.

You choose what teaches best. Check the scene at the actual delivery size and read the narration aloud before producing every screen.

JaroMail’s pixel treatment is one possible creative answer, not a required style for software films. A [recurring character](./create-a-character) or visual grammar belongs to your channel only if it improves comprehension.

## Build the explanation

1. **Research:** read the README, commands, configuration and relevant implementation. Keep a source list.
2. **Choose the argument:** what is this tool, how does it work, and who is it for?
3. **Write for a newcomer:** establish the mental model before introducing flags.
4. **Prove commands:** run safe demonstrations in an isolated fixture where possible. Label illustrative output instead of passing it off as a recording.
5. **Record the voice:** verify tool names, pronunciation, commands and pacing.
6. **Synchronise:** use measured voice timing, not guessed durations, for visual emphasis.
7. **Caption:** produce accurate captions from the final narration and check them against playback.

JaroMail v4 uses pixel characters, large terminal layouts and word-keyed motion graphics. Its audio is locally synthesised; the format is a custom prototype rather than a ready-made application template.

## Keep screens readable

- One conceptual step per visual beat.
- Terminal text that survives the delivery resolution.
- No real API keys, account details or private paths.
- A consistent distinction between narration, commands and commentary.
- Enough time to read a command before the next one arrives.
- Explicit versions and platform assumptions for installation advice.

## Let someone unfamiliar watch it

Ask a viewer to describe the workflow after a normal playback. Where they hesitate is more useful than a general “looks good”.

If they miss the purpose, fix the opening. If they understand the purpose but cannot read the command, fix the layout or time on screen. If the demonstration contradicts the narration, correct the underlying script and source evidence rather than hiding the mismatch with an animation.

## Acceptance check

Can a newcomer explain the workflow after watching? Can a maintainer trace the important claims back to the pinned source? Both matter.

Keep the research notes, script, demonstration fixtures, narration timings, captions and timeline. [Version them with the channel](../collaboration) so another person can update the film when the software changes.
