> Imported studio reference, based on [aea888a](https://github.com/phoebus-84/video-studio/tree/aea888a3b007ec8530cf98fb3abdb2f8dc6e9f63). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Autopilot is bounded, not unattended

## Status

Accepted. Its enforcement is partial: see the [harness review](https://github.com/phoebus-84/video-studio/blob/aea888a3b007ec8530cf98fb3abdb2f8dc6e9f63/docs/harness-review.md).

## Decision

The system supports autopilot, guided, and manual approval policies, with autopilot providing the intended one-prompt path by recording checkpoints without pausing. Autopilot still stops at budget boundaries, material downgrades, missing capabilities, validation failures, edit conflicts, and policy blockers; this preserves independent production without interpreting autonomy as permission to overspend or silently violate the approved deliverable.
