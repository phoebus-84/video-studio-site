---
title: Build a channel with a point of view
description: "Set up a channel as a place the next film starts from: its promise, its shared sources, voices and cast, a budget, its first series, and its own Git repository."
---
# Build a channel with a point of view

**You end with:** a channel in your library: a folder that says who it is
for, holds what its films share, caps what they may spend, and can be its own
Git repository. A channel is where episode twenty finds what episode one
decided.

## Ingredients

- %product% installed and an agent connected ([quick start](../quick-start)).
- An audience and a promise, in a sentence each.
- Whatever you already have: references, a voice, drawings, texts.

**Costs:** the agent's model usage. Creating a channel makes no paid API
calls.

## 1. The promise, before the name

```text
I want a channel about everyday inventions for curious adults.
Propose three directions: what a viewer gets from each, what an episode
looks like, and what it would cost me per episode in material.
Research before proposing, and say what you could not find.
Do not create anything yet.
```

**You decide:** which promise, and what the channel will not do. Write the
second down too; it is what the next session needs most.

## 2. Create it

The agent uses `pva_create_channel`, then `pva_create_series` for the first
series. On disk:

```text
library/my-channel/
├── channel.md          who it is for, what it promises
├── settings.yaml       budget and policies, inherited by every series
├── brand/              channel knowledge
├── characters/         the cast, shared by its series
├── sources/            shared material that episodes pin
├── voices/             the voices it may use
├── skills/             the channel's own procedures
└── series/
    └── my-series/
        ├── series.md
        ├── settings.yaml
        ├── templates/  the format, once there is one
        └── episodes/
```

A directory inside `series/` is a series; a directory inside `episodes/` is
an episode. Nothing else is inferred.

## 3. Cap the spend

```yaml
# library/my-channel/settings.yaml
budget:
  currency: USD
  limitMicros: 5000000   # $5.00 per episode
```

The nearest level wins: a series can set its own. A paid call that would pass
the limit is refused before it is made.

## 4. Fill what the films will share

| Folder | Recipe |
|---|---|
| `sources/`, with licences | [Borrow it with its licence](./research-and-materials) |
| `characters/` | [A character people recognise](./create-a-character) |
| `series/…/templates/` | [A format worth repeating](./repeatable-series) |

Do them when a film needs them, not before. A channel with a complete bible
and no episode has decided everything except whether it works.

## 5. Give it its own repository

```bash
node studio/runtime/dist/src/cli.js channel init my-channel --library "$PWD/library"
git -C library/my-channel status --short
```

`channel init` writes ignore rules that keep media out of Git and merge rules
for the journal and the media lock. Text is versioned; media is restored by
hash from storage you choose. [Collaboration](../collaboration) has the rest.

## 6. Test the handover

Open a fresh session and ask for the next episode in one sentence. If the
agent has to ask who the audience is or which voice to use, the channel does
not say it yet. Add it to `channel.md` or the series' skill, and try again.

[One poem. Two films.](./poetry-lesson) is a channel prepared this way,
answering a one-line request.

## Where it goes wrong

- **Everything in the conversation.** A decision that lives only in a chat is
  gone at the next session. If it should hold next time, it goes in a file.
- **A channel that is one series.** Format belongs to the series; the channel
  holds what several series share.
- **Names in the application.** Your channel lives in your library. Nothing
  about it belongs in the application's repository.
