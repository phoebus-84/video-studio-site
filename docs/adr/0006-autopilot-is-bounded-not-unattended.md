> Imported studio reference, based on [bfea2f8](https://github.com/phoebus-84/video-studio/tree/bfea2f80a4f8a10c999118a4db35b2820ac5c5fc) with local source edits. This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Autopilot is bounded, not unattended

The system supports autopilot, guided, and manual approval policies, with autopilot providing the intended one-prompt path by recording checkpoints without pausing. Autopilot still stops at budget boundaries, material downgrades, missing capabilities, validation failures, edit conflicts, and policy blockers; this preserves independent production without interpreting autonomy as permission to overspend or silently violate the approved deliverable.
