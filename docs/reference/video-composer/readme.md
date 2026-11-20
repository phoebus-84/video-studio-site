> Imported studio reference, based on [19c5681](https://github.com/phoebus-84/video-studio/tree/19c568188fc4404961e923cc38de93940e6eb1b3). This is a versioned snapshot, not a live dependency. [Update policy](/site-maintenance#technical-reference-snapshot).

# ffmpeg-video-composer

Compiler and validator for typed video edit timelines.

## Owns

Timeline validation, media normalization, deterministic FFmpeg filter-graph compilation, image motion, transitions, overlays, caption burn-in, narration/music mixing, loudness normalization, encoding profiles, ffprobe reports, frame sampling, audio QA, cancellation, and reproducibility bundles.

## The cut renderer

`renderCut(cut, options)` renders a **cut** — clips of picture and sound on
tracks — to an H.264/AAC MP4. A cut is plain data: every clip names a file (or
a solid colour), where it starts and how long it holds in whole frames, where
it starts in its source in seconds, its speed, fit, opacity, transitions
(`dissolve`, `fade`, four wipes), its effects, and its sound's level and fades
in dB and frames. Sound tracks have a fader, effects and ducking under other
tracks; the master has picture effects, sound effects and a loudness target.

```ts
import {renderCut, renderCutFrame, checkCut, listEffects} from '@av/video-composer';

const result = await renderCut(cut, {output: 'out/film.mp4', workDir: '.cut', quality: 'final', keepMix: true});
// result.frames, result.loudness.after, result.work.pictureReused, result.warnings …
```

- **Effects are a catalog, never a filter string.** `listEffects()` gives every
  effect with its parameters' ranges, defaults and meaning (what a form is
  drawn from); `validateEffect` and `validateCut` hold a cut to it. Picture:
  exposure, contrast, curves, saturation, temperature, colour balance, LUT,
  vignette, blur, sharpen, grain, denoise, deinterlace, stabilize, crop, zoom,
  flip, rotate, letterbox, chroma key. Sound: gain, high- and low-pass, EQ,
  compressor, limiter, gate, denoise, de-esser, reverb, echo, pitch, pan,
  stereo width.
- **Rendered in pieces, kept between renders.** The timeline is divided where
  clips begin and end; each window's picture and each track's sound is a file
  in `workDir` named by the FFmpeg arguments and the state of the files it
  reads. A second render of a cut that changed in one place renders that
  place. A feature-length cut never opens more than a window's files at once.
- **Loudness by a static gain.** The mix is measured (EBU R128), moved to the
  target by one gain, and limited only where it would pass the true-peak
  ceiling: its dynamics are kept. `keepMix` writes `<output>.mix.wav`, which a
  cut that nests this render reads instead of the AAC (`media.audioFile`).
- `renderCutFrame` gives one frame with every effect; `range` renders part of
  the timeline; `quality: "preview"` renders at most 960 wide.
- Before cutting: `probeFile`, `extractStill`, `contactSheet` (a stamped grid
  to read a take at a glance), `detectSegments` (where a reel's picture cuts),
  `makeProxy` (a copy a browser can scrub), `measureLoudness`.

Nothing here knows what a clip's file is a render of: resolving a shot or a
scene to a file is the caller's.

## Boundary

The edit timeline is canonical editorial intent. Generated shell commands are preserved diagnostics, not editable production state. Arbitrary shell fragments are rejected.

## Plan

Work is tracked once, for the whole repository, at its root; this module keeps no plan of its own.
