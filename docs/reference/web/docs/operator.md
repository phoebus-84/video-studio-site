> Imported studio reference, based on [aea888a](https://github.com/phoebus-84/video-studio/tree/aea888a3b007ec8530cf98fb3abdb2f8dc6e9f63). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# Operator guide

## MVP operating model

Video Studio is a localhost companion to Pi. For the MVP, start production in Pi by defining a series, requesting an episode, running a stage, or generating assets. Open the studio to supervise the one active production, inspect generated artifacts and media, review blockers, and request corrections.

The application is desktop-first. A normal workspace contains 1 to 5 series and 10 to 15 episodes per series. A heavy workspace may contain 5 to 10 series and up to 100 episodes per series. Only one production is active at a time.

## Expected behavior

- The studio follows the operating-system light or dark theme.
- Workspace content remains inspectable when Pi is offline where gateway and filesystem policy permit it.
- Connection loss preserves the last confirmed projection in a clearly degraded or read-only state.
- Generated attempts remain visible after another attempt is selected.
- Paid actions, reruns, and material downgrades show their consequences before approval.
- A deliverable is labeled current only after required validation and dependency checks.
- **Focus** (the button beside the view tabs, or ⌘\ / Ctrl+\) puts the library and the inspector away for work that needs the width, and brings back whatever was open. The agent bar folds to one line. Panel widths, focus and the fold are remembered.
- A JSON or YAML file opens as **Fields**: values are edited in place, a list of small records is a table, and a change rewrites only the field it names (YAML keeps its comments). **Source** is the text itself, and is where a file that does not parse is fixed.

### Films

- A film is listed apart from the channels. It opens on its **Board**: scenes in running order with their shots, each marked no cut, blocked, ready to render, stale, preview only or current — a mark and a word, never colour alone — and the list of what stands between the film and its render.
- A film is started from **+ Film** in the library: a title, a folder name, the delivery format and a planned running time. The format is asked first because every cut is made in it.
- **Cut**, at the film, a scene or a shot, is the same editor. *Sources* lists what the cut can be made of: the units under it, the unit's files, the film's footage, a colour. *Monitor* shows the **Draft** (the timeline played from its sources: cuts and timing, no effects or mix), the **Render** (the unit's last render, said to be out of date when it is) or a **Frame** (the frame at the playhead composed with every effect, of the saved cut). The inspector panel's **Cut** tab holds the selected clip, track or the whole cut; with the panel away it is a column of the view.
- Clips are dragged to move and by their edges to trim, snapping to other edges, markers and the playhead. Focused, a clip moves with the arrows, trims to the playhead with `[` and `]`, splits with `S`, locks with `L` and goes with Delete. Space plays; ⌘Z undoes; ⌘S saves.
- A person edits a **draft**. *Save* writes it as the next revision and is refused if the cut was changed elsewhere meanwhile; *Render* renders what is saved and is refused while there are unsaved changes. *Assemble* lays out what is under the unit in order and keeps the cut in step with it.
- A **locked** clip or track is left alone by the agent and by assembly.
- **Who decides**, on every level's overview, chooses how much of that level and of the levels under it waits for a person.

## Accessibility

The target is WCAG 2.2 AA. Production monitoring, navigation, media playback, review, approval, and rerun planning must work by keyboard. Reduced-motion preferences are respected, and production state never relies on color alone.

## Design context

The approved product and visual direction live in `PRODUCT.md`, `DESIGN.md`, and `docs/SHAPE-BRIEF.md`. Run `npm run check` to validate that this context remains complete before scaffolding or changing core information architecture.
