---
title: Explain the software, not the hype
description: "Make a narrated explainer of a repository whose every command and claim is checked against one pinned commit, and that can be made again when the software changes."
---
# Explain the software, not the hype

**You end with:** a narrated video of a few minutes about one repository, a
script whose claims are tied to a commit, terminal scenes recorded from real
commands, and an episode on disk that can be made again when the code moves.

<RecipeFilm id="jaromail" />

That film uses its channel's own format: pixel characters, a big terminal,
graphics keyed to the words. The studio ships no such format. What this recipe
gives you is the built-in route, which is plainer.

## Ingredients

- %product% installed, `npm run doctor` clean, and an agent connected
  ([quick start](../quick-start)).
- The gateway running: the pipeline tools need it
  ([running the agent](../running)).
- A repository the agent can read, and the commit you want explained.
- [VHS](https://github.com/charmbracelet/vhs) for terminal scenes, and a
  speech capability that `npm run doctor` reports ready.
- A viewer in mind: who watches, and what they should be able to do after.

**Costs:** the agent's own model usage. Terminal scenes, diagrams, local
speech and the render cost nothing beyond your machine. Generated
illustrations are optional and metered: set a budget first.

## 1. Set the budget before anything can spend

In the channel's or the series' `settings.yaml`:

```yaml
budget:
  currency: USD
  limitMicros: 2000000   # $2.00
```

A paid call reserves its cost in the episode's journal before it is made, and
is refused if it would pass the limit. `pva_budget_status` shows where the
episode stands. Terminal scenes, diagrams, local speech and the render
reserve nothing.

## 2. Ask for the episode

```text
Make a three-minute English explainer of https://github.com/OWNER/REPO
for someone who has never used it. Pin the commit you research.
Explain one workflow a newcomer would actually run.
Check every command and every claim against that commit.
Use example.org addresses and no real accounts or credentials.
Prefer terminal scenes and diagrams to generated images,
and tell me before any paid call.
Show me the script and the scene list before any narration.
```

In Pi, `/video create <channel>/<series>/<episode>` creates the episode first;
in Claude Code the same command is `/mcp__pva__video`, in Gemini CLI `/video`.
In Codex, Cursor or VS Code, which show no MCP prompts, ask for it in words:
“create the episode `<channel>/<series>/<episode>`”.

## 3. What the agent does, and where you look

| Stage | The agent uses | You read |
|---|---|---|
| Research | the `repo-analysis` skill, on the pinned commit | the analysis: what the tool is, its commands, what it could not verify |
| Plan | `content-plan`: one episode or several from that analysis | which episode to make first |
| Script | `write-brief`, `write-script` | every sentence, and the commit it stands on |
| Terminal | `vhs-terminal-recording`, `pva_render_terminal` | the recordings: real commands, in a disposable directory |
| Diagrams | `pva_render_graphics` | each diagram at delivery size |
| Voice | `narration`, `pva_synthesize_speech`, then `pva_verify_take` | the verification: words missing, extra or heard differently |
| Timing | `pva_align_take`, `pva_build_timeline` | nothing yet |
| Layout | `pva_layout_sheet` | `artifacts/layout-sheet/sheet.jpg`: stills of the film before a render is spent |
| Render | `pva_compose_video` | the film, and its audit |

The built-in pipeline for the research is `repository-documentation`
(analysis, content plan, architecture diagram); the episode itself runs
`narrated-illustrated-video` (brief, script, art direction, terminal
recordings, illustrations, narration, captions, timing, compose, QA). Stages
marked for human review stop and wait:
the agent asks with `pva_request_approval` and cannot approve for you.

## 4. Read the script like a maintainer

This is the step that decides whether the film is worth making. For each
sentence that states a fact about the software, ask where it comes from. A
good script keeps that answer beside the sentence: the file and the line at
the pinned commit. Strike what cannot be traced.

Run the commands yourself, in the order the script gives them. A terminal
scene is recorded from a tape of commands; if a command needs a network, an
account or a file that is not in the demonstration directory, the recording
will show its failure faithfully.

## Where it goes wrong

- **The agent explains the README, not the tool.** READMEs lag. Ask which
  claims were checked against code and which only against documentation.
- **Terminal text too small.** Judge it on the layout sheet at the size the
  viewer will see, not in the recording.
- **A name said wrong.** Synthesised speech guesses at `msmtp` or `kubectl`.
  `pva_verify_take` catches a different word, not a strange stress: listen to
  every tool name once.
- **Private data in the recording.** Real paths, tokens and addresses end up
  on screen when the demonstration runs in your home directory. Use a
  disposable directory and fictional data, and look before you render.
- **No gateway.** The pipeline tools fail without it; everything else works.

## When the software changes

Move the pinned commit, ask the agent what in the script no longer holds, and
correct those sentences. The stages downstream of the script go stale; the
rest stays. [Change the line. Keep the film.](./revise-with-confidence)

If you will explain a tool a month, make the look and the pacing a
[format](./repeatable-series), and give it a [cast](./create-a-character).
