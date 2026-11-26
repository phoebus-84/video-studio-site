> Imported studio reference, based on [3dee4dc](https://github.com/phoebus-84/sergio/tree/3dee4dc69199ab145af8d2c35d72328c9d70dd37). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# @av/comfyui

A ComfyUI server's HTTP API, and workflows kept as API-format templates with
named placeholders. It knows no model: what a graph does is the template's
business, and which server runs it is the caller's.

```ts
import { createComfyUiClient, fillWorkflow, readTemplateFile } from "@av/comfyui";

const client = createComfyUiClient({ baseUrl: "http://127.0.0.1:8188" }); // the caller's address; none is built in
const template = readTemplateFile(new URL("./my-graph.json", import.meta.url));
const promptId = await client.queuePrompt(fillWorkflow(template, { prompt: "a lighthouse at dusk", seed: 7 }));
const { outputs } = await client.waitForPrompt(promptId);
```

## The client

`queuePrompt` (`POST /prompt`), `waitForPrompt` (polls `GET /history/<id>`),
`uploadInput` (`POST /upload/image`, which takes audio and video too),
`download` (`GET /view`), `nodeInfo` (`GET /object_info/<class>`),
`systemStats`, `dequeue`. A refused graph reports the server's own words,
node by node; a graph that raised reports the node and its exception. Errors
are `ComfyUiError` with a `code` to branch on: `not-configured`,
`unreachable`, `bad-request`, `missing-node`, `failed`, `timeout`, `aborted`,
`no-output`, `server`.

A server that listens only on its own loopback is reached through a tunnel
the caller opens (in the studio, `@av/machines` opens it from the library's
machines file); the client just sees a URL.

## Templates

An API-format graph (ComfyUI: *Export (API)*) in which a string value that is
exactly `"{{name}}"` is replaced by the value of that name, keeping the
value's type. A missing value and a value no placeholder asks for are both
errors. `optionalNodes` names nodes left out when their value is absent (and
drops the inputs of other nodes that read them, which must be optional
inputs); `bypassNodes` names nodes passed through unless their flag is true.

`fillWorkflow`, `placeholdersOf`, `nodeClassesOf`, `readTemplateFile`.

## Declared workflows

A template that says what it takes and what it makes, so that a caller who
has never seen the graph can run it:

```json
{
  "description": "Text to image with Z-Image Turbo.",
  "kind": "image",
  "inputs": {
    "prompt": { "type": "text" },
    "width":  { "type": "integer", "default": 1024, "min": 256, "max": 2048 },
    "seed":   { "type": "seed" },
    "start":  { "type": "image", "optional": true },
    "vae":    { "type": "model", "default": "ae.safetensors" }
  },
  "outputs": { "9": "image" },
  "requires": {
    "models": [{ "node": "17", "input": "vae_name", "folder": "vae" }]
  },
  "prompt": { "…": "the API-format graph, with {{prompt}}, {{width}}, {{seed}}, {{start}}, {{vae}}, {{outputPrefix}}" },
  "optionalNodes": { "start": "2" }
}
```

- **kind**: `image`, `image-edit`, `video`, `speech`, `music`, `audio`, `other`.
- **inputs**, one per placeholder: `text`, `string`, `integer`, `number`,
  `boolean`, `choice` (with `options`), `seed` (picked at random when absent,
  and returned), `model` (a file a loader reads), or a file: `image`,
  `audio`, `video`, uploaded to the server's input folder under its
  content's hash, its name filled in.
- **outputs**: node id → `image`, `video` or `audio`. Every file the node
  saved is downloaded, whatever key the server lists it under.
- **requires**: `models` names a loader node's input; the file is the value
  it holds and the probe checks the loader lists it. Every server names its
  files its own way, so make that value a `model` input with a default: a
  caller, or `withDefaults(workflow, { vae: "z_image_ae.safetensors" })`,
  names another file without a copy of the workflow (a file named in the
  graph itself is a warning). `nodes` adds classes beyond the graph's own,
  `packs` says which custom node packs provide them. Nothing is downloaded.
- **verifiedOn**: when and where it last ran on a real server; absent, never.
- `{{outputPrefix}}` is the runner's: each run saves under a folder of its own.

`checkWorkflow` lists what is wrong (the UI format instead of the API one, a
placeholder not declared, an input nothing reads, an output that is not in
the graph). `listWorkflows(folders)` reads the built-in workflows and then
each folder's, a later one hiding an earlier one of the same name and saying
so.

`probeWorkflow(client, workflow)` reads `/object_info/<class>` for every class
the graph needs: whether the server has it, whether the graph gives it every
input this server's version requires (a node gains required inputs between
versions), and whether each loader lists the model file — and if not, the
files it does list. All before anything is queued. `runWorkflow({ client, workflow, values })`
checks the values, probes, uploads, queues, waits and downloads; the result
has the graph as queued, every value filled in, the seeds, the uploads by
hash, each output's bytes, the server's version and devices, and how long the
server says it ran (`executionSeconds`, from its own timestamps).

## Built-in workflows

Core ComfyUI nodes only. Each model is a `model` input; its default is the
file as the first server they ran on names it — give another where yours
differs. `verifiedOn` says which have run on a real server.

| Workflow | Kind | Model inputs and their defaults | Run on a server |
|---|---|---|---|
| `z-image-turbo` | text to image | `unetModel` `z_image_turbo_bf16`, `textEncoder` `qwen_3_4b`, `vae` `z_image_ae` | yes, ComfyUI 0.45.0 on an RX 7900 XTX (ROCm) |
| `flux2-klein-edit` | image edit | `unetModel` `flux-2-klein-4b`, `textEncoder` `qwen_3_4b`, `vae` `flux2-vae` | yes, ComfyUI 0.45.0 on an RX 7900 XTX (ROCm) |
| `wan22-ti2v-5b` | text or first frame to video | `unetModel` `wan2.2_ti2v_5B_fp16`, `textEncoder` `umt5_xxl_fp16`, `vae` `wan2.2_vae` | yes, ComfyUI 0.45.0 on an RX 7900 XTX (ROCm), with and without a first frame |
| `ace-step-v1-music` | music from tags and lyrics, ACE-Step **v1** | `checkpoint` `ace_step_v1_3.5b` | not yet |

(All `.safetensors`.) ACE-Step 1.5 has other nodes (`TextEncodeAceStepAudio1.5`,
`EmptyAceStep1.5LatentAudio`): it needs a workflow of its own, not a file
name.

## Adding a workflow

1. Build and run the graph in ComfyUI.
2. Export it in API format (*Workflow → Export (API)*; older versions need
   *Dev mode* on in the settings).
3. Replace each value a caller should set with `"{{name}}"` — the whole
   string, so a number stays a number — and every output node's
   `filename_prefix` with `"{{outputPrefix}}"`.
4. Wrap the graph: `description`, `kind`, `inputs`, `outputs`, `requires`
   (above), the graph under `prompt`.
5. `checkWorkflow` (or the studio's listing tool) says what does not fit.
