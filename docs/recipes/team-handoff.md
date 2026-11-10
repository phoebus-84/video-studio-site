---
title: Pick up where your collaborator left off
description: Hand off a Video Studio episode with Git history, exact media versions and a verified restore from S3-compatible storage.
---
# Pick up where your collaborator left off

**Goal:** a second person opens the same production with its history, source material and explicit review state.

## Ingredients

- Video Studio installed on both machines.
- A channel Git repository that both people can access.
- A configured, tested S3-compatible media remote.
- Storage credentials with the appropriate read or write permissions.
- An agreed episode, branch and review responsibility.

**Costs:** your Git/storage hosting, storage requests and transfers, plus any subsequent agent or production work. No new media generation is required just to hand off a project.

## Agree on the handoff

```text
Prepare this episode for a collaborator, without changing its creative content.
Identify the source files, pinned releases, selected takes and current delivery.
List missing, changed or unlisted media and any stale reviews.
Do not push Git, upload media, regenerate assets or approve anything yet.
Give me a handoff checklist and the exact episode scope to transfer.
```

Do not ask the agent to paste credentials into a shared document.

## Hand over the intention, not just the latest file

A complete restore can still leave the next editor wondering why the film looks the way it does. Include a short creative handoff:

- The channel’s promise and the series standard.
- Which cast, room, voice or source pack is shared, and which version this episode uses.
- The selected direction, a few rejected alternatives and the reason for the choice.
- The candidate the operator actually reviewed, with unresolved notes.
- One bounded next task, its owner and the decisions that still belong to the operator.

Ask the agent to draft this from the project’s records, then correct it yourself. It must not infer approval from a filename such as “final” or from a technically successful render.

A useful next task might be: “Improve the lesson’s opening; keep the recital, poem reading and room assets unchanged.” That is much clearer than “finish the poetry episode”.

## Rehearse the receiving side

Before either person spends on production, have the receiving agent summarise what it found and what it proposes to do next. You are testing whether the saved channel instructions and source records make sense without the original conversation.

If a reference, voice permission or local dependency is missing, stop and resolve it. A new machine is a good test of the project’s preparation—not a reason to improvise replacements.

## On the source machine

1. Commit the intended editorial state on a named branch. Review the diff.
2. Refresh the channel’s media lock after new media is created.
3. Inspect the transfer’s dry run, including excluded tiers.
4. Upload the required bytes. For an all-files handoff, use `--tier all` or explicitly rebuild excluded derivatives on the destination.
5. Share the Git commit, episode reference and any manual setup notes.
6. Record what needs review; do not translate “uploaded” into “approved”.

The [collaboration guide](../collaboration#_3-upload-the-media-you-intend-to-share) has the exact CLI commands.

## On the receiving machine

1. Clone or pull the channel repository at the agreed revision.
2. Configure credentials outside the repository.
3. Preview and pull the selected media. Include shared sources when episode scope alone is insufficient.
4. Run the media check with `--verify`.
5. Inspect the latest source, takes, timeline, layout and current delivery.
6. Check the required providers and software before rendering.

A missing file is a request to restore or deliberately rebuild it, not permission to silently generate a replacement.

## Resolve conflicts deliberately

Text merges follow ordinary Git. The journal and media lock have union-merge rules, but a lock containing two hashes for the same path is still an editorial choice. Decide which bytes belong, then refresh the lock deliberately.

Do not delete a collaborator’s version to make a check turn green. A pull that reports locally changed media is preserving work.

## Acceptance check

- Both people can name the same Git commit and episode.
- Required media matches the lock; none is silently replaced.
- Shared template, theme and kit releases are available.
- Any unsigned, stale or unverifiable approval is understood.
- The old delivery remains available.
- The next editor knows the bounded change they own.

[How Git, the media lock and S3 fit together →](../collaboration)
