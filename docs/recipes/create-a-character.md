---
title: A character people recognise
description: "Define a character as a record apart from how it appears, give it a form with a list of what it can do (a 3D model made from one picture, given a skeleton, a motion, released in one step and filmed alone or with others on a set, among them), and cast it in a series pinned to the release."
---
# A character people recognise

**You end with:** a character on disk that a script can name and a series can
cast: who it is, the forms it takes, what each form can do, and a release of
each form that will not change under the episodes made with it.

A character here is a record, not a 3D model. It can be a person, a fox, a
lamp, a dot, a sound, a voice and nothing else. The studio keeps it, hashes
it and pins it. One kind of form it can also make from start to finish: a 3D
model from one picture, given a skeleton, posed, given a motion, released
at its own height, and filmed: alone, or with others on a set. It has no
face, and it touches nothing.

## Ingredients

- A channel, a series or a film to own the character
  ([build a channel](./build-a-channel)).
- A role: what the character is for in the story.
- The material for at least one form, if it is to appear: drawings, sprites,
  a rig, a component drawn by code, reference pictures, a recording.
- For a real person's face, voice or name: their permission, in writing. For
  a synthetic voice made from a recording: the voice rights to do so.

- For a 3D model, its skeleton or a motion asked for in a sentence: a fal.ai
  key, and an episode with a budget to make it in. To pose a rig, carry a
  clip to it, film it or stage a scene: Blender on the machine.

**Costs:** the agent's model usage. Recording a character and casting it
makes no paid API calls. Making a form may: generated pictures and synthetic
voices are metered like any other, a 3D model costs $0.20 to $0.65 by
what is asked of it, a skeleton for it $0.20, and a motion from a sentence
$0.08. Posing a rig, carrying a clip to it, releasing it, filming it and
staging a scene run on your machine and cost nothing.

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
- **Do not place it by hand.** It is one unit tall with its origin at its
  middle, and these three faced +x. Releasing it (step 7) turns it, puts it
  on the ground and sizes it once, in its file.
- **It is a statue.** No skeleton, no motion. It can be placed, turned and
  lit; it cannot be posed until it is given a skeleton, which is the next
  step.

The model lands in the episode's `assets/models/`. `pva_release_model`
(step 7) makes it the character's: a release of a form whose medium is
`model-3d`. Its `can` lists the views it has and no actions, because it has
none.

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
- **The numbers say where to look.** The sheet also says, pose by pose,
  when a hand goes into the head or the body, one hand into the other, or
  one leg into the other, and how deep. It does not see a face that no
  longer looks like the character. Open the sheet.

**Rig the model you mean to show.** A textured model was sent to both
services afterwards: its three texture files came back byte for byte, and
the material with them.

A rig is released as a form whose medium is `rig-3d`. Its `can` lists the
clips it has as actions, and nothing it has no clip for.

The whole test, both figures: $1.40 on the ledgers of two episodes.

## 5. Give it motion

A rig moves as far as its clips go. Each clip is a file beside the rig,
`<rig>.clip.<name>.glb`: the rig's own body with one motion in it. There are
three ways to get one, in rising order of cost.

```text
Show me the stock clips for a human body that are jumps. Then rig the
guide's model again with "walking" and "big jump".
```

**Pick it by name, with the rig.** `pva_stock_clips` lists what one rigging
service has, at no cost: 113 clips for a human body (walks, runs, jumps,
gestures, sports, reactions) and clips for eight kinds of animal, each with
its length and whether it can be repeated. Name up to ten in `clips` on
`pva_rig_model` and they arrive with the rig, filed under their names, at no
price beyond the rig's. The other service adds a walk and a run to every
rig, and nothing by name:

<RigStrip show="walk" />

```text
Carry the walk of the other rig onto this one.
```

**Carry it from another skeleton.** `pva_retarget_clip` runs on your machine,
in Blender, at no cost. The source is any `.glb` or `.fbx` of the episode
with a skeleton and a motion in it: a clip one service made for another rig,
a motion from a library. Bones are paired by the part they play, and each
turn is copied as it is seen from outside the body, from the rest pose. So
the two skeletons may name, point and size their bones differently, and
rest in different poses.

```text
Make the guide wave hello with the right hand, then bow. Four seconds. Tell
me the price first, and show me the sheet.
```

**Ask for it in a sentence.** `pva_generate_motion` asks a motion service
for a person's motion: $0.08, reserved on the episode's budget before the
call. What comes back is kept in `assets/motion/` and carried to the rig.

<RigStrip show="wave" />

That request, on the first test figure: four of the six moments of the sheet
it was played on. The wave came. In those six moments no bow can be seen. A
generated motion may not be all that was asked: ask again, or ask for one
thing a clip.

**Play every clip before it is used.** `pva_rig_sheet` shows six moments of
each clip from two sides, and watches the whole clip for a hand that goes
into the head or the body: how deep, from when and for how long. Feet that
slide and a limb bent the wrong way are seen there, not measured.

- **Only two-legged bodies are carried by name.** Any other needs a map of
  its bones, and none was tried on a real animal.
- **Nothing fits a motion to a body.** A motion made for a person's
  proportions puts the hand of a character with a large head inside its
  face. The sheet finds it: a generated wave takes the right hand of the
  host of step 9 into his head by 8.9% of his height, for two and a half
  seconds. Nothing keeps the hand out yet.
- **The fingers and the face are not carried.**

The motion tests: $0.28. A rig with two stock clips for $0.20, a motion for
$0.08.

## 6. Film it

<ShotFilm />

The second figure with its textures, 18 November 2026: the walk three times
over, three-quarter, the whole figure, 1280×720 at 24 frames a second. 3.08
seconds of film, rendered in about twenty seconds.

```text
Film the guide walking, in the episode inventions/ep001: three-quarter, the
whole figure, the walk three times. The film is 1280 by 720 at 24 frames a
second.
```

`pva_rig_shot` films the rig playing one of its clips, on your machine, in
Blender, at no cost. The clip lands in `assets/video/<shotId>.mp4` with no
sound, where generated clips are kept, and goes on a timeline or in a cut
like any other.

- **The camera is asked for in a shot's words.** From the `front`,
  `three-quarter`, the `side` or the `back`; `full` for the whole body,
  `medium` for the waist up, `close` for the head and shoulders. The camera,
  the light and the floor are made from the body's own size and the way it
  faces.
- **It follows the body** as it travels, unless told to stay. Then a walk
  crosses the frame and leaves it.
- **Behind it is one colour.** Without the floor and its shadow, the
  character can be laid over something else in the edit.
- **A clip that travels jumps back when it repeats.** Loop one that plays on
  the spot, and let the edit move the picture.

The second shot of the test asked for the waist up in a tall frame, and came
back with the figure's ears and shoulders cut: the framing was measured by
height alone. It now holds a share of the body's width as well.

It is one character on an empty stage. Two in one picture, or one in a
place, is step 9. A rig still in its episode is filmed by its path, which is
how the shot above was made; once it is released and cast, it is filmed by
its role.

**Look at what was filmed.** A body that sinks into the floor and a walk
that slides are seen by whoever looks: nothing measures them. A hand in the
head is measured on the rig's sheet, which plays the same clips.

## 7. Release it in one step

```text
Release that rig as the guide's form, 1.2 metres tall. Then show me the
character.
```

`pva_release_model` takes the rig, or a model with no skeleton, from the
episode that made it and makes it the character's. It runs on your machine,
at no cost, in a fraction of a second.

- **It stands the figure once, in its file**: facing the front, its feet on
  the ground, its middle over the origin, as tall as you say in metres. One
  node above everything in the file carries the turn, the size and the move.
  The body, its textures and its clips stay the bytes the services returned,
  and no scene has to turn or lift the figure again.
- **Give it its height.** A generated figure is one unit tall whatever it is.
  Two characters in one picture are in proportion only if each was released
  at its own height.
- **What lands in the character's folder**, under
  `forms/<form>/<release>/`: the rig, its clips, the pose sheets, the picture
  it was made from, the record of what made the model, the rig and each
  clip, and a `form.json` that names every file's source by its hash.
- **What goes on the character's record**: the form (`rig-3d`, or `model-3d`
  with no skeleton), its actions read from the clips, and the release with
  what made it.

It refuses a rig that failed its examination, and one that was not posed
since its file last changed. A clip becomes an action only when it was
played on the rig's sheet. The others are left out and named.

The test, on the textured figure rigged by one service with the walk carried
from the other's rig: eleven files, 9.3 MB, 79 milliseconds. A second
release added a wave. The other service's rig of the same figure was
released as a second character, 0.95 metres tall.

A release is never edited. Another clip or a better rig is another release,
and a role keeps the one it pinned until it is cast again.

## 8. Cast it

```text
Cast the guide as "host" in the series inventions, wearing the puppet.
```

`pva_cast` writes the series' `cast.yaml`: the role, the character, the form
it wears there and the release it is pinned to. An episode made with `v1`
keeps `v1` when the character gets a `v2`.

The same character can hold different roles in different productions.
Another owner's character is named `owner/id` and read where it lives, never
copied.

## 9. Put two of them in a place

<ShotFilm show="meeting" />

The two characters of the test on a street set: ten seconds, with a camera
that goes with them. Filmed on 18 November 2026, and again on 19 November
once a character with nothing to play stood with its arms down.

```text
Film the host and the apprentice meeting, in the episode inventions/ep001,
on the street set. The host walks in from the left mark to the lamp, turns
to the apprentice and waves. The apprentice waits by the door for three
seconds, then runs to him. Three-quarter, the two of them in full.
```

`pva_stage_shot` films several characters in one picture, on a set or on an
empty stage, on your machine, at no cost. Each player is a role of the cast.
It starts at a place, and does one thing after another: plays a clip, goes
to another place while a clip plays, turns to someone, waits.

- **A stage is laid out as it is seen from the front**, in metres: to the
  right, and away from the audience. A place is a mark of the set by name, or
  two numbers.
- **The set is a Blender scene** the agent builds
  ([recipe](./blender-scene)), with no character in it. An object named
  `mark.lamp` is a place called `lamp`. The set brings its own light, and its
  own camera when you ask for it.
- **A walk takes the time its clip says.** The pace is read from the foot
  that is on the ground, so the body is moved as far as its feet step: 4.95
  metres in 5.96 seconds here, 0.83 m/s. The same walk on the same figure
  one metre tall measures 0.70. Give the walk a time of its own and it is
  taken in that time, and you are told the feet slide.
- **The camera** is the set's, or asked for in words about the players it is
  on. It goes with them and keeps its framing: it comes nearer as two walk
  towards each other.
- **A player with nothing to do stands.** Before its first clip, between two
  and after the last, a two-legged body has its arms down beside it, as low
  as its own body lets them. The apprentice waits by the door like that. A
  body whose bones are not read as a two-legged body's stays in the pose it
  was rigged in, and you are told.

**It says what one frame does not show.** For each player, the share of the
shot it was in the picture and the share something of the set stood between
it and the camera; pairs that came to stand in one place; a body moved
faster or slower than its clip walks; a part of a body that went into
another, a hand into a head, in centimetres, from when and for how long. In
a first take of this scene, with the set's own camera, the host was in the
picture for 89% of the shot: he walks in from outside it.

**Look at the film.** In this one the host's wave was made for a person's
proportions, and his hand goes into a head too large for it; he leans back
as he waves. The tool says so: his right hand 10.7 cm into his head, from
7.17 seconds for 2.46. It finds the hand; it does not keep it out.

Nobody touches anything. A hand on a door, an object carried, two bodies in
contact are not built. A player walks in a straight line from one place to
the next, and through whatever stands on that line.

## 10. Check a script against the cast

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
- **It does not animate by hand.** A rig moves by the clips it has: stock
  clips, a clip carried from another skeleton, a motion asked for in a
  sentence. There is no keyframing a performance, and no tool that takes a
  motion from a video.
- **Nobody touches anything.** Characters stand, walk, turn and play their
  clips beside each other and in a set. A hand on a door, an object carried
  and two bodies in contact are still a Blender scene the agent writes.
- **It does not plan a way.** A walk is a straight line between two places.
- **A generated rig has no face.** No bones for the mouth or the eyes: the
  character cannot speak or change expression.
- **Other bodies are untried.** Every rig so far was of a two-legged model.
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
- **Two characters released at one unit each.** A child as tall as a
  grown man. Give each its height when it is released.
- **A walk given a time.** Asked to cross the street in two seconds, a body
  is moved faster than its feet step. Leave the time out, or expect to be
  told.
- **A motion used because it arrived.** Asked for a wave and a bow, the
  service gave a wave. Play the clip on the sheet before a shot depends on
  it.
- **Editing a released folder.** The next `verify` reports files that no
  longer match their record. Make a new release instead.
- **A voice without its rights.** Cloning a voice needs a recorded consent;
  the cloning tools refuse without one.

## Next

[A format worth repeating](./repeatable-series) pins the cast with the rest
of a series' standard.
