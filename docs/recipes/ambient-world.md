---
title: A place to spend an hour
description: "Build one room in moving layers, make and review a short looping master, then extend it to an hour under a soundtrack assembled from licensed music, without re-encoding the picture."
---
# A place to spend an hour

**You end with:** an hour-long film of one place, made from a short master
that loops, under a soundtrack that does not repeat the way the picture does.

<RecipeFilm id="ambient-kowloon" />

## Ingredients

- %product% installed, an agent connected and the gateway running.
- A place, a time and a viewing situation: on a television across a room is
  not on a phone.
- An image provider for the scene, and music you may use for an hour
  ([borrow it with its licence](./research-and-materials)).
- Disk space: an hour of video is large.

**Costs:** what is generated is the short master: the picture and a few
animated loops. The film above recorded $1.50 over 15 metered calls. The
extension to an hour is a copy and a mix on your machine.

## 1. The place, then the atmosphere

```text
An ambient film: a room above a rainy city at night, seen from the sofa.
One fixed composition. Three things alive in it: rain on the glass, an
aquarium, a television. Everything else still.
Research what such a room looked like before proposing the picture.
Show me the still before animating anything.
```

Decide the still as a still. An hour magnifies what is wrong with it.

## 2. Layers that move on their own

The scene is one picture, with the live areas as separate loops laid over
it. `pva_generate_wan_video` with `loop: true` gives the same picture as the
end frame, so a loop closes.

Local sound is free: `pva_synthesize_sound` makes rain, wind, sea, fire and
others on your machine, the same file for the same id. They are synthesised
stand-ins, not recordings.

## 3. Review the master, not the hour

The master is short and complete, with its mix. Watch all of it, on the
screen it is meant for, at the volume it will be heard. Look for the seam
where a loop restarts, and for the event that happens too often.

Approve it before anything is extended.

## 4. Extend it

```text
Extend the approved master to one hour, with the music in assets/music.
```

`pva_extend_episode` repeats the master by stream copy, so the picture is not
encoded again, under a music-only soundtrack drawn from the pieces you give:
an order that never plays the same piece twice in a row, joined by
crossfades or short gaps, levelled and mastered. It writes the long file with
its plan and its report beside it. The episode's current delivery does not
move.

Run it with `soundtrackOnly` while the master is still under review: the
mastered soundtrack is cached, and the long version afterwards only copies.

## Where it goes wrong

- **A visible seam.** A loop that does not close shows once a minute for an
  hour. Fix the loop, not the crossfade.
- **Twenty minutes of music for sixty.** The same three pieces return. Bring
  more music than you think.
- **A licence that forbids the use.** An hour-long monetised film under a
  non-commercial track cannot be monetised. Check before the mix.
- **Publishing size.** The hour above is 3.4 GB at full size; a host may
  refuse it. Plan a smaller edition.

## Next

A second place in the same series is a [format](./repeatable-series): the
method stays, the room changes.
