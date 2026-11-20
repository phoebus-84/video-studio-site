> Imported studio reference, based on [7f73c14](https://github.com/phoebus-84/video-studio/tree/7f73c14cedca6c53bd96e135865f619e70c2af69). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# ADR-0054: Styles are optional, parametric templates

## Status

Accepted. Implemented:
- the `StyleTemplate`, `StyleBinding` and parameter-file contracts (`style.schema.json`, `src/style.mjs`) and the `style` kind of a source pin;
- `@studio/style`: the catalog, applying, reading, changing and keeping a style, and the pins;
- nine templates shipped with the studio (`studio/style/templates/`);
- the agent's tools (`pva_styles`, `pva_apply_style`, `pva_style`, `pva_set_style`, `pva_save_style`, and `style` on the creation tools) and the `style-templates` skill;
- the gateway's style routes, and the browser studio's style picker and Style panel.

## Context

Making something in a known look is the commonest request the studio gets
and the one it answers least well: "make it look like a woodblock print"
is re-invented from nothing each time — a palette guessed, a technique
described in prose, the values different from one shot to the next.

A good prompt for a look is half fixed values (these six inks, animate on
twos, two pixels of misregistration) and half a way of making (three plates
printed in a shader, one designed camera move). Written as one paragraph,
the values cannot be changed without rewriting the text, and nothing knows
what was made from the old ones.

The studio already has heavier tools for a look: a series template release
(ADR-0037) freezes a format with its compiler; a channel theme (ADR-0040)
carries a look as data for the kits. Both are right for a series that must
not drift. Neither is a light, optional road a film, a scene or a new series
can take in one sentence, and neither may be required: a channel, a series,
a film and a scene stay free to be anything, made any way.

## Decision

**A style is a template folder of data, applied by copy.**

```text
<template>/
  style.json        StyleTemplate: id, version, title, summary, levels, its parameter files, scaffold
  STYLE.md          the brief, with {{placeholders}}
  params/<id>.json  a palette (colours with ids, names, roles, #rrggbb) or named values
                    (number, enum, boolean, color, font, text — each with what a control needs)
```

- **Values are never inline.** The brief names a value — <code v-pre>{{palette}}</code>,
  <code v-pre>{{palette.accent}}</code>, <code v-pre>{{print.timing}}</code> — and the parameter file holds it.
  <code v-pre>{{unit.title}}</code> and <code v-pre>{{unit.idea}}</code> are filled from the unit the brief is
  read for. A placeholder that names nothing is a problem located by line,
  and a template with a problem cannot be applied. The parameter files are
  typed so that a form can be drawn from them: a palette is colour pickers,
  a number with bounds a slider, an enum a menu.
- **Where templates come from**, nearest first: a project's own
  (`<channel or film>/styles/`), the library's (`_styles/`, underscored so it
  is never taken for a channel), the studio's (`studio/style/templates/`). A
  nearer one shadows a farther one by id. A person names a template in their
  own words; it is matched by id, title, then the one it is part of.
- **Applying** copies the template into the level's `style/` with a
  `style.yaml` (`StyleBinding`) saying which template, version, origin and
  hash it came from. The copy is the level's: it is edited there and the
  template never changes. A style is applied to a channel, a series, a film
  or a scene; a unit reads the nearest one above it. A scene or a series may
  copy its project's style (`fromParent`) to change it. A style already
  there is replaced only when asked, and set aside in `.style-history/`.
- **What reads a style pins it.** The pin is ADR-0035's: a unit's
  `source/pins/style.json` with source `{ kind: "style", series? }`, an
  inventory of what it read (all of `style/` but `style.yaml`), and the
  stages that read it — a film's `bible`, a scene's `direction`, a shot's
  `plan` and `media`, an episode's art-direction stages. A changed palette
  makes those stages, and everything downstream of them, stale; renewing the
  pin journals which must be redone, so the renders above them are blocked
  until they are. A unit is pinned when it is created under a style, when a
  style is applied above it, and when its brief is read. A unit whose
  nearest style moves keeps what it read and is pointed at the new one: it
  is stale until renewed.
- **A change through the studio is accepted at once.** The gateway writes a
  parameter file or the brief, then renews every dependent's pin through the
  runtime. An edit made by hand shows as stale until renewed
  (`POST /api/style/<project>/<series>/renew`, `vpr pin renew <unit> style`).
- **The scaffold is a suggestion.** A template may suggest a film format, the
  source a shot usually has and the skills to load. A new film takes the
  format only when none was asked for. Nothing else is decided for the
  person.
- **Keeping** a level's style as a template (`pva_save_style`, the panel's
  "Keep as template") writes a new template from the edited copy, never
  overwriting one. A person's own templates are named in requests the same
  way as the studio's.

## Consequences

- "Make this scene using 'Tide riso'" is a lookup and a copy, and the brief
  the agent writes from is the same for every shot of it.
- A colour changed in the studio's colour picker reaches every unit that read
  the style, as staleness, without anyone tracing what depended on it.
- A style is not a format. It freezes nothing and compiles nothing; a series
  that must not drift still releases a template (ADR-0037) and a theme
  (ADR-0040). A style can be the starting point for either.
- The studio's templates are written in its own words and name no studio,
  brand or franchise; a library may keep any it likes in `_styles/`.
- Not here yet: a template's own reference images shown in the picker, a
  template's version history beyond its folder, and the kits (ADR-0042)
  reading a style's parameters directly. `params/` is where they would read.
