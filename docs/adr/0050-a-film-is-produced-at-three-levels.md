> Imported studio reference, based on [e728acc](https://github.com/phoebus-84/video-studio/tree/e728accfa468a736558b34b8032bcacfee52218b). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# ADR-0050: A film is produced at three levels, each with its own cut and renders

## Status

Accepted. Implemented:
- the `Film`, `Scene` and `Shot` manifests and the `CutTimeline` contract;
- the cut renderer in `@av/video-composer`;
- `@studio/film`;
- the `film-project`, `film-scene` and `film-shot` pipeline families;
- the film tools (`pva_create_film` … `pva_render_cut`) and the film skills;
- the gateway's film routes and the browser studio's board, footage and cut
  views.

## Context

The studio produced serialised content: a channel keeps making episodes of a
series, every episode is one unit with one pipeline and one render, and the
edit timeline (ADR-0034, ADR-0036) is compiled from a spec whose shape the
series fixes.

A self-contained film — a short, a feature, a trailer, a documentary cut from
real footage — does not fit that:

- **It is one work, made once.** There is no series to pin a format and no
  next episode to reuse it. What holds it together is its own bible, not a
  template release.
- **It is too large to be one unit.** A feature is hundreds of shots. One
  pipeline and one render for all of it means a change to one shot re-renders
  ninety minutes, and one approval gate covers everything or nothing.
- **Its material is not generated to order.** It is cut from what exists —
  camera originals, location sound, stock, a composer's cues — beside what is
  generated or programmed. The episode timeline assumes the studio made every
  asset.
- **It is edited, not compiled.** Trims, joins, levels and a grade are
  decisions made on a timeline by a person or the agent, one at a time, and
  both must be able to make them on the same document.

## Decision

- **A film is the other kind of project a library holds, beside a channel.**
  `library/<film>/film.yaml` is what makes a directory a film. Its knowledge
  lives at every level, as a channel's does: `bible/`, `characters/`,
  `locations/`, `references/`, `voices/`, `sources/`, `skills/`, `footage/`
  and `music/` on the film; `references/`, `sources/`, `skills/` on a scene.

- **It is produced at three levels: the film, its scenes, their shots.**
  The hierarchy is `film / scene / shot`; sequences and acts are a grouping
  of scenes declared in `film.yaml`, not a level of directories, so a scene
  can move between sequences without moving on disk.

  ```text
  <film>/                       film.yaml
    artifacts/cut.json  output/
    scenes/<scene>/             scene.yaml
      artifacts/cut.json  output/
      shots/<shot>/             shot.yaml
        assets/  artifacts/cut.json  output/
  ```

- **Each level is a production unit like an episode.** It has the same
  directories (`artifacts/`, `assets/`, `attempts/`, `journal/`, `output/`),
  its own pipeline state, journal, approvals and renders. A unit is addressed
  with the three positions every tool, route and store already takes —
  `channel` the film, `series` the scene, `episode` the shot — with `_`
  naming the level itself: `(film, scene, _)` is the scene's own unit,
  `(film, _, _)` the film's. Nothing that worked on an episode needed a
  second code path to work on a shot.

- **Each level has a cut, and a cut is a `CutTimeline`** (`artifacts/cut.json`,
  `studio.video/v1alpha1`): tracks of clips, in frames, with trims, speed,
  transitions, picture and sound effects, fades, ducking, markers and a
  master. A clip's source is exactly one of a file of the unit, a file of the
  film (`footage/`, `music/`), a solid colour, or **the current render of a
  unit under it**. That last one is what joins the levels: a scene is cut
  from its shots' renders and the film from its scenes'.

  It is a new contract beside the edit timeline, not a version of it. The
  edit timeline is derived from a spec and rendered with Remotion; a cut is
  authored directly and rendered with FFmpeg. They answer different needs
  and neither is being retired.

- **A render is immutable, and freshness is derived.** `output/<render-id>.mp4`
  with the cut it rendered and a report; `output/current.json` names the
  unit's final render and `output/preview.json` its latest preview, moved
  only when the file is whole. A render is *fresh* while its cut and every
  file it read are as they were, by fingerprint. Changing a shot makes it
  stale and the scene and film above it blocked; rendering a level renders
  first, and only, the units under it that are not fresh. A final render
  reads final renders; a preview reads whatever is fresh.

- **The cut renderer is a reusable package that knows nothing of films.**
  `@av/video-composer` renders a resolved cut: the timeline is divided into
  windows, each rendered once and kept by the hash of what it shows, so an
  edit re-encodes the windows it touched. Effects are a catalog with declared
  parameters; the same catalog is what the agent's tool lists and what the
  studio's inspector draws its controls from.

- **A person and the agent edit the same cut.** Every write carries the
  revision it was made on and is refused if the cut moved on, so neither
  overwrites the other. A clip or a track a person locked is theirs:
  assembly leaves it alone and the agent's edits to it are refused.
  Assembling — a shot from its take, a scene from its shots, the film from
  its scenes — touches only the picture track's unit clips.

- **Who decides is declared per level.** Each level's pipeline comes in
  variants that differ only in where they wait for a person
  (`film-project` / `-auto`, `film-scene` / `-auto`, `film-shot` / `-auto` /
  `-directed`). A unit's `pipeline.yaml` names its own (`pipeline:`) and may
  name the one the levels under it run (`scenes:`, `shots:`), the nearest
  declaration winning. So one film can run unattended to its final review,
  be directed shot by shot, or anything between — one scene by hand inside an
  automatic film.

- **A film's budget is the film's.** A ceiling declared on the film covers
  every scene and shot under it: the ledger of any of its units reports what
  is left for all of them.

## Consequences

- **A change costs what it changed.** One shot re-rendered, its scene
  re-joined, the film re-joined. Scenes can be worked on, approved and
  rendered independently.
- **Real footage is a first-class source.** It is ingested once into the
  film's `footage/`, named by content, with a proxy, a contact sheet, its
  cuts and its loudness, and any cut names it by path. Camera originals are
  never rewritten: a trim is `in` and a length, a repair is an effect.
- **Two timelines, two renderers.** Series episodes keep the edit timeline
  and Remotion; films use the cut and FFmpeg. A graphic made with Remotion
  for a film is a take under a shot's `assets/`, used like any other file.
- **`_` is reserved.** No scene or shot can be called `_`, and code that
  joined `channel/series/episode` into a path by hand must go through the
  layout's functions, which place a film's units under `scenes/` and `shots/`.
- **The agent cannot hear or watch.** A render is reviewed from a stamped
  contact sheet and measured loudness. What that cannot establish — how a
  line sits against the music — is recorded as unchecked, for a person.
- **Not here yet.** Keyframed parameters, multi-camera sync, subtitles as a
  track, and interchange with other editors (EDL, OTIO) are not part of the
  cut. `metadata` on the cut and its clips is the place they would start.
