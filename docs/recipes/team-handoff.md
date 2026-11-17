---
title: Pick up where your collaborator left off
description: "Hand an episode to a second person: its text through Git, its media restored by hash from S3-compatible storage, and a check on the other machine that both match."
---
# Pick up where your collaborator left off

**You end with:** the same episode on a second machine: the same scripts,
timelines and records from Git, the same media restored and verified against
its hashes, and a note saying what is decided and what is not.

## Ingredients

- %product% installed on both machines, at the same version.
- The channel as its own Git repository, reachable by both people
  ([build a channel](./build-a-channel)).
- An S3-compatible bucket, and credentials in the standard AWS chain. Never
  in the repository.
- An agreed scope: which episode, which branch, who reviews.

**Costs:** your Git and storage hosting, and the transfer. A handoff
generates nothing and makes no paid API calls.

## 1. Write what the files do not say

A complete restore still leaves the next person wondering why the film looks
as it does. Ask the agent for the inventory, and write the rest yourself:

```text
Prepare the episode my-series/ep001 for a collaborator without changing it.
List its source files, the release it is pinned to, its selected takes and
its current delivery. List media that is missing, changed or not in the
lock, and any review that has gone stale.
Do not push, upload, regenerate or approve anything.
```

Add, in your own words: the direction you chose and one you rejected, the
render a person actually reviewed, the open notes, and one bounded next task.

## 2. On your machine

Refresh the lock, look at what would be sent, then send it:

```bash
node studio/runtime/dist/src/cli.js channel media my-channel --library "$PWD/library"

node studio/runtime/dist/src/cli.js channel media push my-channel \
  --episode my-series/ep001 --tier all --dry-run --library "$PWD/library"

node studio/runtime/dist/src/cli.js channel media push my-channel \
  --episode my-series/ep001 --tier all --library "$PWD/library"
```

The dry run verifies the local selection and checks the remote without
transferring. `--tier all` includes derived media and deliveries; it can be
large, so read the counts and the bytes. Then commit and push the text,
`media.remote.json` and `media.lock.jsonl` with Git as usual.

## 3. On theirs

```bash
git clone "$CHANNEL_GIT_URL" library/my-channel

node studio/runtime/dist/src/cli.js channel media pull my-channel \
  --episode my-series/ep001 --tier all --dry-run --library "$PWD/library"

node studio/runtime/dist/src/cli.js channel media pull my-channel \
  --episode my-series/ep001 --tier all --library "$PWD/library"

node studio/runtime/dist/src/cli.js channel media my-channel \
  --check --episode my-series/ep001 --verify --library "$PWD/library"
```

Every download is checked against its SHA-256 and its size before it is put
in place. A file that already exists and differs is kept and reported, not
overwritten.

## 4. Rehearse before you need it

Do the restore once into an empty directory on your own machine. A handoff
that has only ever been pushed has not been tested.

## What it is not

- **Not simultaneous editing.** It is branches and explicit handoffs. Stage
  leases do not lock anything between two clones.
- **Not an approval.** A successful transfer approves no script, take or
  render. Approvals are signed with the operator's key, shared separately
  and only with people entitled to approve; it is one key, not one per
  person.
- **Not a guarantee of the same pixels.** Different software or hardware can
  render differently. Align versions, then look.

## Where it goes wrong

- **Media the lock never saw.** A file added after the last refresh stays on
  your machine. Refresh the lock before the push.
- **An episode that uses shared material.** Episode scope does not find
  every reference inside a spec or a pinned source. Pull a wider scope when
  the episode leans on the channel's sources.
- **Two versions of one path.** After a merge the lock can name both. The
  transfer reports it and does not choose for you.
- **Credentials in a shared note.** Do not ask the agent to paste them
  anywhere.

## Next

[Collaboration](../collaboration) explains the design.
[Change the line. Keep the film.](./revise-with-confidence) is usually the
first thing the second person is asked to do.
