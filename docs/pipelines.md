> Imported studio reference, based on [1e25f11](https://github.com/phoebus-84/sergio/tree/1e25f1100ca4d1e88bae62681ef004b70c4f9b44). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Pipeline model

## Canonical manifests

Built-in manifests live in `studio/pipelines/pipelines/*.yaml`. They validate
against `studio/contracts/schemas/v1alpha1/pipeline-manifest.schema.json`, not a
second schema invented by a provider. For example:

```yaml
pipeline:
  id: a-scene-workflow
  version: "0.1.0"
  description: "Create an editable 3D scene"
  capabilities:
    - id: scene.create
      version: "1.0.0"
  stages:
    - id: build
      name: "Build Scene"
      type: capability
      capability: scene.create
      inputs: []
      outputs:
        - contract: scene-source.json
          version: "0.1.0"
      gates:
        autopilot: false
        review: human
        retry_on_failure: 1
      skills:
        - skill: blender-scene
          version: "0.1.0"
      depends_on: []
```

Editorial stages use `type: editorial` without a capability. Capabilities describe
what is requested, not which vendor/tool executes it. Versioned series overrides
must preserve a valid dependency graph and satisfiable input/output contracts;
see [ADR-0001](./adr/0001-series-pipelines-use-explicit-inheritance.md).

## Built-in workflows

| ID | Route |
|---|---|
| `narrated-illustrated-video` | Brief, script, art direction, terminal/illustration generation, narration, captions/timing, composition, QA |
| `fairy-tale-adaptation` | Tale ingestion, audience adaptation and reviews plus the narrated path |
| `repository-documentation` | Repository-grounded explanation plus the narrated path |
| `blender-animation` | Shot plan → editable scene → preview/artist handoff → animation → shot acceptance |
| `film-project`, `film-scene`, `film-shot` and their variants | A film at its three levels — see [the film families](#the-film-families) |

`blender-animation` is a **Pi-directed silent-shot workflow**. It does not require
fal, voice synthesis or VHS, and it does not add production handlers to the legacy
gateway executor. The source/preview/render JSON artifacts reference immutable
attempts and source hashes; their conventions are documented in `blender-scene`.
The final MP4 can be a standalone silent shot or a video clip in a mixed-media edit.

## Automation and human direction

The intended common flow is: frozen plan → prerequisite validation → lease →
capability/editorial work → validated candidate → review → accepted selection.
Autopilot, guided and manual should be policies over that same graph. Guided
Blender production uses shot-direction, preview and final acceptance gates;
an artist can Save As a native revision and render that file without rebuilding
it from the original script. Automated runs require an explicitly agreed plan
and budget; a script trust flag is not a human approval.

**Current limitation:** the CLI, the gateway and the agent's pipeline tools
share one execution service — leases, the journal, reviews and the spend
ledger — and the gateway performs the stages that have a `studio/adapters`
descriptor. The agent's pipeline tools reach that service only through the
gateway, so with no gateway running they fail. A declared gate holds a
stage's completion, not the production tools: `pva_generate_image` and the
other capability tools are bounded by the spend ledger, not by a gate. See the
[harness review](https://github.com/phoebus-84/sergio/blob/1e25f1100ca4d1e88bae62681ef004b70c4f9b44/docs/harness-review.md) before unattended execution.

## The film families

A film is produced at three levels, and each level runs a pipeline of its
own (ADR-0050). The families differ only in where they wait for a person.

| Level | ID | Stages | A person approves |
|---|---|---|---|
| film | `film-project` | development → screenplay → look and sound → breakdown → scenes · music → cut → render → final review | every creative stage and the final review |
| film | `film-project-auto` | the same | the final review only |
| scene | `film-scene` | direction → shots · sound → cut → render | the direction and the cut |
| scene | `film-scene-auto` | the same | nothing |
| shot | `film-shot` | plan → media → cut → render | the choice of take |
| shot | `film-shot-auto` | the same | nothing |
| shot | `film-shot-directed` | the same | the plan, the take and the cut |

The film's `scenes` stage and a scene's `shots` stage are where one level
runs the next: the agent runs each unit under it through that unit's own
pipeline and records the render each reached. `render` is the only
capability stage: `studio/adapters` performs it with the cut renderer, and it
renders first whatever under the unit is out of date.

When nothing declares otherwise a film runs `film-project`, a scene
`film-scene` and a shot `film-shot`. A unit's `pipeline.yaml` names its own
pipeline and may name the one the levels under it run; the nearest
declaration wins:

```yaml
# library/<film>/pipeline.yaml
pipeline: film-project-auto
scenes: film-scene-auto
shots: film-shot-auto        # every shot, unless its scene or the shot says otherwise
```

```yaml
# library/<film>/scenes/<scene>/pipeline.yaml — this one scene, by hand
pipeline: film-scene
shots: film-shot-directed
```

The browser studio sets these from each level's **Who decides** panel. A clip
or a track a person locked in a cut stays theirs whatever the pipeline.

## The series-production family

`series-production` (`studio/pipelines/pipelines/series-production.yaml`) is
one pipeline for every series with a template (ADR-0037): the compiler and the
validator are the ones the episode's pinned release names, never the
pipeline's.

| Stage | Performed by | Gate |
|---|---|---|
| `spec` → `episode-spec.json` | Pi: `pva_init_spec`, then the `fill-episode-spec` skill | human |
| `pictures` → `images/` | the person or Pi: every picture the spec names, in `assets/images` | human |
| `takes` → `takes.json` | the person or Pi: the narration takes and their word timing | human |
| `timeline` → `edit-timeline.json` | adapter `series-timeline` (the release's compiler) | — |
| `check` → `series-check.json` | adapter `series-check` (the release's validator); errors fail it | human |
| `sheet` → `layout-sheet.json` | adapter `series-sheet` (Remotion): stills at the series' instants and a labelled grid; the `review-layout-sheet` skill | human |
| `render` → `output.mp4` | adapter `series-render` (`video.compose`, Remotion); refuses a missing or stale sheet. The person's approval of the `sheet` stage at its gate is the sheet's review here; outside the pipeline a render needs `vpr sheet approve` (avg-3th.2) | human |

A series extends it and replaces stages by id (ADR-0001). The example
`studio/pipelines/fixtures/valid/series-local/poetry-short.yaml` keeps every
stage and replaces `takes` with the poem's recital:

```yaml
pipeline:
  id: poetry-short
  version: "1.0.0"
  extends:
    pipeline: series-production
    version: "1.1.0"
  stages:
    - id: takes
      name: "Recital Take"
      # same contracts as the base stage; the poem's own instructions
```

Stages that depend on unfinished work arrive as new versions of the base:
take synthesis, alignment and verification (`avg-8hs.*`) turn `takes` into
capability stages; the render audit (`avg-3th.3`) and the delivery package
(`avg-3th.5`) follow `render`. Version 1.1.0 added the layout sheet
(`avg-3th.1`) between `check` and `render`; an episode resolved on 1.0.0 keeps
its snapshot.

## Adding a workflow

1. Reuse provider-neutral capabilities and typed media outputs.
2. Declare stage inputs/outputs, dependencies, skills and gates explicitly.
3. Avoid requiring irrelevant capabilities for every shot; optional input files
   alone do not make a stage optional.
4. Use a typed video timeline for mixed clips; never reduce Blender animation to
   an image-concat input.
5. Validate manifests and test a real user route through the agent, not just the
   package API.

```bash
npm run check:pipelines
```

The [capability checklist](./contributing.md) covers installation, registration,
skills, diagnostics, tests and documentation.
