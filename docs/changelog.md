> Imported studio reference, based on [e2796c5](https://github.com/phoebus-84/video-studio/tree/e2796c57f66a019df41574d69bba41eb358e4e65). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Changelog

What changed for someone who uses the studio, newest first. How a release is
cut and what its number promises: [contributing](./contributing.md#releases).

## Unreleased — to be 0.3.0

### Needs action

- **The product is called Sergio.** The name it had is gone from the code,
  the documentation and what the tools say. Nothing a library keeps is
  renamed: the tools are still `pva_*`, the variables `AVG_*`, the packages
  `@av/*` and `@studio/*`, the manifests `studio.video/v1alpha1`. What moves:
  - **The render engine's defaults.** The clone on an engine is looked for in
    `~/sergio` and its cache in `~/.cache/sergio/render`. An engine whose
    entry in `render-hosts.json` names `repo` and `cache` is not affected;
    one that relied on the defaults moves its clone there, or names where it
    is.
  - **The archive cache** is `~/.cache/sergio/archive-media`. The old folder
    can be deleted; the new one fills as media is fetched.
  - **The gateway's `/health`** answers `service: "sergio-gateway"`.
  - **The root package** is named `sergio`.

### Documentation

- **The README opens with what the studio is for, and what it is not.** The
  architecture follows it. The running guide, the workspace layout and the
  domain language now cover characters and casts, the revision an edit must
  name, and the one render of a film at a time.

## 0.2.0 — 2026-11-17

The first release with a licence, and the first with a number that means
something. `0.1.0` was never tagged: it is whatever `main` was before this.

### Needs action

- **`pva_edit_cut` wants the revision you read.** Pass `expectedRevision`
  (printed as `cut revision N` by `pva_check_cut` and by every edit; 0 for a
  unit with no cut yet), or `latest: true` for an edit that is right on any
  revision. An edit that names neither is refused.
- **A second render of a film is refused, not run beside the first.** From
  any process: the agent's `pva_render_cut`, a stage, the browser. The refusal
  says what is being rendered.

### Added

- **A licence.** `packages/` is Apache-2.0, the studio and everything else is
  AGPL-3.0-only. `LICENSING.md` says what neither covers.
- **Films** (#99): a self-contained work produced at three levels — film,
  scene, shot — each with its own cut, edited by the agent or by a person on a
  timeline and rendered with FFmpeg in the pieces that changed.
- **Speech beyond Apple Silicon** (#95): Qwen3-TTS on CPU, CUDA and ROCm
  beside MLX.
- **Speech through a ComfyUI server** (#98), with voice cloning and
  clean-then-clone.
- **A photo that speaks, and ElevenLabs speech** (#96):
  `pva_generate_avatar_speech` makes a talking clip from a photograph and an
  audio file, only with a consent record the operator wrote for that
  photograph; `pva_synthesize_speech` takes `provider: "elevenlabs"`, and its
  word timings are reused by `pva_align_take` with no second paid call.
- **Characters** (ADR-0052): a character is a record apart from how it
  appears, owned by a channel, a series or a film. It takes any form — a rig,
  sprites, a drawing made by code, a photograph, a dot, a sound, a voice alone
  — released in folders recorded with their hashes, and a series or a film
  casts it in a role, pinned to the release it wears. `pva_characters`,
  `pva_create_character`, `pva_update_character`, `pva_cast`, and the skills
  `character-development` and `character-forms`.
- **A 3D model from one picture** (`model.generate`): `pva_generate_model`
  asks Tripo H3.1 through fal for a textured model, on the episode's budget
  at the price of what is asked, and says what came back — triangles,
  materials, textures, its size and where its origin is, that it has no
  skeleton, and when it is too heavy to rig. Run against the real service on
  2026-11-17: a textured GLB, a quad FBX of 20,000 faces and a bare mesh,
  each recorded on the ledger at its price.
- **Retake** (`bench/retake`): the specification of a benchmark for what
  happens after the first take. No harness and no numbers yet.

### Fixed

- **Two processes writing one cut.** The gateway and the agent could both read
  a revision, both pass the check and both write the next one; the second
  replaced the first unseen. The read, the check and the write are now held
  together by a lock.
- **An edit by the agent now shows in an open editor**, and a stage that moved
  reaches the event stream (#91): the gateway reads both from the files that
  changed, whoever wrote them.
- **A render's sources are told apart by more than size and date.** A file
  replaced by other bytes of the same length, with its date put back, no
  longer counts as unchanged. Renders made before stay current.
- **A render that finishes after its cut was edited and rendered again** no
  longer takes the newer render's place.
- **A render's line in the journal is no longer dropped in silence** when the
  journal cannot be written: it is kept beside the render, written at the next
  one, and reported.
- **What a clip's lock holds when a scene is assembled** is now what the
  skills say: what the clip shows, not its place in time; assembly's notes say
  when a locked clip moved.
