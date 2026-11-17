---
title: The correction, shown
description: "Render a six-second film twice with one title changed, and see which seconds were made again and which were not. Reproducible on your machine, with no account."
---
# The correction, shown

The home page shows six stills and says two were rendered again and four were
reused. This is where that comes from, and how to get the same on your
machine.

<TakeStrip />

## What was run

The film is the one `npm run demo:render` makes: three titles of two seconds
each, 1280 × 720, 24 frames a second, silent. It was rendered once. Then the
middle title was changed from “A little direction.” to “A second take.” and it
was rendered again, with the same cache directory.

The composer keeps the picture in one-second segments, each with a key made of
everything that can change its frames. The second render reported:

```text
take 1 { wholeVideoReused: false, segmentsReused: 0, segmentsRendered: 6, totalSegments: 6, warnings: [] }
take 2 { wholeVideoReused: false, segmentsReused: 4, segmentsRendered: 2, totalSegments: 6, warnings: [] }
```

Decoding both files and comparing them frame by frame gave the same answer
from the outside: of 144 frames, the 96 of seconds 0, 1, 4 and 5 are
identical in the two takes, and the 48 of seconds 2 and 3 differ.

Run on 17 November 2026, on the code released as 0.2.0.

## Run it yourself

After the [quick start](./quick-start), from the root of the application's
repository, save this as `second-take.mjs`:

```js
// The demo film rendered twice through the composer's cache, with one title changed.
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { firstTimeline } from './tools/first-render.mjs';
import { renderTimeline } from '@av/remotion-composer';

const out = await mkdtemp(join(tmpdir(), 'second-take-'));
const render = (timeline, name) => renderTimeline({
  timeline, assetRoot: out, outputPath: join(out, name), concurrency: 1,
  cacheDir: join(out, 'cache'),
});

const first = await render(firstTimeline(), 'take-1.mp4');

const changed = firstTimeline();
changed.tracks[0].items[1].props.text = 'A second take.';
const second = await render(changed, 'take-2.mp4');

console.log('take 1', first.cache);
console.log('take 2', second.cache);
console.log(out);
```

```bash
node second-take.mjs
```

It prints the two reports and the directory holding both films. To compare
them from the outside:

```bash
cd /path/it/printed
for take in 1 2; do
  ffmpeg -v error -i take-$take.mp4 -map 0:v -f framemd5 - | grep -v '^#' > frames-$take.txt
done
diff frames-1.txt frames-2.txt | grep -c '^>'    # 48
```

## What this does and does not show

It shows the renderer's cache doing what it says on the smallest film there
is: a change to one item costs the seconds that item is on screen.

It does not show a whole correction. In an episode the same change also has
to reach the script, the narration and the timeline, and that is the work of
the runtime: it marks what went stale, and the agent plans the rerun before
spending anything. [Change the line. Keep the film.](./recipes/revise-with-confidence)
walks through that, and through comparing the two renders afterwards.

It is not a measurement of anything against anything.
[Retake](./retake) is where that is specified, and it has not been run.

A change to sound alone reuses the whole picture. A change that touches
everything, such as the resolution or the renderer's own code, renders every
second again.
