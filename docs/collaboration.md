---
title: "Collaboration, Git and S3"
description: "Share a Video Studio channel through Git, version its creative files, and restore its media from S3-compatible storage with hash verification."
---
# A production your team can pick up.

Video Studio is not tied to one person’s laptop or one agent conversation. **A channel can be its own Git repository.** Its scripts, specifications, templates and production records travel with it. Large media live outside Git, identified by hash and optionally shared through an S3-compatible remote.

A collaborator gets the history **and** a way to restore the actual material—not a folder of screenshots and a request to reconstruct the edit.

## Three parts, one shared project

| Layer | What belongs there | What it gives the team |
|---|---|---|
| **Git repository** | Editorial text, scripts, specs, timelines, settings, template releases, reports and journals | Commits, diffs, branches, reviews and merges with ordinary Git |
| **`media.lock.jsonl`** | Channel-relative media paths, SHA-256 hashes, sizes and relative symlink targets | The exact media versions associated with a revision of the work |
| **S3-compatible storage** | Images, recordings, generated clips, fonts, Blender files and selected deliveries | Restore the bytes without putting heavy binaries in Git |

The application repository and a channel repository are separate. Updating Video Studio should not turn a collaborator’s editorial work into an application-code change.

## Version the decisions, not just the final MP4

A script revision is a text diff. A new episode spec carries a revision. Sealed template, theme and kit releases are immutable: change the format by making a new release, not by rewriting an old one.

For a binary file, the lock records its identity. Change the bytes and you get a different hash. When those versions have been uploaded, an earlier Git revision of the lock can identify the older media too. Use a separate checkout with fresh media paths to restore an old state: a media pull will not overwrite a locally changed file.

Production attempts and deliveries are also retained as distinct candidates. The current render is named by `output/current.json`, not whichever file happens to be called “final”.

**Git history is not the same as media backup.** A lock can identify lost media, but a hash cannot recreate it. Upload the selected bytes before relying on another machine to recover them.

## Start sharing an existing channel

Install the [studio workspace](./quick-start) on each machine. The commands below assume an existing channel called `my-channel`; replace it with your channel’s slug. Run from the application repository root.

### 1. Initialise the channel’s Git repository

```bash
node studio/runtime/dist/src/cli.js channel init my-channel \
  --library "$PWD/library"

node studio/runtime/dist/src/cli.js channel media my-channel \
  --library "$PWD/library"

git -C library/my-channel status --short
```

Initialisation writes media-aware ignore rules and union-merge rules for the journal and lock. Existing Git files are preserved; read any warnings about media that an existing ignore file would allow into Git.

Stage and inspect the intended editorial changes, including the lock. Do not stage credentials, private recordings you did not intend to share, or heavy binaries. Use your normal Git remote, branch and review process; the studio does not replace Git.

### 2. Choose a media remote

Create `library/my-channel/media.remote.json`. This is a configuration example, not a provisioned bucket:

```json
{
  "apiVersion": "studio.video/v1alpha1",
  "kind": "MediaRemote",
  "url": "s3://your-media-bucket/my-channel/",
  "region": "us-east-1",
  "keep": ["paid", "approved", "archive", "masters", "other"]
}
```

Create the bucket and grant access through your storage provider. For a non-AWS service, add its supported `endpoint` and region as described in the [media-remote contract](./workspace#media-remote).

Keep this file in Git. **Keep credentials out of it.** The transfer tools use the standard AWS credential chain: an existing `AWS_PROFILE`, environment variables or another supported credential source. Read-only collaborators can receive read-only storage access; writers need upload and multipart-abort permissions too.

Choose and test your service deliberately. The transfer implementation has automated S3-fake tests; that is not certification of every storage product or a guarantee that your remote has been backed up.

### 3. Upload the media you intend to share

After creating or changing assets, refresh the lock. Preview selection before transferring:

```bash
node studio/runtime/dist/src/cli.js channel media my-channel \
  --library "$PWD/library"

node studio/runtime/dist/src/cli.js channel media push my-channel \
  --episode my-series/ep001 --tier all --dry-run --library "$PWD/library"

node studio/runtime/dist/src/cli.js channel media push my-channel \
  --episode my-series/ep001 --tier all --library "$PWD/library"
```

`--tier all` is explicit here so the handoff includes the selected episode’s derived media and deliveries too. This may be large: inspect the dry-run counts and bytes.

The default policy is more selective: it excludes deliveries and explicitly classified derived media. Tier names are storage-policy labels, not proof of licence or operator approval. Configure your own [selection rules](./workspace#media-remote).

A dry run verifies local selection and performs remote HEAD checks, but does not upload or download media. Storage requests and transfers are subject to your provider’s charges.

Commit and push the editorial changes, `media.remote.json` and `media.lock.jsonl` using normal Git once the required media is available.

### 4. Restore on the collaborator’s machine

Set `CHANNEL_GIT_URL` to your channel repository’s actual clone URL:

```bash
git clone "$CHANNEL_GIT_URL" library/my-channel

node studio/runtime/dist/src/cli.js channel media pull my-channel \
  --episode my-series/ep001 --tier all --dry-run --library "$PWD/library"

node studio/runtime/dist/src/cli.js channel media pull my-channel \
  --episode my-series/ep001 --tier all --library "$PWD/library"

node studio/runtime/dist/src/cli.js channel media my-channel \
  --check --episode my-series/ep001 --verify --library "$PWD/library"
```

Downloads are checked against SHA-256 and size before publication. Existing changed files are preserved and reported, not overwritten.

Episode scope includes locked symlink targets. It does **not** discover every arbitrary reference inside a spec or source pin; pull a broader scope when the episode uses other shared material.

### 5. Review, work and hand back

Agree who is editing which episode or branch. Make a bounded change, retain previous takes, update the lock for new media, upload the new objects, and commit the editorial diff. The next person pulls both the text and any missing media, then verifies before continuing.

[Follow the team-handoff recipe →](./recipes/team-handoff)

## What makes restoration dependable?

- **Content-addressed objects:** S3 paths are based on SHA-256, not mutable filenames. Identical bytes share an object within the same bucket/prefix.
- **Verified transfers:** uploads use a verified snapshot; downloads are checked before being placed into the channel.
- **Local work is preserved:** a changed destination is not overwritten during a pull.
- **Missing is not forgotten:** refreshing the lock retains entries absent on this machine. Only deliberate pruning forgets them.
- **Conflicts stay visible:** a merged lock can name two versions of one path. Remote transfers report that ambiguity rather than choosing a version for you.
- **Reruns resume at file/object level:** completed objects are reused. An interrupted multipart file may need to start again.

A media restore does not by itself guarantee an identical render on different software or hardware. Align the studio version, providers and dependencies, and inspect the result.

## Human review still matters

A successful transfer does not approve a script, take or render. Reviews remain bound to the material they cover.

Today, trusted operators verify each other’s signed approvals using the same **operator HMAC key**, distributed separately and securely—not committed to Git or stored in the media bucket. This is not a per-person signing system. Give it only to people entitled to approve; see [operator-key behaviour](./running#the-operator-key).

## Collaboration, without pretending it is something else

This is a **file-based, versioned collaboration workflow**, not a hosted real-time co-editing service. Use Git branches and explicit handoffs. Runtime stage leases do not provide distributed locking between disconnected clones.

You manage repository access, storage credentials and review authority. Nothing here creates accounts, provisions a bucket or pushes a channel on your behalf.

For implementation details: [channel repositories](./adr/0045-a-channel-is-its-own-repository), [S3 media design](./adr/0049-channel-media-use-a-content-addressed-s3-remote) and [backup/restore operations](./running#channel-media-backup-and-restore).
