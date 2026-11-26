> Imported studio reference, based on [1e25f11](https://github.com/phoebus-84/sergio/tree/1e25f1100ca4d1e88bae62681ef004b70c4f9b44). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# ADR-0056: The operator's machines are declared once, and the tools route by them

## Status

Accepted. Implemented:
- `library/.render/machines.json` (`AVG_MACHINES` names another file), read and checked by
  `@av/machines`, which also holds the SSH transport moved out of `@av/render-worker`;
- render-worker's host discovery, the ComfyUI speech tools (a tunnel opened on demand,
  the GPU lock held around each call), `pva_compose_video`'s default machine, and the
  reports of `pva_capability_status` and `pva_config`;
- the Blender tools on a `blender` machine (`pva_stage_shot`, `pva_rig_shot`,
  `pva_rig_sheet`, `pva_blender_render`), through render-worker's Blender jobs
  ([issue #121](https://github.com/phoebus-84/sergio/issues/121)).

## Context

An operator often has one strong machine besides the one the studio runs on: many
cores, a GPU, a ComfyUI server listening on its own loopback, a newer Blender in
their home folder than the system one. They reach it by an SSH alias. The studio
knew about that machine in one place only. render-worker reads
`render-hosts.json`, a handful of `AVG_RENDER_*` variables and the tailnet, and
renders Remotion timelines there. Everything else was either local or wired by
hand:

- `@av/blender` runs `BLENDER_BIN` on this machine. To use the other one, the
  agent copied the package there, installed it with whatever package manager was
  at hand, wrote its own runner scripts and fetched the videos back. The
  tools' checks and provenance were lost.
- `@av/comfyui-speech` sees only a URL. A server on the other machine's
  loopback needed an `ssh -N -L` tunnel the operator opened by hand, and the
  agent skipped the tool and ran Python there instead.
- GPU jobs on that machine shared a lock file by convention. No code knew of it.

So the operator told the agent in almost every session which machine to use and
how. That fact belongs in the library, read by the tools, so the agent never has
to be told and never has to improvise the transport.

## Decision

**One file says which machines exist, how each is reached, what each is for, and
in which order to use them. The tools consult it. The agent does not ssh by
hand.**

### The file

`library/.render/machines.json`, or the file `AVG_MACHINES` names. It sits
beside `render-hosts.json` and `comfyui.json`, in the library's dot folder. It
describes the operator's machines, not the code, so it is never committed. It
holds no secrets: SSH keys and passwords stay in `~/.ssh` and the agent, and the
loader refuses any field it does not know, so a key pasted in by mistake is
reported, not kept.

```json
{
  "machines": {
    "gpu-box": {
      "ssh": "gpu-box",
      "note": "32 cores, AMD GPU on ROCm",
      "roles": {
        "remotion":  { "repo": "~/sergio", "cache": "~/.cache/sergio/render" },
        "blender":   { "bin": "~/opt/blender-5.2.1-linux-x64/blender", "gpuLock": "~/ai/generation.lock" },
        "comfyui":   { "port": 8188, "gpuLock": "~/ai/generation.lock" },
        "heavy-cpu": {},
        "heavy-gpu": { "gpuLock": "~/ai/generation.lock" }
      }
    }
  },
  "prefer": {
    "blender": ["gpu-box", "local"],
    "comfyui": ["gpu-box"]
  }
}
```

- **`ssh`** is what `ssh` connects to: an alias resolved by `~/.ssh/config`, or
  `[user@]host`. Options are not accepted (no leading `-`, no spaces); they
  belong in the SSH config.
- **`roles`**: what a machine is for, each with its own settings. A machine
  without a role is never chosen.

  | Role | Settings |
  |---|---|
  | `remotion` | `repo` (the engine's clone, default `~/sergio`), `cache` (its render cache), `speed` (a fixed weight for shared renders) — render-worker's per-host settings |
  | `blender` | `bin` (the Blender to run there, required), `repo`, `cache` (as for `remotion`; default the same), `gpuLock` |
  | `comfyui` | `port` (on the machine, default 8188), `host` (the address it listens on there, default `127.0.0.1`), or `url` when this machine can reach the server directly; `gpuLock` |
  | `heavy-cpu`, `heavy-gpu` | `gpuLock` for `heavy-gpu`. Declared now so the agent and the reports know them; no tool routes by them yet |

- **`gpuLock`**: a path on that machine. A tool that runs work of that role there
  holds `flock(1)` on it for the duration (`flock -w <seconds> <path>` inside the
  SSH session; closing the session releases it, so a crash cannot leave it
  held). It means something only if the operator's own scripts take the same
  lock with `flock`.
- **`prefer`**: per role, the order in which places are tried. `"local"` is this
  machine and may appear anywhere in the list. The first that answers is used,
  and the ones skipped are reported with the reason. Without an entry, a role
  that runs as a process (`remotion`, `blender`, `heavy-*`) runs here, as
  before the file existed: declaring a machine never moves work by itself. A
  role that is a service (`comfyui`) is looked for on the machines that offer
  it, in the file's order.

### Who wins

Explicit beats implicit, and the new file beats the files it generalises:

| What | Order |
|---|---|
| Where a Remotion render runs | the tool's `host` / `hosts` › `prefer.remotion` › here |
| An engine's settings | its `remotion` role in `machines.json` › its entry in `render-hosts.json` › `AVG_RENDER_SSH_USER`, `AVG_RENDER_ENGINE_REPO`, `AVG_RENDER_ENGINE_CACHE` › `render-hosts.json`'s defaults › built-in defaults |
| `host: "auto"` | the `remotion` machines (in `prefer` order, then the file's) › the hosts of `render-hosts.json` › the tailnet's online Linux peers |
| The ComfyUI server | `AVG_COMFYUI_URL` › the `comfyui` machines (`url`, else a tunnel) › `url` in `comfyui.json` |
| ComfyUI's node settings | `comfyui.json`, unchanged |
| Where a Blender tool runs | the tool's `machine` › `prefer.blender` (the first whose Blender the tools take) › here |
| Blender here | `BLENDER_BIN` / the local search, unchanged |

An `AVG_MACHINES` that names a missing file is an error. A missing default file
means no machines. A file that does not validate is an error in every tool that
reads it, with the field's path, never silently ignored.

### The old files stay, as fallbacks

`render-hosts.json` and `comfyui.json` keep working, read after `machines.json`.
They are not migrated:

- each holds settings that are not about machines: `comfyui.json` holds the
  Qwen nodes' settings, `render-hosts.json` holds defaults for any tailnet peer
  that answers;
- an operator whose renders work today should not have to edit a file because
  the studio grew a better one, and a migration that rewrote library files
  would be a minor-version break for no gain to them;
- reading both costs one merge function, field by field, tested.

`pva_config` says which files were read, so an operator can see when an old one
still decides something. When `machines.json` covers everything, a later release
can deprecate the machine parts of the old files, with a message.

### Reaching a service on a machine's loopback

`@av/machines` opens `ssh -N -L 127.0.0.1:<free port>:<host>:<port> <ssh>`
with `ExitOnForwardFailure` and `BatchMode`. It asks the service's health check
(ComfyUI's `/system_stats`) until it answers, then hands back the local URL.
The tunnel is opened on the first call that needs it, reused while its `ssh`
lives, reopened if it died, and closed when the studio's process exits. No port
is fixed, so two studios on one machine do not collide.

### The package

`@av/machines` (`packages/machines`) knows nothing of episodes or the studio. It
holds:

- the SSH transport (`Exec`, `sshExec`, quoting), moved from render-worker,
  which re-exports it unchanged;
- loading and validating the file;
- *where to run role X*: the candidates in preference order, the first that
  answers a probe, and the reasons for the others;
- *how to reach service Y*: a direct URL or a health-checked tunnel;
- the GPU lock, and a probe that says whether a machine answers and what it is
  (`uname`, cores, the Blender version for a `blender` machine).

render-worker depends on it. It does not depend on render-worker, so a tool
that only needs a tunnel does not pull in Remotion.

### Settings that are scattered today

| Setting | Where now | Belongs in `machines.json` |
|---|---|---|
| Engines' address, user, clone, cache, speed | `render-hosts.json`, `AVG_RENDER_SSH_USER`, `AVG_RENDER_ENGINE_REPO`, `AVG_RENDER_ENGINE_CACHE` | **now** (`remotion` role); the old ones as fallbacks |
| ComfyUI's address | `AVG_COMFYUI_URL`, `comfyui.json` `url`, a hand-made tunnel | **now** (`comfyui` role); the variable stays an override |
| A remote Blender binary | told to the agent in chat | **now** (`blender` role) |
| A machine's GPU lock | convention | **now** (`gpuLock`) |
| ComfyUI's node settings (`model`, `device`, …) | `comfyui.json` | later, into the `comfyui` role |
| The voice worker | `AVG_TTS_WORKER_URL` | later, as a service role reached like ComfyUI |
| An engine's tuning: `AVG_RENDER_CONCURRENCY`, `AVG_RENDER_BROWSERS`, `AVG_CHROMIUM_GL` | the engine's `.engine/env.sh` | later, per machine, if the engine learns to take them per job |
| This machine's binaries: `BLENDER_BIN`, `FFMPEG_PATH`, `FFMPEG_BIN`, `FFPROBE_PATH`, `STRUDEL_CHROME_PATH` | environment | later, maybe, as a `local` entry; they describe this machine and the environment already does that well |
| The ssh and tailscale programs: `AVG_RENDER_SSH`, `AVG_TAILSCALE` | environment | no: properties of this machine's tools |
| Measured speeds | `render-speeds.json`, `AVG_RENDER_SPEEDS` | no: measurements, written by the studio, not configuration |
| The worker's own `QTW_*` | the worker's environment | no: the worker's configuration, on its machine |
| Secrets (`FAL_KEY`, `ELEVENLABS_API_KEY`, …) | environment (ADR-0030) | never |

### Remote Blender

`pva_stage_shot`, `pva_rig_shot`, `pva_rig_sheet` and `pva_blender_render`
run on the first place of `prefer.blender` that can: a machine that answers,
whose Blender (`<bin> --version`) is one the tools take, and whose clone answers
or can be brought to this commit; or `"local"`. Without `prefer.blender` they run
here. A tool's `machine` names the place instead, and a machine that cannot is
an error, not a reason to run elsewhere.

They use render-worker's transport, not a copied package:

- **Code.** The commit goes by git push to the engine's clone (the blender role's
  `repo`, else the remotion role's), and `engine.sh sync` installs it. A Blender
  job refuses uncommitted `packages/blender`, `render-worker` or `machines`; an
  uncommitted composer does not stop it.
- **Inputs.** The request's files (bodies, clips, a set, a `.blend`) are mirrored
  under the job's `files/` and sent once by content, as a render's assets are.
- **Files a `.blend` names.** The engine's Blender lists them
  (`bpy.utils.blend_paths`). Those in the channel or film, named relative to the
  `.blend`, are sent and asked about again; one outside is refused with its
  path, before Blender runs. The operator's `.blend` is never changed.
- **The run.** A `blender` engine command runs the same `@av/blender` function a
  local run calls, with the role's `bin`, holding its `gpuLock` with `flock`
  while Blender runs (waiting up to an hour). The engine never installs
  Blender.
- **Outputs.** The attempt's output directory comes back as a bundle, each file
  checked against the hash the engine reported, into the local directory a local
  run writes. A file that arrives wrong fails the job and leaves nothing.
- **Contract.** The tools get what the function returns, with this machine's
  paths. A rendered `.blend`'s manifest names this machine's files and keeps the
  engine's under `machine.paths`. The provenance of what a tool keeps gains
  `machine`: name, ssh destination, commit, Blender version, GPU lock, files and
  bytes sent.

The engine loads the Blender code only for Blender commands, so `version` and
`sync` still run on a clone whose dependencies the new commit has not
installed yet.

## Consequences

- The operator writes one file once. The agent reads where things run from
  `pva_capability_status` and never needs to be told an SSH alias.
- The skills say: the tools route by the machines file, and the agent does not
  copy code to a machine, open a tunnel or run scripts there by hand. With
  remote Blender there is no exception left: a shot is staged on the stronger
  machine through the tool, with its checks and provenance.
- A `.blend` that names files by absolute paths, or outside the channel or film,
  cannot travel. The operator makes its paths relative (File › External Data ›
  Make Paths Relative) or renders it here.
- A machine can be named in two old places and one new one. The order is fixed
  above and tested, and `pva_config` shows what was read.
- Declaring `heavy-cpu` and `heavy-gpu` before any tool routes by them is
  deliberate. The reports show them, and the next tools to move (separation,
  Qwen inference per ADR-0051) have a place to be told.
