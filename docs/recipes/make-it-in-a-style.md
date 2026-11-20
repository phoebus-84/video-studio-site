---
title: Make it in a style
description: "Start a film, a series or a scene from a ready-made look: a brief whose every colour and value lives in a parameter file you can change with a colour picker, and a change that tells you exactly what it made stale."
---
# Make it in a style

**You end with:** a film, a series or a scene that has its own copy of a
style — a brief the agent works from, a palette and values in files of their
own — and every scene and shot under it reading that brief, written for
itself. Change one colour and %product% tells you which work was made with the
old one.

A style is an easier road, never a requirement. A channel, a series, a film
or a scene with no style is made exactly as before, in any look, with any
process. Take one when you want the first steps scaffolded instead of
invented.

## Ingredients

- The workspace installed ([quick start](../quick-start)), and an agent.
- A look in mind, in your own words: "a woodblock print", "the risograph
  one", or the name of a style you kept yourself.
- For the browser panel: the gateway and the studio running
  ([running](../running#style-templates)).

**Costs:** none of its own. Choosing, applying, reading and changing a style
run on your machine and make no paid API calls. What you make in the style
costs what it costs: the studio's styles are built in code (Remotion,
shaders, three.js) and render locally.

## The styles there are

```text
pva_styles
9 style template(s):
• woodblock-print — "Animated woodblock print" (builtin) #1d3b5a #2e3a6e #a9b8c2 #efe4cc #c8322b #1a1714
    A Japanese woodblock print that comes to life: flat plates printed with misregistration, wood grain and paper fibre, never pretending to be 3D.
    suggests: film hd-30, shots: graphics
• chalkboard-explainer — "Chalkboard explainer" (builtin) #1f2a24 #efeee8 #f2d25c #ee9bb0 #8cc4e8
    A narrated vertical short drawn as chalk lines on a blackboard: strokes that write themselves, eraser wipes between ideas, captions in the lower third.
    suggests: film vertical-30, shots: graphics
• risograph — "Risograph print" (builtin) #ff48b0 #0078bf #ffe800 #1a1a1a #f4eedf
…
```

Nine ship with the studio: woodblock print, risograph, flat minimal
illustration, oil pastel picture book, stop-motion cut paper, storybook cel
animation, a rain-soaked neon city, a chalkboard explainer and a bold flat
explainer. Your library keeps its own in `_styles/`; a channel or a film can
carry some in its `styles/`, and those win.

## 1. Ask for it

```text
Make a short film, "Storm at Sea": three fishing boats ride a storm as a giant
wave rises, curls and collapses. Use the woodblock style.
```

The agent loads the `style-templates` skill, finds the style by the words you
used, and creates the film with it:

```text
✅ film created: storm
✅ storm (film) now reads "Animated woodblock print" (woodblock-print 1.0.0, builtin) — its own copy in …/storm/style
Load before making anything in it: remotion-best-practices, strudel-music.
```

The film took the style's format (HD at 30 fps) because you asked for none.
In the browser, the **+ Film** form has the same choice, with each style's
colours beside its name. To give a style to something that already exists —
a channel, a series, a scene — the overview's **Style** panel has
**Choose a style…**, and the agent has `pva_apply_style`.

## 2. What the agent works from

The style is a brief, `STYLE.md`, in which no value is written inline:

```markdown
Draw the artwork as flat 2D shapes on {{print.plates}} separate printing
plates … inked only in {{palette}}. {{palette.accent.name}}
({{palette.accent}}) is used once: {{palette.accent.role}}.
```

The colours are in `params/palette.json`, the plates and the grain in
`params/print.json`, the timing in `params/motion.json`, the music in
`params/sound.json`. Before the agent writes the film's bible, a scene's
direction or a shot's plan, it reads the brief for that unit with
`pva_style`, every value filled in and the unit's own idea at the top:

```text
── The brief, for storm/010-wave/010-wide ──
# Wide — animated woodblock print

**What happens.** The three boats in the trough as the wave rises behind them.

## The look
… inked only in Prussian blue (#1d3b5a), Indigo (#2e3a6e), Pale blue-grey
(#a9b8c2), Cream (#efe4cc), Vermilion (#c8322b), Sumi black (#1a1714).
Vermilion (#c8322b) is used once: the one red: a sun, a seal, a lantern.
```

Every shot of the film starts from the same words and the same numbers.

## 3. Change a colour, and see what it costs

In the studio, open the film's overview. The **Style** panel shows each
parameter file with the control its values ask for: a colour picker and the
hex for every colour of the palette, a slider for a number, a menu for a
choice, a switch, a font. The brief is shown as it will read with your
changes, and before you save it says how many units read the style.

Saving changes the file, and every unit that read the style is told:

```text
Saved. What read the style must be redone:
• storm/_/_: bible, breakdown, scenes, score, cut, render, review
• storm/010-wave/_: direction, shots, sound, cut, render
• storm/010-wave/010-wide: plan, media, cut, render
```

Each unit keeps a pin on the style it read. A changed palette makes the
stages that read it stale — the film's bible, the scene's direction, the
shot's plan and its takes — and everything made from them, down to the
renders above. Nothing is redone behind your back: the agent redoes what is
stale when you run the pipeline again.

From the agent it is one sentence:

```text
Make the accent of the storm film's style a warm ochre, #e0a020.
```

`pva_set_style` checks the value before it writes it (a colour is
`#rrggbb`, a number stays in its range, a choice is one of its options) and
says how many units it made stale.

## 4. One scene, a different light

A scene reads its film's style. To change it for that scene alone — the
night scene in a cooler palette — give the scene its own copy (**Give it its
own copy** in its panel, or `pva_apply_style` with `fromParent`) and change
the copy. The film's style stays as it was; the scene's shots now read the
scene's.

## 5. Keep it, and ask for it by name

When you like what a film's style became, keep it: **Keep as template…** in
the panel, or

```text
Save the storm film's style as a template called "Storm print".
```

`pva_save_style` writes it to your library's `_styles/`. From then on, any
request can name it — "prepare this scene using 'Storm print'" — and the
agent makes the same scaffolding: the same brief, the same palette, the same
values, ready to be changed again. A template you write by hand is a folder
with `style.json`, `STYLE.md` and `params/`; `pva_styles` says what is wrong
with it, if anything.

## What it does not do

- **It does not require a style.** Nothing in the studio waits on one.
- **It does not freeze a format.** A style is a starting point and its copy
  is yours to change. A series that must not drift still releases a pinned
  template ([A format worth repeating](./repeatable-series)); a style can be
  where that format starts.
- **It does not redo the work for you.** A change makes the work that used
  the old values stale and says which; redoing it is a run of the pipeline,
  with the costs that has.
- **It does not imitate a studio or a brand.** The shipped styles are named
  for a technique, and describe original work.

## Where it goes wrong

- **A name that means two styles.** "Explainer" is two of them; the agent
  asks which.
- **A brief that names a removed colour.** Remove a colour that
  <code v-pre>{{palette.&lt;id&gt;}}</code> still names and the save is refused until the brief no
  longer names it.
- **An edit by hand.** Change `params/palette.json` in an editor and the
  units that read it show as stale, but the change is not yet accepted:
  renew it from the gateway or with `vpr pin renew <unit> style`.
- **A style chosen after the work.** Giving a style to a film whose bible is
  written does not rewrite the bible; the units read the new style from now
  on, and what was made before it is yours to keep or redo.

## Next

[Change the line. Keep the film.](./revise-with-confidence) is the same care
for a correction: redo only what depends on the change.
[Write a score in code](./music-in-code) makes the music the styles ask for.
