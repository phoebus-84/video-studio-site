> Imported studio reference, based on [19c5681](https://github.com/phoebus-84/video-studio/tree/19c568188fc4404961e923cc38de93940e6eb1b3). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# @av/blender

Reusable **Blender 4.2–4.x and 5.2.x LTS** scene creation and background rendering. TypeScript owns jobs/processes; Python runs **inside Blender**.
No studio imports, cloud-rendering dependency, add-on installation or MCP server.

- `scene.create`: reviewed `bpy` script → editable, image-packed `.blend`.
- `scene.render`: saved `.blend` → PNG preview or PNG sequence + silent MP4.
- Eevee and Cycles; explicit CPU/GPU selection for Cycles, no fallback.
- Keyframes, Geometry Nodes, Asset Browser marking via normal Blender Python.
- Poly Haven metadata search and bounded, checksum-verified CC0 downloads.
- A rigged `.glb` posed and rendered on a sheet, with how far each pose
  pulled its surface out of shape (`@av/blender/rig-sheet`).
- A clip in a `.glb` or an `.fbx` read as turns from the rest pose, to be
  carried to another skeleton (`@av/blender/clip-sample`).
- Exclusive attempt directories, source hashes, logs, cancellation and timeouts.

## Setup

Install Blender **5.2 LTS** (or 4.5 LTS) from Blender's official distribution and
FFmpeg with libx264. Other 5.x release families and future major versions are
rejected until compatibility is tested. Set `BLENDER_BIN` to the executable if not on PATH. The standard macOS
application path is also detected. `FFMPEG_BIN` optionally overrides FFmpeg.
This adapter uses Blender's bundled Python and `bpy`; no pip installation is
needed. A standalone `bpy` distribution can run without a separate Blender app on
supported platforms, but it bundles Blender functionality and is **not** the
execution backend used here.

From this package directory, after the workspace's `bun install`:

```bash
npm run cli -- --probe
npm test                 # fake-process tests; no Blender needed
npm run test:live        # actual Eevee/Cycles + Geometry Nodes smoke test, and a rig posed
```

In Sergio: `npm run compose -- --profile=blender`, then `npm run doctor`.
The `full` and `studio` profiles also include Blender. Other profiles remain
unchanged. The agent exposes `pva_blender_probe`, `pva_blender_create_scene`,
`pva_blender_render` and `pva_poly_haven`; load the `blender-scene` skill.

From the repository root, `npm run smoke:blender` exercises the **real registered
workspace and Blender tool handlers**, without mocks or an LLM/browser session.
It creates a fresh `studio-tests/blender-smoke` episode, builds the bundled scene,
then renders both engines and a two-second Eevee animation. Artifacts, tool-call
records and technical QA remain in the episode; it does not approve publication.

**Live verified on Blender 5.2.1 LTS / macOS:** scene creation, Geometry Nodes,
asset marking, layered-action keyframes, Eevee/Cycles stills, 48-frame MP4 and full
video decoding. Blender 5 uses `BLENDER_EEVEE` and action slot/channel bags; 4.x
compatibility paths remain in place. This is not a claim that every Blender
feature or GPU backend has been exercised.

## A rig, posed and looked at

A rig that is right at rest and wrong the moment it moves is the usual way an
automatic rig fails. `rigSheet` puts a rigged binary glTF in known poses and
renders what it looks like:

```ts
import { rigSheet } from "@av/blender/rig-sheet";

const { report, outputDir } = await rigSheet({
  rigPath: "figure.glb",
  outputDir: "/tmp/figure-sheet-001",   // new; never written over
  faces: "+z",                           // which way the body faces in its file
  actions: ["Walk"],                     // clips inside the rig, by name
  clips: [{ name: "run", path: "figure.run.glb" }],
});
```

- `poses.png`: one column a pose, the first the rest pose; rows are the
  front, three-quarter and the side. A two-legged body, read from its bones'
  names, gets seven poses: arms up, arms down, reach, step, wide, head turn,
  bow. The arms are set to a height, so an A-pose and a T-pose end in the
  same place. Any other body has each of its largest limbs swung.
- `poses` of your own replace them: turns of named bones about the body's
  axes — `front`, `up`, `side` — through the bone's head. Never about a
  bone's own axes: two rigs point their bones in different ways.
- `clip.<name>.png`: six moments of a clip from two sides, the camera
  following the body.
- **What passes through what.** A two-legged body's skin is cut up by the
  bone that moves each point most — head, body, each hand (the forearm and
  all that hangs from it), each upper arm, each leg — and each pose, and
  each clip at 24 moments a second, is looked at for a part inside another
  it is not joined to: a hand in the head, the body or the other hand, a leg
  in the other. A point is inside a part when a ray out of it crosses the
  part's surface an odd number of times, two rays of three deciding, so an
  eye inside a head changes nothing. `through` gives how deep, in heights of
  the body beyond how deep at rest, and in a clip from when, for how long
  and deepest when. Less than 2% is not said.
- `sheet.json`: the bones, each pose's turns, and for every pose and clip the
  share of the surface's edges strained (pulled to half as long again, or
  pressed to two thirds) and the number torn (pulled to three times their
  length). Ten hand-made two-legged rigs measured this way stay under 1%
  strained; a coarse body (a fox of 1,700 edges) shows more.

It runs no code that came with the model, so it asks for no `trustedInput`.
`npm run test:live` poses a small figure built by the test.

## A motion, read out of a file

`sampleClip` plays a clip held in a `.glb` or an `.fbx` and returns what
every bone did:

```ts
import { sampleClip } from "@av/blender/clip-sample";

const clip = await sampleClip({ path: "walk.fbx", outputDir: "/tmp/walk-sample-001" });
clip.rotations["LeftUpLeg"][12]; // x y z w: the turn from its rest pose, in the world
clip.positions["Hips"][12];      // where the bone starts in that frame
```

Turns are measured from the rest pose and in the world, not in a bone's own
axes, and everything is written in glTF's axes (y up) whatever the file's
were. That is what carrying a motion from one skeleton to another needs: two
rigs name, point and size their bones differently, and a turn in the world
means the same on both. The carrying itself is arithmetic and is not here.

## A rigged character, filmed

`rigShot` lights a rigged body on a plain ground and renders it playing the
one clip its file holds, from a camera asked for in the words a shot is
described in:

```ts
import { rigShot } from "@av/blender/rig-shot";

const { mediaPath, report } = await rigShot({
  path: "figure.clip.walking.glb",   // the body with one motion; or the rig, to film it standing
  outputDir: "/tmp/figure-shot-001",
  camera: "three-quarter",           // front, three-quarter, side, back
  framing: "full",                   // full, medium (waist up), close (head and shoulders)
  loops: 3, width: 1280, height: 720, fps: 24,
});
```

The camera, the light and the ground are made from the body's own size and
the way it faces; the camera keeps the body in frame as it travels unless
`follow` is false. Frames are rendered with Eevee and joined by FFmpeg into
an H.264 file with no sound. No script comes with a request, so it asks for
no `trustedInput`. One character on an empty stage.

## Characters on a set, filmed

`stageShot` puts several rigged bodies in one picture and, when a set is
given, in a place. Each player stands on a mark, turned the way it is told,
and does one thing after another:

```ts
import { stageShot } from "@av/blender/stage-shot";

const { mediaPath, report } = await stageShot({
  outputDir: "/tmp/street-001",
  set: "street.blend",                       // metres, z up, front towards -y; without it, an empty stage
  camera: "set",                             // or { view: "three-quarter", framing: "wide", on: ["guide"], follow: true }
  players: [
    { name: "guide", path: "guide.glb", at: "left",
      does: [{ clip: "guide.walking.glb", to: "lamp" }, { towards: "child" }, { clip: "guide.wave.glb" }] },
    { name: "child", path: "child.glb", at: "door", towards: "guide",
      does: [{ seconds: 3 }, { clip: "child.running.glb", to: [1.5, 2.1] }] },
  ],
});
```

- **A stage** is laid out as it is seen from the front: x to the right, y
  away from the audience, in metres. A place is `[x, y]`, or the name of a
  mark: an object of the set called `mark.<name>`, whose own -y is the way a
  player stands on it. A place in metres stands on the set's floor there.
- **A walk goes at its clip's pace.** The pace is read from the joint that
  stays down and goes backwards under the body, and the way takes as long
  as that says unless `seconds` is given. A clip that carries the body by
  itself is kept on the way.
- **The camera** is the set's own, or made from the size of the players it
  is on and where they stand. It goes with them and keeps its framing,
  nearer as they come together; told to stay, it holds everywhere they go.
- **Between clips a body stands.** A two-legged body that plays nothing —
  before its first clip, between two, after its last — has its arms brought
  down from its rig's A- or T-pose to 75° below the horizontal, or less low
  where a hand would go into its body or a leg (`standing`). A clip comes in
  over that and gives way to it again. Every clip's turns are written with
  w at or above 0 before they are played, so a blend between two takes the
  short way round instead of spinning a limb.
- **The report** says, for each player, what it did and when, the pace and
  the speed of each way, the share of the shot its chest was in the picture
  and the share the set hid it, and the parts of it that went into each
  other (`through`, in metres, as the rig sheet measures them); and the
  pairs that came to stand in one place.

The set's own Python is not run, and no script comes with a request. Nobody
touches anything: there is no contact between a body and the set, or
another body.

## Standalone workflow

Create `request.json` (paths relative to the process working directory):

```json
{
  "mode": "create",
  "scriptPath": "examples/orbit.py",
  "outputDir": "/tmp/av-blender-build-001",
  "trustedInput": true,
  "settings": { "frameStart": 1, "frameEnd": 48, "fps": 24 }
}
```

```bash
npm run cli -- request.json
```

The bundled example builds a lit product scene, keyframes a torus, creates a
Geometry Nodes ring and marks reusable material/node assets. Read it before
executing. The worker saves `scene.blend`; the script should only build the scene.
Script globals `AV_INPUT_DIR` and `AV_OUTPUT_DIR` are available for asset paths.

Preview the saved source using another request:

```json
{
  "mode": "preview",
  "blendPath": "/tmp/av-blender-build-001/scene.blend",
  "outputDir": "/tmp/av-blender-preview-001",
  "trustedInput": true,
  "settings": { "engine": "eevee", "width": 640, "height": 360, "frameStart": 24 }
}
```

For final animation use `mode: "animation"`, a fresh output directory and
**explicit** settings, for example:

```json
{
  "engine": "cycles", "device": "cpu", "width": 1920, "height": 1080,
  "fps": 24, "frameStart": 1, "frameEnd": 48, "samples": 128, "seed": 7
}
```

Programmatic API:

```ts
import { runBlender } from '@av/blender';
const result = await runBlender(request, {
  timeoutMs: 3_600_000,
  signal: abortController.signal,
});
// result: outputDir, manifestPath, blendPath, mediaPath?, frameCount
```

Defaults: Eevee, 640×360, 24 FPS, inclusive frames 1–48, 32 samples, seed 0.
Preview renders `frameStart`. Frame count / FPS is the exact intended duration.
Settings override the source scene; existing compositor and sequencer are
**disabled**. This is a shot renderer, not a full Blender video-editor renderer.
Eevee manages its graphics context; `device: cpu` does not make Eevee CPU-only.
GPU backend selection applies to Cycles. Use CPU Cycles explicitly if Eevee
cannot initialize on a headless machine. No silent switch is made.

## Outputs and handoff

Each attempt contains `manifest.json`, `request.json`, `blender.log`,
`scene-info.json`, `scene.blend`, plus `source.py` for builds. Render attempts add
`preview.png` or `frames/000001.png`… plus `animation.mp4` and `encode.log`.

The manifest records running/completed/failed/cancelled status, source/worker
SHA-256, Blender version, settings, scene inventory and output hashes. A zero
exit without expected files is failure. Failed attempts retain logs/frames.
Attempts never overwrite an existing directory; retry into a new one.

An artist can open the `.blend`, edit it, **Save As** a new revision, and submit
that file for another preview/render. The original input file is not saved over.
Concurrent source saves are detected by comparing its hash before/after work.
Image files are packed, but linked libraries and non-image caches remain external;
`scene-info.json` inventories linked libraries. For a portable handoff, append
assets and keep all simulation/volume/font dependencies. Keep `asset.json`
provenance receipts with the source project.

Asset Browser uses ordinary Blender assets: `data_block.asset_mark()`, asset
metadata, and saved `.blend` files in an artist-configured asset-library folder.
No global preferences are modified by this package.

## Poly Haven

```ts
import { searchAssets, assetFiles, downloadAsset } from '@av/blender/poly-haven';
const assets = await searchAssets('hdris', 'sunset', signal);
const files = await assetFiles('venice_sunset', signal);
const asset = await downloadAsset('venice_sunset', 'hdri.1k.hdr', '/tmp/hdr-001', {
  maxBytes: 32 * 1024 * 1024, signal,
});
```

Select exact keys returned by `assetFiles` (resolution/format are not guessed).
Only HTTPS `dl.polyhaven.org` downloads are allowed, redirects rejected, maximum
256 MiB by default, with a five-minute acquisition deadline. Download receipts
record CC0-1.0, source URL, upstream MD5 verification when supplied, SHA-256 and
bytes. Search/files helpers accept an AbortSignal; callers should supply a deadline.
Models may need **multiple files**: inspect dependencies, download them explicitly
and relink images; this API does not automatically reconstruct model packages.
CC0 provenance does not license unrelated assets mixed into a scene.

## Safety and limitations

`trustedInput: true` acknowledges local trust, **not** human approval. Blender is
started with factory settings, `--disable-autoexec`, and
`--python-exit-code 1`; `.blend` loading uses `use_scripts=False`. Explicit Python
still has full host permissions. Review scripts and assets; use an isolated
OS/container worker for untrusted inputs. Do not enable auto-run to fix drivers.

- Async rendering/encoding is cancellable; POSIX process groups receive SIGTERM
  then SIGKILL after two seconds. Version probes have a ten-second timeout.
- The timeout applies per render/encode process, not a total episode budget.
- No durable worker daemon, frame-resume, render farm or simulation baking yet.
- Reproducibility metadata is not a promise of bit-identical GPU renders.
- MP4 has no audio; add sound/captions via a separate compositor. Decoding,
  visual review and delivery QA remain caller responsibilities.
- The first version is a **Pi-directed shot workflow**, not a claim that the
  legacy gateway can autonomously execute arbitrary Blender stages.

Official references: [Python API](https://docs.blender.org/api/4.5/),
[CLI](https://docs.blender.org/manual/en/4.5/advanced/command_line/arguments.html),
[Poly Haven API](https://api.polyhaven.com/), [CC0 terms](https://polyhaven.com/license).
