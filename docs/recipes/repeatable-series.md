---
title: A format worth repeating
description: "Turn a film you would make again into a series: a pinned template with its compiler and validator, an episode that is a data file, and a check that refuses what breaks the format."
---
# A format worth repeating

**You end with:** a series whose format is a release on disk: a template, the
compiler that turns an episode's data into a timeline, a validator, the
drawing kits it needs and worked examples. The next episode is a data file
checked against it.

<RecipeFilm id="sonnet" />

## Ingredients

- A channel ([build one](./build-a-channel)) and one film you liked enough to
  make again, or a clear idea of the recurring thing.
- A second subject, different from the first, to test the format on.
- An agent with the studio's tools, and the gateway running.

**Costs:** development is the agent's model usage, and it is real work: a
format is code. After that, each episode costs what its own material costs.
A format saves repeated decisions; it does not make research, pictures or
voice free.

## 1. Decide what the series promises

```text
I want a recurring series in the channel my-channel: one everyday invention
per episode, three minutes, vertical.
Load the author-series skill. Before writing any code, propose what stays
fixed in every episode and what each episode supplies, and show me one still
with the longest text I am likely to need, at delivery size.
```

Not every recurring project needs a compiler. The `author-series` skill
starts by deciding what kind of product you want; a recurring Blender film or
a one-off goes to its own pipeline instead.

| Fixed by the format | Supplied by each episode |
|---|---|
| Frame, safe zones, type | Subject, text, the question it answers |
| Roles and the [cast](./create-a-character) | The takes of the performance |
| Opening and closing | Titles, names, credits |
| Layouts and drawing kits | The pictures inside them |
| The checks that stop a bad episode | Timings, measured from the voice |

## 2. Let the agent build it, in your library

The agent writes the format in the channel's library, not in the
application:

- the **template release**, `templates/<id>/<version>/`: the episode schema
  and a starting spec, the compiler, the validator;
- the **kits** and the theme it draws with, each with a version;
- **fixtures**: examples that exercise the compiler;
- the series' **own skill**: where the next session starts.

Then the release is sealed and verified. A sealed release is one
self-contained file per program, and `verify` checks that what runs is what
was sealed:

```bash
node studio/runtime/dist/src/cli.js template seal my-channel/my-series my-template 1.0.0 --library "$PWD/library"
node studio/runtime/dist/src/cli.js template verify my-channel/my-series my-template 1.0.0 --library "$PWD/library"
```

A sealed release is not edited in place. A changed standard is a new version.

## 3. Make an episode from it

The built-in pipeline is `series-production`: spec, pictures, takes,
timeline, check, sheet, render.

| The agent uses | What it does |
|---|---|
| `pva_init_spec` | writes `episode-spec.json`, pinned to an exact release, with every value you must supply marked `__FILL__` |
| the `fill-episode-spec` skill | fills them, within the format's standards |
| `pva_build_timeline` | compiles spec and measured narration into the timeline |
| `pva_check_episode` | runs the series' validator on what would be rendered, without rendering |
| `pva_layout_sheet` | stills of that timeline, to read before a render is spent |
| `pva_compose_video` | the render |

The render stage refuses a layout sheet that is missing or that no longer
shows exactly what it would render.

## 4. Prove it on a second subject

A format that reproduces its own pilot has passed the easy test. Give it the
second subject: a longer quotation, a shorter narration, a picture of another
shape.

The agent should report what the format cannot hold, not squeeze the subject
into a bad layout. Then you choose: widen the format in a new release, or
decide this subject belongs to another series.

## 5. Keep a reference, and move forward by release

- When you say an episode is exemplary, `pva_propose_reference` freezes its
  spec and timeline as a proposed golden reference. Only you approve it,
  from the command line (`reference approve`); the agent cannot.
- When the standard changes, `pva_upgrade_spec` moves an episode to a newer
  release, explicitly. There is no implicit “latest”: an episode keeps the
  release it was made with until someone moves it.

## Where it goes wrong

- **Standardising the creative part.** An opening may repeat; the argument
  and the images should not. If every episode looks like the pilot with the
  words swapped, the format fixed too much.
- **A check that only checks that it renders.** A useful validator knows this
  format's rules: the longest line, the pause after a stanza, a title that
  must fit.
- **Testing in the session that built it.** Ask for the next episode in a new
  session, with one short request. It works when the files carry the
  context, not the conversation.

## Next

[One poem. Two films.](./poetry-lesson) shows a prepared channel turning a
single request into a vertical recital and a full lesson.
[Series contracts](../studio/series) is the technical reference.
