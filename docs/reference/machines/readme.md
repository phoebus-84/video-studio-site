> Imported studio reference, based on [1e25f11](https://github.com/phoebus-84/sergio/tree/1e25f1100ca4d1e88bae62681ef004b70c4f9b44). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# machines

The operator's machines, declared once (ADR-0056). The package says which
machines exist, how SSH reaches each, what each is for, and in which order to
use them. It answers two questions:

- **Where do I run role X?** `place(machines, role, probe)` gives the first
  place in the preference order that answers, `"local"` included, and the
  reasons it passed over the others.
- **How do I reach service Y?** `reachService(machines, "comfyui", { healthy })`
  gives a base URL. That is the role's `url`, or a tunnel to a server that
  listens only on the machine's loopback.

It knows nothing about episodes, pipelines or the studio. The caller names the
file and reads no environment for it.

## The file

```json
{
  "machines": {
    "gpu-box": {
      "ssh": "gpu-box",
      "note": "32 cores, a GPU",
      "roles": {
        "remotion":  { "repo": "~/sergio", "cache": "~/.cache/sergio/render" },
        "blender":   { "bin": "~/opt/blender-5.2.1-linux-x64/blender", "gpuLock": "~/ai/generation.lock" },
        "comfyui":   { "port": 8188, "gpuLock": "~/ai/generation.lock" },
        "heavy-cpu": {},
        "heavy-gpu": { "gpuLock": "~/ai/generation.lock" }
      }
    }
  },
  "prefer": { "blender": ["gpu-box", "local"], "comfyui": ["gpu-box"] }
}
```

| Field | Meaning |
|---|---|
| `ssh` | What `ssh` connects to: an alias of `~/.ssh/config`, or `[user@]host`. No options: they go in the SSH config. |
| `note` | Free text, shown in reports. |
| `roles.remotion` | `repo`, `cache`, `speed`: render-worker's settings for this engine. |
| `roles.blender` | `bin` (required), `repo`, `cache`, `gpuLock`. |
| `roles.comfyui` | `port` (default 8188) and `host` (default `127.0.0.1`) on the machine, reached by a tunnel. Or `url`, reached directly. Also `gpuLock`. |
| `roles.heavy-cpu`, `roles.heavy-gpu` | Declared for reports; `gpuLock` on `heavy-gpu`. |
| `prefer.<role>` | Machine names and `"local"`, tried in order. Without it, a process role (`remotion`, `blender`, `heavy-*`) runs here. A service role (`comfyui`) is looked for on its machines, in the file's order. |

`readMachines(file)` returns no machines when the file is missing. With
`{ required: true }`, for a file the operator named explicitly, a missing file
is an error. `parseMachines` reports every problem at once, each with its path
(`machines.gpu-box.roles.blender.bin: required`). It refuses any field it does
not know, so a secret pasted in by mistake is not kept. Keys starting with `$`
are comments.

## Tunnels

`openTunnel(spec, { healthy })` runs this command on a free port:

```
ssh -N -o BatchMode=yes -o ExitOnForwardFailure=yes -L 127.0.0.1:<port>:<host>:<port> <ssh>
```

It then calls `healthy(baseUrl)` until the service answers, for 20 s by
default. If ssh exits first, it fails with `tunnel-failed` and the reason ssh
gave. A `TunnelPool` keeps one tunnel per service, reuses it while its ssh
lives and the service answers, and reopens it otherwise. A tunnel is killed
when the process exits. `tunnels` is the pool a process shares.

## GPU lock

`withLock(exec, ssh, path, work)` holds `flock -x -w <seconds> <path>` on the
machine, in an SSH session that lasts as long as `work`. Closing the session
releases it, so a crash cannot leave it held. It waits 15 minutes by default,
then fails with `lock-failed`. It protects anything only if the machine's other
GPU jobs take the same lock with `flock`.

## Probe

`probeMachine(exec, machine)` runs one SSH command and reports:

- whether the machine answers;
- `uname -sm`;
- its cores;
- the first line of `<bin> --version` for a `blender` role.

An unreachable machine is a result, not an exception.

## SSH

`sshExec()` runs one command on a machine: stdin streamed, stdout collected or
streamed to a file, stderr handed over line by line. The ssh program is
`AVG_RENDER_SSH`, else `ssh` on `PATH`. Everything else takes an `Exec`, so tests
run the other machine in-process (`test/helpers.ts` runs it in a local `sh`, so
`flock` is real). render-worker re-exports this transport.

## Errors

`MachineError` with a `code`:

| Code | Meaning |
|---|---|
| `ssh-unavailable` | The ssh program could not run. |
| `bad-machines-file` | The file is missing (when required), not JSON, or invalid. |
| `no-machine` | No place for the role answered. |
| `tunnel-failed` | The tunnel could not be opened, or the service did not answer through it. |
| `lock-failed` | The GPU lock could not be taken. |
