> Imported studio reference, based on [3dee4dc](https://github.com/phoebus-84/sergio/tree/3dee4dc69199ab145af8d2c35d72328c9d70dd37). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# ADR-0055: ComfyUI is a generic local generation backend, and generated music is a source of its own

## Status

Proposed. Amends [ADR-0053](./0053-music-is-code-rendered-offline.md): music
composed as code stays as that record decides, and is the default; it is no
longer the only music the studio makes. Implemented in the same change:
- `@av/comfyui`: the client and template machinery moved out of
  `@av/comfyui-speech`; declared workflows, `probeWorkflow`, `runWorkflow`;
  four built-in workflows;
- `@av/comfyui-speech`: VoiceDesign (`design.json`, `speakWithDesignedVoice`);
- `pva_comfyui_workflows`, `pva_comfyui_run`; `voiceDesign` in
  `pva_synthesize_speech`; ComfyUI workflows in `pva_capability_status`;
  generated music in `pva_music`;
- the skill `comfyui-workflows`, and generated music in `film-sound`,
  `strudel-sounds`, `pva-executive-producer`.

## Context

Sergio reached ComfyUI for speech only: `@av/comfyui-speech` held a small
client and five Qwen3-TTS graphs as API-format JSON with `{{placeholders}}`,
and the agent used them through `pva_synthesize_speech` (provider
`comfyui-qwen`), `pva_clean_voice`, `pva_voices` and `pva_capability_status`.

Meanwhile the operators used their ComfyUI server for much more, outside
the studio: Qwen3-TTS VoiceDesign then a Base-model clone of the chosen
design, by Python script; Flux.2 Klein and Z-Image for pictures and edits;
Wan 2.2 TI2V 5B and A14B for clips; MuseTalk and LivePortrait for
lip-sync and portraits; ACE-Step-like graphs for music. What they made came
into productions with no record of how — no workflow, no seed, no model.

An adapter per model would be five adapters today and more next month, each
a copy of the same queue-wait-download loop. Which nodes a server has also
varies: one runs with `--disable-all-custom-nodes`, another has packs such
as `FB_Qwen3TTS*` and `AudioSeparation`.

ADR-0053 meanwhile framed the studio's music as Strudel code only, and its
consequences said that a film needing an orchestra or a singer needs a
composer or a licensed recording. Music generated with a model is as
legitimate a source as a licence or a composer, and the operators make it.

## Decision

### Workflows are templates

A workflow is a graph in ComfyUI's API format (*Export (API)*) in which a
string value that is exactly `"{{name}}"` is replaced by the value given
under that name, keeping the value's type — the convention
`@av/comfyui-speech` already used. A missing value and a value nothing asks
for are both errors. Nothing else in the graph is touched, so a template is
a graph that can be diffed and re-exported. `optionalNodes` leaves nodes
out when their input is absent (and drops what read them); `bypassNodes`
passes a node through unless its flag is set.

The client and this machinery are `@av/comfyui`. `@av/comfyui-speech`
depends on it, unchanged in behaviour.

### What a template declares

```json
{
  "description": "…", "kind": "image",
  "inputs":  { "prompt": { "type": "text" }, "seed": { "type": "seed" }, "image": { "type": "image", "optional": true } },
  "outputs": { "9": "image" },
  "requires": { "nodes": [], "packs": [], "models": [{ "node": "16", "input": "unet_name", "folder": "diffusion_models" }] },
  "verifiedOn": "ComfyUI 0.3.x, <GPU>, <date>",
  "prompt": { "…": "the graph" }
}
```

- **kind**: `image`, `image-edit`, `video`, `speech`, `music`, `audio`,
  `other` — what it makes, which decides where its outputs go by default.
- **inputs**, one per placeholder: their type (`text`, `string`, `integer`,
  `number`, `boolean`, `choice`, `seed`, `model`) and range, a default, and
  which are files to upload (`image`, `audio`, `video`). A seed not given is
  picked and returned.
- **outputs**: node id → `image`, `video` or `audio`. Every file the node
  saved is kept, whatever key the server lists it under.
- **requires**: the node classes (read from the graph, plus any declared),
  the custom node packs that provide them (for a person), and the models: a
  loader node's input, whose value is the file. `folder` and `source` say
  where it goes and where to get it. **Nothing downloads a model or
  installs a node.**
- **Model files are inputs.** Every server names its files its own way: on
  the first real server, three of the four built-in workflows failed on a
  file name alone. So a loader's file is a `model` input with a default,
  checked against the loader's list like any model. A call may name
  another file, and a library sets its server's names once, per workflow,
  in `.render/comfyui.json` (`workflowDefaults`), without copying the
  workflow. A file named in the graph itself is a warning.
- **verifiedOn**: when and where it last ran well on a real server; absent,
  never, and the tools say so.
- `{{outputPrefix}}` belongs to the runner: each run saves under a folder of
  its own on the server.

A file that does not fit (the UI format, a placeholder not declared, an
input nothing reads, an output not in the graph) is listed with its
problems and cannot run.

### Where templates live

| Where | Whose | Origin |
|---|---|---|
| `packages/comfyui/workflows/` | the ones the studio maintains | `built-in` |
| `library/.render/comfyui/workflows/` | the operator's, for every channel and film on this machine, beside the server's `comfyui.json` | `library` |
| `library/<channel or film>/comfyui/workflows/` | a channel's or a film's own; they travel with its repository (ADR-0045) | the slug |

Read in that order; a later one hides an earlier one of the same name, and
the listing says what it hides. A channel's name never appears in the
application (ADR-0044): its workflows live in its own folder. The speech
graphs stay in `@av/comfyui-speech`, run by its own operations.

### Probe before queueing

Before anything is uploaded or queued, the server is asked
`/object_info/<class>` for every class the filled graph needs (once per
class across a listing): whether it has the class, whether the graph gives
each node every input this server's version requires (nodes gain required
inputs between versions, and the server would refuse the graph at queue
time), and, for each required model, whether the loader's input lists the
file among its choices. A missing node, input or model is an error naming
it — for a model, the `models/` folder it goes in and the files the loader
does list — with nothing sent. `pva_comfyui_workflows` and `pva_capability_status` show the
same probe for every workflow without running any.

### Receipts

Beside every output, `<file>.comfyui.json`, as `comfyui-speech`'s
synthesis receipts:

- the workflow: name, kind, origin, file, the file's SHA-256, and the
  SHA-256 of the graph as queued; its `verifiedOn` or null;
- every value it was filled with, the input files by workspace path, hash
  and the name they were uploaded as (their content's hash: no local name
  leaves the machine), and the seeds;
- the models the graph named, by loader and file;
- the server's version and devices — never its address, which is
  configuration;
- `runtimeVerified: false`: ComfyUI names models; it does not attest their
  hashes or its nodes' versions;
- the output: node, role, path, hash, bytes, length for audio and video.

Generated media are not overwritten (ADR-0021): a run whose name is taken
is refused before the GPU is used, and a retake is a new name.

### Cost

$0: the GPU is the operator's. Nothing is reserved on the spend ledger.
What a run did cost is its time: the server's own measure (from its
`execution_start` to its `execution_success` timestamps) and the wall time,
queue included, in the receipt and, for an episode or a film unit, in its
journal as an `artifact-written` event with `gpuSeconds`. A channel source
has no journal of its own: its runs' time is in their receipts.

### How what it makes enters a production

`pva_comfyui_run` works on the same workspaces as every tool — an episode, a
channel source, a film, a scene or a shot — and writes by kind:
`assets/images/`, `assets/video/comfyui/`, `music/`, `artifacts/narration/`,
`assets/audio/`, or a folder the call names inside the workspace.

- An episode's picture named after its scene is where its spec looks, as
  `pva_generate_image` writes it.
- A shot's still or clip is placed in the shot's cut with `pva_edit_cut`
  (`source: { path }`), like any take of the shot.
- Speech from a workflow of the operator's is a take: `pva_register_take`,
  `pva_align_take`, `pva_verify_take`, as for the Qwen providers.
- Music: below.

The run itself registers nothing: placing a take is an editorial act, and
stays the agent's or the person's, with the tools that already do it.

### Speech

Speech stays `pva_synthesize_speech` with `provider: "comfyui-qwen"` and
its own consent rules. VoiceDesign joins it as `voiceDesign`: a voice made
from a description. A design is nobody's voice and needs no consent while
nothing is kept; saving it on the server (`saveVoiceAs`) binds the consent
record to the saved name, as for any saved voice. Every later line is then
`saved:<name>` — the design-then-clone the operators did by script.

### Music (amends ADR-0053)

Music has several legitimate sources: what the person supplies, a licensed
recording, music composed here as code, and **music generated with a
model** (ACE-Step or similar, through ComfyUI). Strudel stays the default
for music composed as code, and the default when nobody asked for anything
else. Generated music is chosen by the operator, or offered by the agent
when a cue needs what code does not give and a music workflow can run. It
carries the same provenance as any generated take: workflow, model, seed,
tags and lyrics, in its receipt.

Generated music goes where Strudel's renders go: `music/` of an episode or
a film unit, the cut's music track, its gain, fades and ducking. A cut
names a file, not a record, and its renderer decodes a FLAC as it decodes
a WAV, so nothing in the cut changes. `pva_music` lists generated cues
beside the pieces and their renders.

`MusicRender` (`<file>.music.json`) and `pva_music_render` stay Strudel's:
the record is a render of a piece — the piece's path and hash, its cycles,
tempo and parts, the engine's version, the stems — and a generated take has
none of these. Its record is its receipt. Two things are **a later step**:

- **Levelling and measuring a generated cue as a render is.** A Strudel
  render is brought to −18 LUFS with one gain and carries its spectrum and
  level through time; a generated file comes as the model made it. Today
  `pva_analyze_audio` measures it and `pva_edit_audio` levels it as a
  recipe. Doing it on arrival needs the analysis, now in `@av/strudel`,
  moved where both can use it.
- **One record for a unit's music**, whatever its source, which the studio's
  Music tab and a score could read alike.

### The server

Reached exactly as speech reaches it, in ADR-0056's order: `AVG_COMFYUI_URL`;
else a `comfyui` machine of the library's machines file, through a tunnel
opened on demand; else `url` in the library's `.render/comfyui.json`
(`AVG_COMFYUI_CONFIG` names another file). That file may also set
`workflowTimeoutSeconds` (default 1800), `workflowOutputPrefix` and
`workflowInputSubfolder`. On a machine with a `gpuLock`, a run holds the lock
from before its upload to its last download, and waits for it as long as a
run may take (`workflowTimeoutSeconds`), so a run queued behind another does
not give up first. The receipt names the machine (`machine`), never an
address.

## Consequences

- Any graph the operator has built can run through the studio with a
  receipt, by writing it down once — no adapter, no code.
- What a server lacks is said before anything runs, in the listing, the
  status and the refusal.
- A built-in workflow that has not run on a real server may be wrong in a
  node's name or inputs: it says so, and its first run is its test. Three of
  the four have run (`verifiedOn`); ACE-Step v1 is kept as a v1 graph, and
  ACE-Step 1.5, whose nodes differ, is a workflow still to add.
- ComfyUI is reached through its own tools, not as a provider of the
  provider-neutral capabilities (ADR-0015): a stage that asks for
  `image.generate` still gets the provider its profile names. Making
  ComfyUI a capability provider — with explicit `defaultProviders`, never a
  silent fallback — is a later decision.
- One graph runs at a time on a shared GPU; a long clip holds the server.
  A run given up on is taken out of the queue if it has not started, and
  left to finish if it has: interrupting would stop whatever the server is
  running.
- A film may now have an orchestra or a singer without a composer or a
  licence, and its score says where each cue came from.
