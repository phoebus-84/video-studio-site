> Imported studio reference, based on [f43b0ee](https://github.com/phoebus-84/video-studio/tree/f43b0ee50bedc4f78721e4aaf24300243d5cac78). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# ADR-0052: A character is a record, and takes any form

## Status

Proposed. Implemented with it:
- the `Character` and `Cast` manifests (`studio/contracts`, `character.mjs`);
- `@studio/cast`: characters on disk, their forms' releases, a production's
  cast resolved to what it pins;
- the character tools (`pva_characters`, `pva_create_character`,
  `pva_update_character`, `pva_cast`) and the skills `character-development`
  and `character-forms`;
- `model.generate`, the first of the capabilities that make a form: a 3D
  model from one picture, by Tripo H3.1 through `@av/fal-media`
  (`pva_generate_model`);
- `rig.create`: a skeleton and weights for a model, by Hyper3D or Meshy
  through `@av/fal-media` (`pva_rig_model`), with the exam a generated rig
  sits before it is released, and the sheet of known poses it is looked at
  in (`pva_rig_sheet`, by `@av/blender`);
- `motion.generate`: a person's motion from a sentence, by Hunyuan Motion
  through `@av/fal-media` (`pva_generate_motion`); and, with no capability
  of their own because nothing is generated, a clip carried from one
  skeleton to another (`pva_retarget_clip`) and stock clips asked for with a
  rig (`pva_stock_clips`, `clips` on `pva_rig_model`);
- a rigged character filmed playing a clip (`pva_rig_shot`, by `@av/blender`):
  one character on an empty stage, as a clip of video like any other, named
  by a rig of the episode or by a role of the cast;
- a model or a rig released as a form in one step (`pva_release_model`):
  the figure stood in its file — facing +z, on y 0, at the character's
  height — by one node above its scene's roots, and its clips, sheets and
  records copied and put on the character's record;
- characters staged in one picture (`pva_stage_shot`, by `@av/blender`):
  roles of the cast or rigs of the episode on the marks of a set, each doing
  one thing after another, a walk taken at the pace read from its clip, and
  what a single frame does not show measured and said.

Not implemented: the browser's view of a cast; motion from a generated
video, for a body that is not a person's; a face; and contact — a hand on a
door, an object carried, two bodies that touch.

## Context

The layout has had a `characters/` folder in every channel and every film
since ADR-0004 and ADR-0050, and no contract for what goes in it. Each channel
that needed characters invented one:

- one keeps **Blender puppets**: a `character.md` and a `motion.md` per
  character, immutable rig releases named `blender-rig-vNNN` with the master
  file's hash, a `catalog.json` that says of itself "not a Studio runner
  contract", and a `cast.json` in the series that selects regulars and guests;
- one keeps **pixel sprites**: poses, atlases, transparent clips and a
  manifest of 24 named actions with their timing;
- one keeps an **SVG component**: code with variants, palettes and
  expressions, versioned, imported by the episodes that use it;
- one keeps two Markdown files and nothing else: the characters are voices.

They agree on more than they differ. A character is owned above the episode.
It has an identity that does not change and a body that is released in
versions that are never edited. It can do a known list of things. A production
chooses who is in it. Nothing in the studio could read any of this: a script
could name a character that does not exist, ask for a gesture its form cannot
make, or be rendered with a rig that had changed since the episode was
approved.

Two things a character is not. It is not a 3D model: a study of thirty-two
free rigged models showed what a rig can do, and that most of what a channel
wants is not a rig. And it is not an asset of one episode: the same character
plays the same part across a series, or different parts across projects.

## Decision

- **A character is a record: who it is, apart from how it appears.**
  `characters/<id>/character.yaml` in whatever owns it — a channel, a series or
  a film. It names the character, its nature in free words, its voice, and
  the documents that say who it is (`character.md`), where it comes from
  (`backstory.md`) and how it plays (`performance.md`). A character with no
  form yet is valid: it exists on paper first.

- **A character takes any form, and may take several.** A *form* is one way
  it appears: a rigged 3D model, a 2D puppet, a sheet of sprites, a drawing
  made by code, a set of reference pictures for a generator, a photograph, a
  dot, a sound, a voice and nothing else. The medium is one of a short list
  with `other` in it; the studio does not need to understand a form to keep
  it, pin it and say what it can do.

- **A form says what it can do.** Its `can` lists the actions, expressions,
  mouth shapes and views it has, by the names a script or a timeline uses.
  That list is the contract between writing and animation: a line that asks
  for what the form cannot do is found when the script is checked, not when
  the shot fails.

- **A form is released, and a release is never edited.** A release is a
  folder — `forms/<form>/<release>/` for a new one, wherever it already is
  for one a channel made before — recorded with the hash of its entry file
  and of its whole tree. A change is a new release. The record says
  which is current, what made it (a model, a tool, a person) and under what
  licence it may be used.

- **A production casts.** `cast.yaml` in a series or a film gives each *role*
  a character, the form it wears there, and the release it is pinned to. The
  same character may hold different roles in different productions; another
  owner's character is named `owner/id` and is read where it lives, never
  copied (ADR-0035). An episode made with a pinned release keeps it when the
  character gets a newer one.

- **Likeness is written down.** A character drawn from a real person — a
  face, a voice, a name — says whose, and what permits it. The studio does
  not judge the permission and cannot know who is real: it warns of a
  photograph on a character that states no likeness, and the skills tell the
  agent to stop and ask rather than invent one.

- **Making a form is a capability, not a pipeline.** What turns a picture
  into a model, a model into a rig, words or a video into motion is a
  provider behind a capability (ADR-0015), added one at a time:
  `model.generate` (image or text to a 3D model), `rig.create` (a skeleton and
  weights for a model), `motion.generate` (motion for a rig, from text and
  constraints or from a video of the character). Each result is checked
  against the form before it is released — a rig that every limb on the
  ground has a bone for, a motion that passes an exam of known poses — because
  a generated rig or motion that looks right in one frame is the usual way
  this fails.

## Consequences

- The three shapes the channels invented become one. Their folders stay as
  they are; a `character.yaml` beside them records what is there.
- A script can be checked against its cast, and a cast against the disk, with
  no model in the loop.
- A form the studio cannot play (a `.blend`, an SVG component) is still kept,
  hashed and pinned. Playing it stays the job of the kit or the tool that
  knows the medium.
- The list of media will be wrong about something. `other` with a note is the
  way out, and a medium that recurs earns a name.
- A character's files are media, and follow the channel's Git and media store
  like every other (ADR-0045, ADR-0049).
