---
title: Retake
description: "Retake is a benchmark for what happens after the first take of an agent-made video. It is a specification: it has not been run and has no results."
---
# Retake

**Anyone can get a first take. This measures the second.**

A benchmark for systems that make video with an AI agent. It asks what the
others leave out: not how good the first video is, but what happens next —
when one sentence has to change, when a series needs its next episode, when
the money runs out.

::: warning No results
Retake is a specification, version 0.1. The tasks, the measures and the
thresholds are written down before anything is run, on purpose. The harness
that runs them does not exist yet. **Nothing on this page is a result.**
:::

## What is compared

Each arm is a way of working. Every arm gets the same model, the same machine,
the same tools on the path, the same provider keys and the same task text.

| Arm | What the agent has | What it isolates |
|---|---|---|
| `bare` | Claude Code and the tools on the path | the model on its own |
| `skills` | `bare`, plus the studio's skills as text, no tools | what the instructions are worth |
| `tools` | `skills`, plus the studio's tools, no pipeline, no gates | what the tools are worth |
| `studio` | the studio as shipped | what the production state is worth |
| `other` | another open harness, set up as its README says | the nearest alternative |

The first four are a ladder: they say which layer a difference comes from. If
`skills` does as well as `studio` on a task, the runtime added nothing there,
and the report will say so.

Five runs per cell. The spread is a result, not noise to hide.

## The tasks

All four are about one small program written for the purpose, whose every true
statement and every command's output is recorded and checked by a test.

| | Task | Asks | Headline measure |
|---|---|---|---|
| 01 | First take | explain the program in a 60–75 second narrated video | completion, accuracy, preference |
| 03 | Correction | replace one sentence of that video, change nothing else | share of the video that changed outside the sentence |
| 04 | Next episode | make episode 4 of a series that has three | closeness to the series, and its spread over five runs |
| 07 | Budget cap | illustrate four scenes without spending past the cap | metered spend, and what the agent did at the limit |

## The rules

1. **Written first.** A task, its measures and its thresholds are committed
   before the first run of that version. A change afterwards is a new version.
2. **Everything is published.** Every run's output, transcript and bill,
   including the failures and the ones the studio loses.
3. **Anyone can run it.** A result that cannot be reproduced from the
   repository is not a result.
4. **The other side checks its own set-up.** The configuration of the `other`
   arm goes to that project's maintainers before publication.
5. **A person is counted.** Every question an arm asks its operator is
   counted and reported.
6. **No tuning to the task.** No arm's skills or prompts may name the program,
   the tasks or their wording.

## What would count against the studio

Stated in advance:

- On 01, the bare large model is preferred as often as the studio. Then the
  studio is not for single videos, and says so.
- On 03, the studio changes more than 1% of the video outside the sentence,
  or no less than the bare model. Then targeted correction is not delivered.
- On 04, the studio's spread is not clearly smaller than the bare model's.
  Then a pinned format is not enough to hold a series.
- On 07, the studio spends past the cap in any run. Then the ledger has a hole.
- On any task, `skills` matches `studio`. Then the value is in the text.

## Not settled

- The harness that starts an arm in a clean environment and collects its
  output, transcript and bill.
- The three reference episodes of task 04, which have to be made once,
  reviewed by a person and frozen.
- The metered stand-in provider of task 07.
- The noise floors of task 03, provisional until the same timeline has been
  rendered twice on the bench machine and the difference measured.
- The judges: how many reviewers, how they are found, and the rubric of the
  automatic judge.

The specification, its tasks and its measures are in `bench/retake` in the
[application's repository](https://github.com/phoebus-84/video-studio), from
release 0.2.0.
