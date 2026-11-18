> Imported studio reference, based on [3f8895a](https://github.com/phoebus-84/video-studio/tree/3f8895af15f019d98afe93a6af8753128060a747). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# @av/strudel

Music written as [Strudel](https://strudel.cc) code, checked without a sound
and rendered to audio offline. The engine is Strudel's own, pinned
(`@strudel/web` 1.3.0), in a headless Chrome: what a piece sounds like on
strudel.cc is what is rendered here. The package knows nothing of the studio.

```ts
import { StrudelRenderer, analyzeAudio, levelAudio, encodeWav } from "@av/strudel";

const renderer = await StrudelRenderer.launch();
const code = `
setcpm(100/4)
kick: s("sbd*4").gain(.8)
bass: note("<a1 f1>*2").s("sawtooth").lpf(500).decay(.2).sustain(.3)
`;

const seen = await renderer.inspect(code, { to: 4, events: 4 });
// seen.ok, seen.cps, seen.parts[] (events per cycle, notes, sounds), seen.problems[]

const made = await renderer.render(code, { to: 8, tail: 2 });
const level = levelAudio(made.channels, made.sampleRate, { loudness: -18 });
writeFileSync("theme.wav", encodeWav(level.channels, made.sampleRate, "pcm24"));
analyzeAudio(level.channels, made.sampleRate); // lufs, peak, bands, stereo, envelope
await renderer.close();
```

## A piece

A piece is Strudel code as the REPL takes it. Its **parts** are labelled
statements: `bass: note(…)`. An unlabelled `$:` is named `$1`, `$2`… in
order; `_bass:` is muted in the code; a label starting with a capital `S`
solos its part, as in the REPL. Tempo is the piece's own (`setcpm`, `setcps`),
0.5 cycles a second when it sets none.

The engine's own sounds are synthesized: `sine`, `triangle`, `square`,
`sawtooth`, `supersaw`, `pulse`, `sbd`, `white`, `pink`, `brown`, `crackle`,
the `zzfx` family, `bytebeat`. Strudel's usual sample packs (`bd`, `piano`,
`gm_*`, `.bank()`) live on other people's servers and are not there unless
the piece loads them and the network is allowed. `renderer.sounds()` lists
what is registered.

## Checking

`inspect(code, { from, to, events, only, mute })` evaluates and describes,
without rendering. A piece that does not evaluate is `ok: false` with the
reason, never an exception. `problems` names what would go wrong or surprise:

| code | |
| --- | --- |
| `eval` | the code does not evaluate |
| `unknown-sound` | a sound that is neither built in nor loaded |
| `malformed-events` | bare values with no `.note()` or `.s()` |
| `no-events`, `silent-part` | nothing plays in the stretch |
| `solo-label`, `duplicate-label` | a label that changes what plays |
| `unknown-part` | `only` or `mute` names no part |
| `ignored-control` | a control Strudel accepts and this engine never reads (`chorus`, `squiz`, a `chord` with no `.voicing()`…): it changes nothing |
| `orbit-conflict` | parts that ask one orbit for different reverb sizes or delays: it has one of each |
| `blocked-request`, `missing-file` | a sample that could not be loaded |
| `dense` | more than 64 events a second |

Each part, and the whole, also has a `signature`: one number for the events
of the stretch, placed from its start. Two stretches with the same signature
play the same thing — how a loop is checked for a seam.

## Rendering

`render(code, options)` gives float stereo samples (they may pass ±1; level
them before writing PCM).

- **A stretch**: `from` and `to` in cycles, or `seconds` (as many whole
  cycles as fit). `lead` cycles are played before `from` and cut off, so the
  stretch opens with what they left ringing.
- **Parts**: `only` or `mute`, by label.
- **How it ends**: `tail` seconds are kept after the last cycle; with `loop`
  they are folded over the start instead, and the file repeats without a
  seam.
- **`seed`** seeds the engine's randomness — noise, the reverb, a supersaw's
  detune. The same seed gives the same sound to within −130 dBFS (Chrome's
  audio arithmetic is not bit-exact between runs).
- **Samples**: with `files: dir`, a piece may load the audio files under that
  directory by relative path — `samples({ rain: 'assets/rain.wav' })`, in
  single quotes: double quotes make a pattern. Nothing else is served. The
  network is off unless `network: true`. Every request is in `requests`, with
  the hash of what answered it.

The render is not Strudel's own export, which triggers every event before
rendering starts. Here the offline context is stepped every 10 ms: ducking,
the release of finished voices and the reverb's impulse happen as they do
when the piece plays, and an event at the very start that ducks another part
is not lost. Events land on their sample.

A render holds up to 15 minutes. It runs several times faster than the music.

## Levels and measurements

- `levelAudio(channels, rate, { loudness, peak, gain, fadeIn, fadeOut })`:
  one gain for the whole file, never a compressor. The loudness is reached
  when the peaks allow it; otherwise the file stays under the ceiling and
  `held` is true. `gain` applies a given gain instead — for stems, which
  keep the level they have in the mix.
- `analyzeAudio(channels, rate)`: sample peak and when it falls, RMS, integrated loudness
  (ITU-R BS.1770, gated; within 0.3 LU of ffmpeg's meter), crest, clipping,
  DC, silence at the ends, the share of the energy in six bands, the spectral
  centroid, stereo correlation, width and balance, and the level through
  time in at most 120 windows.
- `encodeWav` / `decodeWav`: 32-bit float, 24-bit or 16-bit PCM.

## In a browser

`@av/strudel/session` is the evaluation and the description, with no Node in
it: hand it a loaded `@strudel/web` and a page plays a piece with the same
parts a render has.

```ts
const strudel = await import("@strudel/web");
const { createSession } = await import("@av/strudel/session");
const session = createSession(strudel);
session.attach(await strudel.initStrudel({ onEvalError: session.fail }));
await session.evaluate({ code, mute: ["drums"], play: true });
session.notes({ from: 0, to: 8 }); // every event, for drawing
```

## From the shell

```bash
strudel-render check piece.strudel --cycles 8 --events 4
strudel-render render piece.strudel -o out.wav --cycles 16 --tail 3 --stems
strudel-render render piece.strudel -o bed.wav --seconds 60 --loop --tail 4 --only pad,drone
strudel-render sounds
```

`render` writes float WAVs (`--format pcm24` for PCM) and prints each file's
measurements; `--json` gives them as data.

## Which Chrome

Any recent Chrome, Chromium or chrome-headless-shell. `findChrome()` takes, in
order: `chromePath`; `STRUDEL_CHROME_PATH`, `CHROME_PATH`,
`PUPPETEER_EXECUTABLE_PATH`; the headless shell Remotion downloaded
(`node_modules/.remotion`); Playwright's browsers; a Chrome installed on the
machine. With none, it says how to get one.

## Licence

AGPL-3.0-or-later, because Strudel is and this package runs it. That licenses
the code. A piece of music is its author's, and so is what is rendered from
it; samples a piece loads keep their own terms.
