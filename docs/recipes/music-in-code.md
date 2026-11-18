---
title: Write a score in code
description: "Have the agent write music as Strudel code, check it without a sound, render it on your machine at no cost, and mix it by measurements. Then listen: the agent cannot."
---
# Write a score in code

**You end with:** a piece of music as a text file in your episode, a WAV
rendered from it at the loudness you asked for, the same piece as stems, and
a record of what was measured. The piece can be changed one part at a time
and rendered again.

<audio controls preload="none" src="/proof/sting.mp3">A five-second piece, as an MP3.</audio>

*Five seconds, six parts, eighteen events, rendered on 18 November 2026. Its
code is [below](#what-a-piece-looks-like).*

Music here is [Strudel](https://strudel.cc) code: patterns of notes and
sounds, written as text. The agent can write code and cannot hear. So a
render comes back as numbers the agent mixes by, and with a list of what a
person should listen for.

## Ingredients

- The workspace installed ([quick start](../quick-start)), and an agent.
- An episode, a channel source or a film to keep the piece in.
- A Chrome on the machine. Rendering runs the music engine in a headless
  browser; `npm run doctor` shows which one it found.
- What the music is for: the film, its length, its mood, whether a voice
  speaks over it.

**Costs:** the agent's model usage. Checking and rendering run on your
machine and make no paid API calls.

## What a piece looks like

```js
// A logo sting: a one-second rising run into a chord that lands at 1.0 s and rings out. D major.
setcpm(120/4)
run:   n("0 2 4 7 9 11 14 16").scale("D4:major").fast(2).mask("1 0")
         .s("triangle").lpf(3000).decay(.12).sustain(.2).release(.1)
         .gain(saw.range(.25, .6).fast(2)).pan(saw.range(.3, .7).fast(2))
whoosh: s("white").fast(2).mask("1 0")
         .hpf(1500).lpf(300).lpenv(5).lpattack(1).attack(.95).release(.03).gain(.3)
chord: n("[0,4,7,9,11]").scale("D3:major").struct("~ x")
         .s("supersaw").lpf(4000).attack(.005).decay(2).sustain(0).release(1.2)
         .room(.5).rsize(3).gain(.32)
low:   note("d2").struct("~ x").s("sine").attack(.005).decay(1.8).sustain(0).release(1).gain(.42)
thump: s("sbd").struct("~ x").decay(.4).gain(.32)
bell:  n("[7,11]").scale("D5:major").struct("~ x").s("sine").fm(2).fmh(3.5).fmdecay(.8)
         .decay(2).sustain(0).release(1.2).room(.6).rsize(3).gain(.24)
```

It lives at `music/<name>.strudel`. Each labelled statement is a **part**:
`run`, `chord`, `low`. A part is what you name when you ask for a change,
what is muted or played alone, and what a stem holds.

This one is among the whole pieces the studio's skills carry, each tested on
the engine: a bed under a voice, an ambient loop, an explainer underscore, a
tension build, a sting, a sixty-second arc.

## 1. Ask for it

```text
Load the strudel-music skill. Write a bed for episode inventions/ep003: two
minutes, calm, a voice speaks over all of it. Check it after every edit.
Render it with stems and tell me what you measured and what I should
listen for.
```

The agent writes the file and runs `pva_music_check` after each edit. It
takes about two seconds and makes no sound. For the sting above it says:

```text
✅ music/sting.strudel: cycles 0–1 = 2 s at 30 cycles/min; 18 events
- run: 8 events, per cycle [8]; notes d4–f#6; triangle
- whoosh: 1 events, per cycle [1]; white
- chord: 5 events, per cycle [5]; notes d3–a4; supersaw
- low: 1 events, per cycle [1]; notes d2–d2; sine
- thump: 1 events, per cycle [1]; sbd
- bell: 2 events, per cycle [2]; notes d6–a6; sine
```

It also says what is wrong: a sound that does not exist, a part that plays
nothing, a control the engine ignores. In this language a misspelt scale or
chord is silence, not an error, so a part with no events is the thing to
look for.

## 2. Render it, and read the numbers

`pva_music_render` writes a WAV (48 kHz, stereo, 24-bit) into the episode
and a record beside it, `<file>.music.json`. For the sting, one cycle and
three seconds for it to ring out:

```text
✅ assets/sounds/sting.wav: 5 s (3 s of it tail)
level: -18.0 LUFS, peak -3.0 dBFS at 1.02 s (gain +1 dB; the piece itself peaks at -4.0 dBFS)
spectrum (share of the energy, dB): sub -13.5 · bass -3.9 · low-mid -7.9 · mid -5 · high-mid -12.8 · high -18.2
stereo: correlation 0.87, width -11.5 dB
level through time (dBFS, every 0.25 s): -32 -30 -27 -24 -15 -18 -19 -21 -23 -25 -28 -34 -40 …
```

The code says the chord lands at one second. The peak is at 1.02 s.

| Asked for | What you get |
|---|---|
| `cycles` or `seconds`, `from` | a stretch of the piece, not all of it |
| `only`, `mute` | some parts |
| `tail` | seconds after the last cycle, for reverb and long notes to end |
| `loop: true` | the tail folded over the start: the file repeats without a seam |
| `stems: true` | each part alone, at the level it has in the mix, measured too |
| `loudness` | the level the file is brought to. Default −18 LUFS, with one gain and no compressor |
| `seed` | another take of the same notes: noise, reverb and detune are seeded |

`pva_music` lists a workspace's pieces and says which renders are older than
their code.

## 3. Listen, and say what to change

The agent is told never to say how a piece sounds. It says what the piece is
(key, tempo, form, instruments), what it measured, and what you should
listen for: a loop whose parts do not come round together, an ending cut
while it still sounds.

You listen. In the browser studio a `.strudel` file opens with a player on
the same engine (`Ctrl+Enter` plays, `Ctrl+.` stops) and its events drawn
part by part; episodes and film units have a **Music** tab.

Then you ask for a change by part:

```text
The bass is too heavy under the voice: take it down and open its filter.
Leave the other parts as they are. Render again and compare the stems.
```

The piece is text, so the change is a diff, and the version you approved is
still in Git.

## 4. Put it under the film

A rendered piece lands in the episode's `assets/sounds/`, and the episode's
spec names it by its sound id like any other sound. A long ambient version
goes in `assets/music/`. In a film, the piece and its WAV sit on the film
itself, or on a scene.

## What it does not do

- **It has no sampled instruments.** The engine has oscillators and noise:
  sine, triangle, square, sawtooth, a supersaw, a synthetic kick, white,
  pink and brown noise. There is no piano, no drum kit, no orchestra. Drums,
  basses, keys and pads are built from those; the skills have them, tested.
- **It does not fetch sounds.** The render page is closed to the network.
  Strudel's usual sample packs live on other people's servers and are not
  there. A recording already in your workspace can be an instrument, by its
  path; a pack from the network needs your permission and a licence you
  checked.
- **Nobody has judged the music.** The examples were tested for what they
  measure, not for whether they are good. That is yours to decide, by ear.
- **It is not a composer's tool.** There is no piano roll and no audio
  recording; the browser's player plays and draws a piece, and editing is in
  the text.
- **The render is not bit-exact.** The same piece and seed give the same
  music; the last digits of the audio can differ between runs.

## Where it goes wrong

- **A part that is silent.** A wrong scale or chord name plays nothing and
  raises no error. Read the check: every cycle of every part should have
  events.
- **Parts that add up.** There is no limiter. A kick, a bass and a chord on
  the same beat peak together, and the render lowers the whole file to fit.
  Ask for stems and look at which part owns the peak.
- **A loop that clicks.** Without `loop: true` a file ends where its last
  cycle ends and its reverb is cut. With it, the tail is folded over the
  start.
- **Music mixed before the voice exists.** A bed is judged under the voice
  it will sit under. Render the narration first.

## Licence

The music package, `@av/strudel`, is AGPL-3.0-or-later, as Strudel is; the
other reusable packages are Apache-2.0. That covers the software. A piece
you write is yours, and a sample it loads keeps its own terms.

## Next

[A place to spend an hour](./ambient-world) needs an hour of music you may
use: a loop rendered here is one way to have it.
[Change the line. Keep the film.](./revise-with-confidence) is the same idea
for the picture.
