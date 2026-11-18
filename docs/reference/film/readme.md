> Imported studio reference, based on [e728acc](https://github.com/phoebus-84/video-studio/tree/e728accfa468a736558b34b8032bcacfee52218b). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# @studio/film

A film on disk, produced: its scenes and shots, its footage, and its cut at
each level — assembled, checked, edited and rendered (ADR-0050).

A film is the other kind of project a library holds, beside its channels: one
self-contained work, short or feature length. It is produced at three levels,
each a production unit with its own manifest, journal, cut and renders:

```text
<film>/                        film.yaml · bible/ characters/ locations/ footage/ music/ …
  artifacts/cut.json           the whole film: its scenes in running order, its music
  output/                      the film's renders
  scenes/<scene>/              scene.yaml · references/ skills/ sources/
    artifacts/cut.json         the scene: its shots in cutting order, its dialogue and sound
    output/
    shots/<shot>/              shot.yaml
      assets/                  the shot's takes: footage, stock, generated or programmed
      artifacts/cut.json       the shot: its take, trimmed and treated
      output/
```

Units are addressed with the three positions every tool of the studio takes —
`channel` is the film, `series` the scene, `episode` the shot — and `_` names
the level itself: `tide/010-shore/_` is the scene's own unit, `tide/_/_` the
film's.

## What is here

| Module | |
|---|---|
| `units` | References, directories, manifests as they are on disk, scenes and shots in running order |
| `authoring` | `createFilm`, `createScene`, `createShot` (idempotent, never overwriting); `updateManifest` and `setOrder`, which write only a manifest that holds and keep the file's comments |
| `cut-store` | `readCut`, `writeCut` (revision counted, a stale writer refused), `editCut` with a list of operations applied together or not at all; a clip or track a person locked is left alone by the agent |
| `cut-assemble` | `assembleCut`: a shot from its media, a scene from its shots, the film from its scenes — touching only the picture track's unit clips |
| `cut-render` | `resolveCut` (sources to files, units to their renders), `cutStatus`, `checkUnitCut`, `renderUnit` (cascading to the units below that are not fresh), `renderUnitFrame` |
| `footage` | `ingestFootage` into `footage/` (named by content, probed, with a contact sheet, its cuts, a proxy and its loudness), `searchFootage`, `inspectMedia` |
| `tree` | `filmTree`: every scene and shot in order with where each stands; `nextSteps` |

## Renders

A render is immutable: `output/<render-id>.mp4`, the cut it rendered
(`<render-id>.cut.json`), a report (`<render-id>.report.json`) and, for a final
render, its mix (`<render-id>.mix.wav`). `output/current.json` points at the
unit's final render and `output/preview.json` at its latest preview.

A unit's render is **fresh** while its cut and every file it read are as they
were. A scene reads its shots' renders and the film its scenes', so changing a
shot makes the shot stale and the scene and film above it blocked until it is
rendered again; `renderUnit` with `cascade` (the default) does exactly that
work and nothing else. A final render reads final renders only; a preview
reads whatever is fresh.

The rendering itself — effects, transitions, mixing, loudness — is
`@av/video-composer`'s cut renderer, which knows nothing of films.
