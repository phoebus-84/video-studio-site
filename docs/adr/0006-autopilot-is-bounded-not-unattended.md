> Imported studio reference, based on [e2796c5](https://github.com/phoebus-84/video-studio/tree/e2796c57f66a019df41574d69bba41eb358e4e65). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Autopilot is bounded, not unattended

## Status

Accepted. Its enforcement is partial: see the [harness review](https://github.com/phoebus-84/video-studio/blob/e2796c57f66a019df41574d69bba41eb358e4e65/docs/harness-review.md).

## Decision

The system supports autopilot, guided, and manual approval policies, with autopilot providing the intended one-prompt path by recording checkpoints without pausing. Autopilot still stops at budget boundaries, material downgrades, missing capabilities, validation failures, edit conflicts, and policy blockers; this preserves independent production without interpreting autonomy as permission to overspend or silently violate the approved deliverable.
