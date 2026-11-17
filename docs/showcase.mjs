// Editorial metadata only. Production media is prepared explicitly, never committed.
//
// What a visitor reads is in `description`, `made`, `shows` and `receipt`.
// Which file was selected, and where it stands in its production, is
// bookkeeping: `sourceVersion` and `source` are written to the credits file by
// tools/prepare-site-media.mjs and are shown only under "Source & credits";
// `status` is shown when a film is not an approved release.
//
// A `receipt` row is a fact on record: read from the film's files, its credits
// or its episode's spend ledger. A number nobody recorded is left out.
export const showcase = [
  {
    id: 'lontano', title: 'Lontano, a dicembre', category: 'Illustrated film', featured: true,
    format: '16:9', duration: 28, start: 151, posterAt: 23, hasAudio: true,
    recipe: '/recipes/illustrated-story', edition: 'Complete film · 4 min 14 s', sourceVersion: 'Complete film · v03', sourceDuration: '4 min 14 sec',
    description: 'Two windows across a rain-soaked alley, and a world that turns negative when the lights go out. An illustrated film cut to an original score.',
    made: 'Generated illustrations, held in fixed-camera compositions; only chosen elements move, by procedural animation. Gestures, light and cuts follow an original score composed in Strudel.',
    shows: 'A film that is not narration over pictures. There is no voice: the music leads, the camera stays still, and what moves in each shot was chosen.',
    visual: 'In a pale rose-and-plum negative world, two hands reach towards each other across the rain without quite touching.',
    technique: 'Generated illustrations · procedural animation · music-led editing',
    receipt: [
      { label: 'Length', value: '4 min 14 s · 1920 × 1080' },
      { label: 'Picture', value: 'Generated illustrations; animated by code' },
      { label: 'Sound', value: 'Original score composed in Strudel; no speech' },
    ],
    source: 'Experiment in ../tests/lontano-a-dicembre',
    credit: 'Generated illustrations and procedural animation from the Lontano, a dicembre experiment. Original score composed in Strudel. Shot composition studies reference Tsai Ming-liang; no downloaded trailer footage is included.',
    audioDescription: 'Instrumental piano and strings from the original score; no speech.',
    transcript: 'Instrumental score only. The visual sequence moves into an inverted-colour dream: rain hangs in the air and two hands approach one another across the alley.'
  },
  {
    id: 'ambient-kowloon', title: 'Kowloon, 1987', category: 'Ambient worlds', featured: true,
    format: '16:9', duration: 24, start: 18, posterAt: 12, hasAudio: true,
    recipe: '/recipes/ambient-world', edition: 'Complete film · 1 hour', sourceVersion: 'One-hour delivery · 16 October 2026, 10:28', sourceDuration: '1 hour',
    description: 'A room above a rainy city, for an hour. Neon, traffic, an aquarium and a television move inside one held composition.',
    made: 'One room in layers that move on their own: rain on the glass, the fish, the television. A short looping master was made and reviewed first; the hour is that master repeated without re-encoding, under a soundtrack assembled for the length from licensed music.',
    shows: 'A long film whose cost does not grow with its length: what is generated is the short master, and the hour is assembled on the machine.',
    visual: 'A warmly lit room looks onto rain-streaked windows and Hong Kong neon; a small television and a lit aquarium bring movement into the foreground.',
    technique: 'Layered motion · reusable master · long-form soundtrack',
    receipt: [
      { label: 'Length', value: '1 hour · the full film is published at 720p' },
      { label: 'Picture', value: 'One generated scene in moving layers; archive footage on the television' },
      { label: 'Paid generation', value: '$1.50 recorded in the episode’s journal, over 15 metered calls' },
      { label: 'Licensed material', value: '4 works, each with its licence: see credits' },
    ],
    source: 'Library / ambient-through-time / notti-di-citta / 01-kowloon-1987-pioggia',
    credit: 'Visual treatment from Ambient Through Time. Excerpt music: “The Long Goodbye” by flatwound (CC BY 2.5), trimmed from the final mix with short edge fades. Embedded television materials carry the credits below; retain their attribution and applicable share-alike terms when redistributing.',
    credits: [
      { title: '“The Long Goodbye” — flatwound', url: 'https://ccmixter.org/files/flatwound/14476', license: 'CC BY 2.5', licenseUrl: 'https://creativecommons.org/licenses/by/2.5/' },
      { title: '“Hong Kong Island Night Cityscape 2020” — Bert Brothers', url: 'https://commons.wikimedia.org/wiki/File:Hong_Kong_Island_Night_Cityscape_2020.webm', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/' },
      { title: '“Hong Kong Skyline at Night” — andrew_annemarie (Flickr)', url: 'https://commons.wikimedia.org/wiki/File:Hong_Kong_Skyline_at_Night.webm', license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/' },
      { title: '“Sydney Harbour time lapse March 2021” — SIB technology', url: 'https://commons.wikimedia.org/wiki/File:Sydney_Harbour_time_lapse_March_2021.webm', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/' }
    ],
    audioDescription: 'Instrumental ambient music from the delivered mix; no narration.',
    transcript: 'Instrumental ambient music only. Rain, distant traffic, screen light and aquarium movement animate an otherwise still room.'
  },
  {
    id: 'jaromail', title: 'JaroMail: email comes home', category: 'Software explainers', featured: true,
    format: '16:9', duration: 33, start: 37, posterAt: 16, hasAudio: true, narration: true,
    recipe: '/recipes/software-explainer', edition: 'Complete film · 3 min 47 s', sourceVersion: 'Latest rendered experiment · pixel v4', sourceDuration: '3 min 47 sec',
    description: 'How a Unix mail setup fits together, told with pixel characters, a large terminal and graphics that land on the word being spoken.',
    made: 'The agent read the JaroMail repository at one pinned commit and wrote the script from it. Diagrams and terminal scenes are drawn by code, the voice is synthesised on the machine, and the graphics are keyed to the measured time of the spoken words. The people and addresses in the demonstration are fictional (example.org).',
    shows: 'An explainer whose claims can be traced to the source it was made from. When the software changes, the commit moves and the film is made again from the same files.',
    visual: 'Pixel-art diagrams on a dark indigo field connect a mail server to Fetchmail, Maildir, NeoMutt, msmtp, Notmuch and GnuPG on the user’s machine.',
    technique: 'Repository research · local narration · word-synced Remotion',
    receipt: [
      { label: 'Length', value: '3 min 47 s · 1920 × 1080' },
      { label: 'Made from', value: 'dyne/JaroMail at commit 0aed1f2' },
      { label: 'Picture', value: 'Drawn by code: pixel characters, diagrams, terminal' },
      { label: 'Voice', value: 'Synthesised locally (Qwen3-TTS)' },
      { label: 'Captions', value: 'English, embedded in the full film' },
      { label: 'Licensed material', value: 'pixelarticons (MIT); Syne, JetBrains Mono, Pixelify Sans (OFL)' },
    ],
    source: 'Library / dyne / software / jaromail / jaromail-pixel-v4.mp4',
    credit: 'Source research: dyne/JaroMail at commit 0aed1f2. Dyne pixel character assets; pixelarticons by Gerrit Halfmann (MIT); Syne, JetBrains Mono and Pixelify Sans (OFL). Local Qwen3 narration, synthesised 8-bit effects and the series’ “2-am-debug-loop” soundtrack. Excerpt captions are retimed from the v4 SRT.',
    creditUrl: 'https://github.com/dyne/JaroMail/tree/0aed1f2',
    audioDescription: 'English narration over a quiet electronic music bed and 8-bit effects. English captions are available.',
    transcript: "JaroMail doesn't reinvent email. It wires together tools Unix has trusted for decades. Fetchmail brings new messages down from your server. Each one is saved as a plain file in a Maildir, a format any mail program can read. You read and write in NeoMutt. msmtp sends. Notmuch indexes everything for search, and GnuPG signs and encrypts. And jaro is the glue: one command, on top of small, readable shell scripts."
  },
  {
    id: 'nothing-is-only-one-thing', title: 'Nothing Is Only One Thing', category: 'Visual essays',
    format: '16:9', duration: 31, start: 39, posterAt: 19, hasAudio: true, narration: true,
    recipe: '/recipes/revise-with-confidence', edition: 'Complete film · 3 min 4 s', sourceVersion: 'Latest candidate · V006 · 5 November 2026', sourceDuration: '3 min 4 sec',
    status: 'A review candidate, not an approved release.',
    description: 'An essay on free software and shared culture that turns its own material inside out: an image becomes texture, then data, then geometry you could rebuild.',
    made: 'Generated images and clips meet real things: the source of a frei0r video filter, and that filter running on the film’s own frames. The edit is cut to the words of the narration and the beats of the music.',
    shows: 'A film that was re-edited from the start around a narration that did not change. The earlier cuts are still in the episode; nothing was overwritten to make this one.',
    visual: 'Foam breaks into pixels and traced edges. The source of a frei0r filter appears; those cells rise into a golden landscape in the palm of a hand, before the words USE, STUDY, SHARE and IMPROVE.',
    technique: 'Generated images & clips · real frei0r filters · word- and beat-led Remotion',
    receipt: [
      { label: 'Length', value: '3 min 4 s · 1920 × 1080' },
      { label: 'Picture', value: 'Generated images and clips (Wan 2.2); real frei0r filters and their source' },
      { label: 'Voice', value: 'Synthesised narration, reused unchanged from the previous cut' },
      { label: 'Paid generation', value: '$1.60 recorded in the episode’s journal, over 16 metered calls, across all its cuts' },
      { label: 'Captions', value: 'English and Italian, embedded in the full film' },
      { label: 'Music', value: 'Simio Sakrecoer, “Acid In My Lounge” — CC BY-NC-SA' },
    ],
    source: 'Library / dyne / open-culture / nothing-is-only-one-thing / output/v006',
    credit: 'Dyne / Open Culture. Images generated with Codex and clips with Wan 2.2; real frei0r filters and pixeliz0r.c source. V005 synthetic narration reused unchanged. Music: Simio Sakrecoer, “Acid In My Lounge” (CC BY-NC-SA; licence version not specified). The operator confirmed permission for website publication and full-film downloads. Credit the artist, respect the non-commercial and share-alike terms, and identify any changes when reusing the soundtrack. This soundtrack licence is not a blanket licence for the entire film. English captions retimed from the V006 SRT.',
    creditUrl: 'https://github.com/dyne/frei0r',
    audioDescription: 'English narration over Simio Sakrecoer’s electronic soundtrack. English captions are available.',
    transcript: 'An image becomes texture. Texture becomes data. The shape changes. A trace remains. Material you can inspect, translate, and pass on. Data becomes geometry. A surface can be rebuilt. A rule can be changed. Free software means the freedom to use, study, share and improve it. Not merely permission to look.'
  },
  {
    id: 'underwater', title: 'Below the surface', category: 'Editable 3D',
    format: '16:9', duration: 15, start: 0, posterAt: 4, hasAudio: false, recipe: '/recipes/blender-scene',
    edition: 'Complete study · 15 s', sourceVersion: '15-second Blender study', sourceDuration: '15 sec',
    description: 'Light through a moving ocean surface, and a shark passing under it. Fifteen seconds of Blender, built by script.',
    made: 'The agent wrote the scene as a Python script for Blender, which rebuilds the geometry, the materials and the animation. Cycles rendered it.',
    shows: 'What is kept is the scene, not only the video: the .blend opens in Blender, and a person can move the camera or change the light and render again.',
    visual: 'A pale shark swims below a rippling blue ocean surface, with shifting caustic light across its body.',
    technique: 'Blender · Geometry Nodes · Cycles',
    receipt: [
      { label: 'Length', value: '15 s · silent · published at 720p' },
      { label: 'Picture', value: 'Blender scene built by script: Geometry Nodes, Cycles' },
      { label: 'Paid generation', value: 'None: rendered on the machine' },
      { label: 'Kept', value: 'The editable .blend, beside the render' },
    ],
    source: 'Experiment in ../tests/blender-tutorial-OeQfq-Sc-lM',
    credit: 'Original procedural scene studying Regoliste’s underwater technique. No tutorial footage or third-party shark model is included.',
    creditUrl: 'https://www.youtube.com/watch?v=OeQfq-Sc-lM'
  },
  {
    id: 'sonnet', title: 'A poem becomes a place', category: 'Learning & poetry',
    format: '9:16', duration: 12, start: 14, posterAt: 6, hasAudio: true, narration: true, recipe: '/recipes/poetry-lesson',
    edition: 'Complete film · 54 s · vertical', sourceVersion: 'Sonnet 18 · vertical edition', sourceDuration: '54 sec',
    description: 'Shakespeare’s Sonnet 18 as a vertical lesson: the verse, what it means and a small guide on screen, in one composed frame.',
    made: 'One episode of a series with a fixed format: the room, the type, the guide and the pacing belong to the series, and the episode supplies the poem. The recital is synthesised, with music and effects mixed under it.',
    shows: 'A series: the format is decided once and each poem is an episode made to it. The format belongs to this channel; the studio ships no theme or template of it.',
    visual: 'A luminous museum room with a golden landscape, English verses and explanations, and an illustrated presenter.',
    technique: 'Series design · layered composition · vertical delivery',
    receipt: [
      { label: 'Length', value: '54 s · 1080 × 1920' },
      { label: 'Text', value: 'Sonnet 18, public domain, checked against Project Gutenberg ebook 1041' },
      { label: 'Voice', value: 'Synthesised locally; operator-authorised voices' },
      { label: 'Music and effects', value: '3 licensed works (CC BY 3.0, CC0) and locally synthesised effects: see credits' },
      { label: 'Captions', value: 'English, from the word timings of the recital' },
    ],
    source: 'Library / poesie-al-museo / sala-shakespeare',
    credit: 'Sonnet 18 by William Shakespeare (public-domain text, checked against Project Gutenberg ebook 1041). Generated visual treatment and locally synthesised English recital from Poesie al museo; operator-authorised voices. Music: “Reverie (small theme)” by _ghost, ccMixter, CC BY 3.0, looped and mixed in the source production. Wind and applause are declared CC0 in the channel’s source catalogue. Leaf rustle: nmscher (Freesound 85570), CC0; page turns: SpaceJoe (Freesound 484959), CC0. Shimmer and shadow-whoosh effects are locally synthesised. Original audio retained; the web excerpt adds short edge fades. English captions are derived from the source word timings and final edit offset.',
    credits: [
      { title: '“Reverie (small theme)” — _ghost', url: 'https://ccmixter.org/files/_ghost/25389', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/' },
      { title: '“Ext-amb_Leaves-Rustle-in-tree.aif” — nmscher', url: 'https://freesound.org/people/nmscher/sounds/85570/', license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' },
      { title: '“Page Turns - 4” — SpaceJoe', url: 'https://freesound.org/people/SpaceJoe/sounds/484959/', license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' }
    ],
    audioDescription: 'English recital of Sonnet 18 over the original music and effects. English captions are available.',
    transcript: "lease hath all too short a date: Sometime too hot the eye of heaven shines, And often is his gold complexion dimm'd, And every fair from fair sometime declines, By chance, or nature's changing"
  }
];
