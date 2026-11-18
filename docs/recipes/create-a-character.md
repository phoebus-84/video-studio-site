---
title: A character people recognise
description: "Define a character as a record apart from how it appears, give it a form with a list of what it can do (a 3D model made from one picture, given a skeleton and posed, among them), release that form, and cast it in a series pinned to the release."
---
# A character people recognise

**You end with:** a character on disk that a script can name and a series can
cast: who it is, the forms it takes, what each form can do, and a release of
each form that will not change under the episodes made with it.

A character here is a record, not a 3D model. It can be a person, a fox, a
lamp, a dot, a sound, a voice and nothing else. The studio keeps it, hashes
it and pins it. One kind of form it can also make: a 3D model from one
picture, which it can then give a skeleton and pose. A walk and a run can
come with the skeleton; any other motion is not built.

## Ingredients

- A channel, a series or a film to own the character
  ([build a channel](./build-a-channel)).
- A role: what the character is for in the story.
- The material for at least one form, if it is to appear: drawings, sprites,
  a rig, a component drawn by code, reference pictures, a recording.
- For a real person's face, voice or name: their permission, in writing. For
  a synthetic voice made from a recording: the voice rights to do so.

- For a 3D model or its skeleton: a fal.ai key, and an episode with a budget
  to make it in. To pose a rig: Blender on the machine.

**Costs:** the agent's model usage. Recording a character and casting it
makes no paid API calls. Making a form may: generated pictures and synthetic
voices are metered like any other, a 3D model costs $0.20 to $0.65 by
what is asked of it, and a skeleton for it $0.20. Posing a rig runs on your
machine and costs nothing.

## 1. Who it is, before how it looks

```text
Create a character for the channel my-channel: a guide for a series on
everyday inventions. The objects are the stars, not the guide.
Load the character-development skill. Propose three roles with different
ways of speaking; for each, write the same twenty-second introduction to a
mechanical clock. Do not make pictures or voices yet.
```

When you have chosen, the agent records it with `pva_create_character`:

| Field | What goes in it |
|---|---|
| `id` | a stable slug: every script and cast names the character by it |
| `nature` | what kind of thing it is, in free words |
| `identity` | `character.md`: who it is, what never changes |
| `backstory` | `backstory.md`: where it comes from, what it wants |
| `performance` | `performance.md`: how it plays a scene, what it never does |
| `voiceProfile` | a voice of the owner's registry (`pva_voices`) |
| `likeness` | for a real person: whose, and what permits it |

It is written to `characters/<id>/character.yaml` in whatever owns it. A
character with no form yet is valid: it exists on paper first.

## 2. Give it a form, and say what the form can do

```text
Load the character-forms skill. The guide's form is the cut-out puppet in
~/drawings/guide. Record it as the form "puppet", with the actions and
expressions it really has, and release it as v1.
```

The agent uses `pva_update_character`. A form has a medium, one of: a rigged
3D model, an unrigged model, a 2D puppet, sprites, a drawing made by code,
pictures, a photograph, a graphic, a sound, a voice, or `other` with a note.

Its `can` lists the actions, expressions, mouth shapes and views it has, by
the names a script will use. This list is the contract between writing and
animation. Keep it honest: list what exists, not what you hope to draw.

A release is a folder, `forms/<form>/<release>/` by default, recorded with
the hash of its entry file and of its whole tree, what made it, and its
licence. A release is never edited. A change is `v2`.

## 3. A 3D form from one picture

<ModelStrip />

A test figure, made on 17 November 2026 against the real service. The model
shown is the light one of the three below.

Approve the picture first: one image of the character on a plain ground, in
the view the model will be built from. This is where its identity is
decided, and the model is paid for.

```text
Make a 3D model of the guide from assets/images/guide-front.jpg, in the
episode inventions/ep001. It will be rigged later: ask for a quad mesh of
about 20,000 faces. Tell me the price before you call it.
```

The agent calls `pva_generate_model` with the episode, a `modelId`, the
`imagePath` and a `texture`. It asks Tripo H3.1 through fal.ai, reserves the
price on the episode's budget before the call, and says what came back:
triangles, materials, textures, its size, where its origin is, that it has no
skeleton, and when it is too heavy to rig.

| Asked for | Price |
|---|---|
| No textures | $0.20 |
| Standard textures | $0.30 |
| Detailed textures | $0.40 |
| Detailed geometry | + $0.20 |
| A quad mesh (`quad: true`) | + $0.05 |

The three runs of that day, from the one picture:

| Asked for | Came back | Time | Ledger |
|---|---|---|---|
| Standard textures | GLB, 41 MB, 1,434,958 triangles | 2 min 20 s | $0.30 |
| Quad mesh, `faceLimit: 20000` | FBX, 2.8 MB, 18,889 quads, textures inside | 2 min 20 s | $0.35 |
| No textures, `faceLimit: 30000` | GLB, 0.9 MB, 28,986 triangles | 1 min 18 s | $0.20 |

fal reports no cost for these calls, so each was settled at its estimate.

What to know before you use one:

- **Say how heavy.** Left to itself the service returns more than a million
  triangles: fine for a still, useless for a rig. For a figure that will be
  rigged, ask for `quad: true, faceLimit: 20000`.
- **Place it.** It is one unit tall with its origin at its middle, and these
  three faced +x. Lift it, turn it and scale it once, and say which in the
  form's note.
- **It is a statue.** No skeleton, no motion. It can be placed, turned and
  lit; it cannot be posed until it is given a skeleton, which is the next
  step.

The model lands in the episode's `assets/models/`. To make it the
character's, the agent copies the model, its preview and its provenance into
`characters/<id>/forms/<form>/<release>/` and records that folder as a
release of a form whose medium is `model-3d`. Its `can` lists the views it
has and no actions, because it has none.

In the test, the model was released, cast in a series, and a second release
taken by casting again. A script that asked the form to “walk” was refused:
the form lists no actions.

## 4. A skeleton, and the poses that test it

<RigStrip show="poses" />

A second test figure, 18 November 2026: the picture, and the rig made from
its model in five of the seven poses it was looked at in. The stills are
tiles of the tool's own sheet. The figure has no textures because the test
did not pay for them.

**Draw it to be rigged.** This decides more than anything after it. A model
is one skin: where a sleeve rests on a coat the two are joined, and no rig
separates them. Arms held away from the body, legs apart, nothing worn
across two limbs. One figure was drawn both ways, rigged by the same
service and asked to raise its arms:

<RigStrip show="drawn" />

Ask for a tall picture, too. A standing figure on a square canvas loses its
cap and its boots.

```text
Give the guide's model a skeleton, in the episode inventions/ep001. It is a
two-legged figure; the model faces +x. Tell me the price first. Then pose
the rig and show me the sheet before anything is released.
```

The agent calls `pva_rig_model` with the episode, a `rigId`, the `modelPath`,
an `engine` and which way the model `faces`. The price is reserved on the
episode's budget before the call.

| Engine | Rigs | Gives back | Price |
|---|---|---|---|
| `hyper3d` (the default) | a human, a quadruped, a bird, a dragon, a kaiju, or a body described in words | 52 joints for a human, fingers among them; up to ten bones a vertex; the model left where it was | $0.20 |
| `meshy` | two-legged bodies with clear limbs | 24 joints on a skeleton animation tools know; four bones a vertex; the feet on the ground; an FBX; a walk and a run | $0.20 |

Each answered in under a minute: about 20 seconds for one, 50 for the other.

**The rig is examined before the tool answers**, from the file, with no 3D
program: vertices no bone moves, bones outside the body, a body standing on
nothing, a left with no right, clips that move nothing. A rig that fails is
kept on disk and the tool does not say how to release it.

**Then it is posed.** `pva_rig_sheet` runs on your machine, in Blender, at no
cost. It puts a two-legged body in seven poses (arms up, arms down, reach,
step, wide, head turn, bow), renders each from the front, three-quarter and
the side on one sheet beside the rig, and plays the clips that came with the
rig over six moments each. For any other body it swings each of the largest
limbs, or takes poses you write as turns of named bones.

For every pose it counts how much of the surface was strained and how many
of its edges were torn, and marks the poses that went further than a sound
rig does.

Six rigs were made on 18 November 2026: two figures, three ways each. All
six passed the examination at rest. Edges torn in each pose, of the 45,000
on each figure:

| Figure | Rigged by | Arms up | Reach | Step | Wide | Head turn | Bow |
|---|---|---|---|---|---|---|---|
| In a long coat, arms at its sides | `hyper3d`, the service's own skinning | 168 | 173 | 296 | 96 | 444 | 103 |
| | `hyper3d`, `core` skinning | 47 | 38 | 6 | 8 | 5 | 0 |
| | `meshy` | 810 | 685 | 27 | 19 | 40 | 16 |
| Drawn for a rig | `hyper3d`, the service's own skinning | 88 | 51 | 98 | 27 | 349 | 42 |
| | `hyper3d`, `core` skinning | 19 | 2 | 4 | 9 | 1 | 0 |
| | `meshy` | 3 | 1 | 0 | 0 | 40 | 0 |

Ten rigs made by hand, measured the same way, tear at most 26.

- **How it is drawn matters more than which service rigs it.** Compare the
  two halves of the table.
- **The tool asks `hyper3d` for `core` skinning.** The service's own default
  tore the surface more than ten times as often on both figures.
- **The numbers say where to look.** They do not see a hand passing through
  a hat, or a face that no longer looks like the character. Open the sheet.

A rig is released as a form whose medium is `rig-3d`. Its `can` lists the
clips that came with it as actions, and nothing it has no clip for.

<RigStrip show="walk" />

The walk one service adds to its rigs, on the second figure. It is the only
motion there is: a rig moves as far as its clips go.

The whole test, both figures: $1.40 on the ledgers of two episodes.

## 5. Cast it

```text
Cast the guide as "host" in the series inventions, wearing the puppet.
```

`pva_cast` writes the series' `cast.yaml`: the role, the character, the form
it wears there and the release it is pinned to. An episode made with `v1`
keeps `v1` when the character gets a `v2`.

The same character can hold different roles in different productions.
Another owner's character is named `owner/id` and read where it lives, never
copied.

## 6. Check a script against the cast

```text
Check the cast of inventions: the host is asked to point, to read and to
look surprised.
```

`pva_cast` with `asks` compares what a script wants of each role with what
the form it wears can do, and says what is missing, before a shot fails for
it. With `verify`, it reads every pinned file again and compares it with its
record. `pva_characters` shows one character in full, or lists an owner's.

## What the studio does not do

- **It does not play a form.** A `.blend` or an SVG component is kept, hashed
  and pinned; drawing it stays the job of the kit or the tool that knows the
  medium.
- **It does not animate.** A rig moves by the clips it has: a walk and a
  run from one service, and nothing else. There is no motion from text or
  from a video, no clip chosen by name, and no way to carry a clip from one
  skeleton to another.
- **It does not place a rig in a shot.** The rig is kept and pinned; putting
  it in a scene is a Blender script the agent writes.
- **A generated rig has no face.** No bones for the mouth or the eyes: the
  character cannot speak or change expression.
- **Other bodies and textures are untried.** Every rig so far was of a
  two-legged, untextured model.
- **Nothing else is specific to characters.** A pose sheet is made with the
  image tools, a puppet by a Blender script, a drawn component by hand.
  Generated reference pictures help consistency; they
  do not guarantee it, and a new angle still has to be looked at.
- **It does not judge a permission.** It warns of a photograph on a character
  that states no likeness. Whether you may use a face or a voice is yours to
  establish.
- **The browser studio has no view of a cast.**

## Where it goes wrong

- **A form that promises too much.** A `can` list copied from a wish list
  makes the script check pass and the shot fail.
- **A million triangles.** A model asked for with no `faceLimit` is too heavy
  to rig and slow to render. Ask for the weight you need; a second model is
  a second price.
- **A model generated before the picture is right.** The picture is cheap and
  the model is not. Change the picture.
- **A character drawn in its clothes.** A long coat, a cape, a skirt to the
  ground, arms resting on the body: the rig will carry them off with the
  limbs. Decide in the picture whether the character needs them.
- **A rig released because it passed.** All six test rigs passed at rest.
  Pose it and look.
- **Editing a released folder.** The next `verify` reports files that no
  longer match their record. Make a new release instead.
- **A voice without its rights.** Cloning a voice needs a recorded consent;
  the cloning tools refuse without one.

## Next

[A format worth repeating](./repeatable-series) pins the cast with the rest
of a series' standard.
