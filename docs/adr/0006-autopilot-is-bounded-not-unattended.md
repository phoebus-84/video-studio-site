> Imported studio reference, based on [e728acc](https://github.com/phoebus-84/video-studio/tree/e728accfa468a736558b34b8032bcacfee52218b). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Autopilot is bounded, not unattended

## Status

Accepted. Its enforcement is partial: see the [harness review](https://github.com/phoebus-84/video-studio/blob/e728accfa468a736558b34b8032bcacfee52218b/docs/harness-review.md).

## Decision

The system supports autopilot, guided, and manual approval policies, with autopilot providing the intended one-prompt path by recording checkpoints without pausing. Autopilot still stops at budget boundaries, material downgrades, missing capabilities, validation failures, edit conflicts, and policy blockers; this preserves independent production without interpreting autonomy as permission to overspend or silently violate the approved deliverable.
