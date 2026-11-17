---
title: A character people recognise
description: "Define a character as a record apart from how it appears, give it a form with a list of what it can do, release that form, and cast it in a series pinned to the release."
---
# A character people recognise

**You end with:** a character on disk that a script can name and a series can
cast: who it is, the forms it takes, what each form can do, and a release of
each form that will not change under the episodes made with it.

A character here is a record, not a 3D model. It can be a person, a fox, a
lamp, a dot, a sound, a voice and nothing else. The studio keeps it, hashes
it and pins it. It does not make it: there is no tool yet that turns a
picture into a model, rigs it or animates it.

## Ingredients

- A channel, a series or a film to own the character
  ([build a channel](./build-a-channel)).
- A role: what the character is for in the story.
- The material for at least one form, if it is to appear: drawings, sprites,
  a rig, a component drawn by code, reference pictures, a recording.
- For a real person's face, voice or name: their permission, in writing. For
  a synthetic voice made from a recording: the voice rights to do so.

**Costs:** the agent's model usage. Recording a character and casting it
makes no paid API calls. Making a form may: generated pictures and synthetic
voices are metered like any other.

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

## 3. Cast it

```text
Cast the guide as "host" in the series inventions, wearing the puppet.
```

`pva_cast` writes the series' `cast.yaml`: the role, the character, the form
it wears there and the release it is pinned to. An episode made with `v1`
keeps `v1` when the character gets a `v2`.

The same character can hold different roles in different productions.
Another owner's character is named `owner/id` and read where it lives, never
copied.

## 4. Check a script against the cast

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
- **It does not make one.** No image-to-model, no automatic rigging, no
  generated motion. Generated reference pictures help consistency; they
  do not guarantee it, and a new angle still has to be looked at.
- **It does not judge a permission.** It warns of a photograph on a character
  that states no likeness. Whether you may use a face or a voice is yours to
  establish.
- **The browser studio has no view of a cast.**

## Where it goes wrong

- **A form that promises too much.** A `can` list copied from a wish list
  makes the script check pass and the shot fail.
- **Editing a released folder.** The next `verify` reports files that no
  longer match their record. Make a new release instead.
- **A voice without its rights.** Cloning a voice needs a recorded consent;
  the cloning tools refuse without one.

## Next

[A format worth repeating](./repeatable-series) pins the cast with the rest
of a series' standard.
