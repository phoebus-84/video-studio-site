> Imported studio reference, based on [3dee4dc](https://github.com/phoebus-84/sergio/tree/3dee4dc69199ab145af8d2c35d72328c9d70dd37). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# @studio/style

Style templates (ADR-0054): optional, parametric roads to a look. A channel,
a series, a film or a scene may take one; nothing has to.

```text
<template>/                      studio/style/templates/ · <library>/_styles/ · <project>/styles/
  style.json                     StyleTemplate: identity, its parameter files, what it suggests
  STYLE.md                       the brief, values written as {{placeholders}}
  params/<id>.json               a palette, or named values (number, enum, boolean, color, font, text)

<channel | series | film | scene>/style/
  …the template's files, the level's own copy
  style.yaml                     StyleBinding: the template, version, origin and hash it came from

<unit>/source/pins/style.json    what the unit read: a change makes the stages that read it stale
```

## What is here

| Module | |
|---|---|
| `levels` | where a style lives (a project, a series or a scene), which units read it, what a unit says of itself for <code v-pre>{{unit.*}}</code> |
| `catalog` | `listStyles` (nearest wins: project, library, studio), `findStyle` by the name a person gives, `readStyleFolder`, `folderHash` |
| `pins` | `syncStylePin` — a unit's pin on the style it reads (ADR-0035); `dependentsOf` a level's style; `STYLE_READERS` by level |
| `apply` | `applyStyle` (a template, or the level above's), `readTargetStyle`, `resolveUnitStyle` (the brief written for a unit), `writeStyleParams`, `writeStyleBrief`, `saveStyleAsTemplate` |

The contract — shapes, placeholders, rendering a brief, checking a folder — is
`@studio/contracts/src/style.mjs`, which the browser imports too. Renewing a
changed style's pins needs the runtime and is the gateway's
(`studio/gateway/src/routes/styles.ts`).

## The studio's templates

| id | title | suggests |
|---|---|---|
| `woodblock-print` | Animated woodblock print | hd-30, graphics |
| `risograph` | Risograph print | hd-30, graphics |
| `flat-minimal` | Flat minimalist illustration | hd-30, graphics |
| `oil-pastel` | Oil pastel and gouache picture book | hd-30, graphics |
| `cut-paper` | Stop-motion cut paper | hd-30, graphics |
| `storybook-cel` | Storybook cel animation | hd-30, graphics |
| `neon-city` | Rain-soaked neon city | hd-30, graphics |
| `chalkboard-explainer` | Chalkboard explainer | vertical-30, graphics |
| `bold-flat-explainer` | Bold flat explainer | hd-30, graphics |

Each is built in code — Remotion, shaders, three.js — and asks for the
`remotion-best-practices` and `strudel-music` skills. Their tests hold every
one of them to the contract: a template that does not check is not shipped.

## Adding a template

Make a folder with the three parts, in the library's `_styles/<id>/` (or a
project's `styles/<id>/`, or here for the studio), or keep a level's edited
style with `pva_save_style`. `pva_styles { name: "<id>" }` shows what is
wrong with it, if anything.
