// Editorial metadata only. Production media is prepared explicitly, never committed.
export const showcase = [
  {
    id: 'lontano', title: 'Lontano, a dicembre', category: 'Illustrated film', featured: true,
    format: '16:9', duration: 28, start: 151, posterAt: 23, hasAudio: true,
    recipe: '/recipes/illustrated-story', sourceVersion: 'Complete film · v03', sourceDuration: '4 min 14 sec',
    description: 'Two windows across a rain-soaked alley. A world that turns negative when the lights go out. An illustrated film whose gestures, light and cuts follow an original musical score.',
    visual: 'In a pale rose-and-plum negative world, two hands reach towards each other across the rain without quite touching.',
    technique: 'Generated illustrations · procedural animation · music-led editing',
    note: 'The revised complete film, v03—not the earlier one-minute test. A standalone creative experiment, with fixed-camera compositions and selectively animated elements.',
    source: 'Experiment in ../tests/lontano-a-dicembre',
    credit: 'Generated illustrations and procedural animation from the Lontano, a dicembre experiment. Original score composed in Strudel. Shot composition studies reference Tsai Ming-liang; no downloaded trailer footage is included.',
    audioDescription: 'Instrumental piano and strings from the original score; no speech.',
    transcript: 'Instrumental score only. The visual sequence moves into an inverted-colour dream: rain hangs in the air and two hands approach one another across the alley.'
  },
  {
    id: 'ambient-kowloon', title: 'Kowloon, 1987', category: 'Ambient worlds', featured: true,
    format: '16:9', duration: 24, start: 18, posterAt: 12, hasAudio: true,
    recipe: '/recipes/ambient-world', sourceVersion: 'One-hour delivery · 16 October 2026, 10:28', sourceDuration: '1 hour',
    description: 'A room above a rainy city. Neon, traffic, an aquarium and a television move within a carefully held composition. A short master becomes a long-form space to spend time in.',
    visual: 'A warmly lit room looks onto rain-streaked windows and Hong Kong neon; a small television and a lit aquarium bring movement into the foreground.',
    technique: 'Layered motion · reusable master · long-form soundtrack',
    note: 'The latest current delivery in Ambient Through Time: the one-hour Kowloon film, not a cached loop or an earlier master. The excerpt preserves the final soundtrack.',
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
    recipe: '/recipes/software-explainer', sourceVersion: 'Latest rendered experiment · pixel v4', sourceDuration: '3 min 47 sec',
    description: 'A Unix email workflow explained through pixel characters, a large terminal and word-synchronised graphics. The film follows the software’s actual source, rather than inventing a generic product demo.',
    visual: 'Pixel-art diagrams on a dark indigo field connect a mail server to Fetchmail, Maildir, NeoMutt, msmtp, Notmuch and GnuPG on the user’s machine.',
    technique: 'Repository research · local narration · word-synced Remotion',
    note: 'The new pixel-format v4 render from 5 November 2026. It is a format prototype, not the older v3 delivery still named by the episode’s current pointer. Fictional demo addresses use example.org.',
    source: 'Library / dyne / software / jaromail / jaromail-pixel-v4.mp4',
    credit: 'Source research: dyne/JaroMail at commit 0aed1f2. Dyne pixel character assets; pixelarticons by Gerrit Halfmann (MIT); Syne, JetBrains Mono and Pixelify Sans (OFL). Local Qwen3 narration, synthesised 8-bit effects and the series’ “2-am-debug-loop” soundtrack. Excerpt captions are retimed from the v4 SRT.',
    creditUrl: 'https://github.com/dyne/JaroMail/tree/0aed1f2',
    audioDescription: 'English narration over a quiet electronic music bed and 8-bit effects. English captions are available.',
    transcript: "JaroMail doesn't reinvent email. It wires together tools Unix has trusted for decades. Fetchmail brings new messages down from your server. Each one is saved as a plain file in a Maildir, a format any mail program can read. You read and write in NeoMutt. msmtp sends. Notmuch indexes everything for search, and GnuPG signs and encrypts. And jaro is the glue: one command, on top of small, readable shell scripts."
  },
  {
    id: 'nothing-is-only-one-thing', title: 'Nothing Is Only One Thing', category: 'Visual essays',
    format: '16:9', duration: 31, start: 39, posterAt: 19, hasAudio: true, narration: true,
    recipe: '/recipes/revise-with-confidence', sourceVersion: 'Latest candidate · V006 · 5 November 2026', sourceDuration: '3 min 4 sec',
    description: 'An image becomes texture, data and geometry. A film about free software and shared culture turns its own material inside out: generated footage meets real source code, working image filters and an edit driven by words and music.',
    visual: 'Foam breaks into pixels and traced edges. The source of a frei0r filter appears; those cells rise into a golden landscape in the palm of a hand, before the words USE, STUDY, SHARE and IMPROVE.',
    technique: 'Generated images & clips · real frei0r filters · word- and beat-led Remotion',
    note: 'V006 is a complete creative re-edit using the V005 narration, with V003 and V004 preserved. It is a new review candidate, not an approved release; the episode’s current pointer still selects V003. This excerpt shows the image-to-geometry transformation.',
    source: 'Library / dyne / open-culture / nothing-is-only-one-thing / output/v006',
    credit: 'Dyne / Open Culture. Images generated with Codex and clips with Wan 2.2; real frei0r filters and pixeliz0r.c source. V005 synthetic narration reused unchanged. Music: Simio Sakrecoer, “Acid In My Lounge” (CC BY-NC-SA; licence version not specified). The operator confirmed permission for website publication and full-film downloads. Credit the artist, respect the non-commercial and share-alike terms, and identify any changes when reusing the soundtrack. This soundtrack licence is not a blanket licence for the entire film. English captions retimed from the V006 SRT.',
    creditUrl: 'https://github.com/dyne/frei0r',
    audioDescription: 'English narration over Simio Sakrecoer’s electronic soundtrack. English captions are available.',
    transcript: 'An image becomes texture. Texture becomes data. The shape changes. A trace remains. Material you can inspect, translate, and pass on. Data becomes geometry. A surface can be rebuilt. A rule can be changed. Free software means the freedom to use, study, share and improve it. Not merely permission to look.'
  },
  {
    id: 'underwater', title: 'Below the surface', category: 'Editable 3D',
    format: '16:9', duration: 15, start: 0, posterAt: 4, hasAudio: false, recipe: '/recipes/blender-scene',
    sourceVersion: '15-second Blender study', sourceDuration: '15 sec',
    description: 'Light through an animated ocean. A passing shark. A procedural Blender scene that remains a scene—not just a flattened video.',
    visual: 'A pale shark swims below a rippling blue ocean surface, with shifting caustic light across its body.',
    technique: 'Blender · Geometry Nodes · Cycles',
    note: 'Local Blender experiment. Procedural geometry, materials and animation remain editable in the source .blend file.',
    source: 'Experiment in ../tests/blender-tutorial-OeQfq-Sc-lM',
    credit: 'Original procedural scene studying Regoliste’s underwater technique. No tutorial footage or third-party shark model is included.',
    creditUrl: 'https://www.youtube.com/watch?v=OeQfq-Sc-lM'
  },
  {
    id: 'sonnet', title: 'A poem becomes a place', category: 'Learning & poetry',
    format: '9:16', duration: 12, start: 14, posterAt: 6, hasAudio: false, recipe: '/recipes/poetry-lesson',
    sourceVersion: 'Sonnet 18 · vertical edition',
    description: 'Shakespeare’s Sonnet 18 becomes a visual lesson: verse, interpretation and a small on-screen guide share a carefully composed vertical frame.',
    visual: 'A luminous museum room with a golden landscape, English verses and explanations, and an illustrated presenter.',
    technique: 'Series design · layered composition · vertical delivery',
    note: 'A library production in its own channel format. The application does not ship this channel’s theme or templates. Silent visual excerpt.',
    source: 'Library / poesie-al-museo / sala-shakespeare',
    credit: 'Sonnet 18 by William Shakespeare (public-domain text). Generated visual treatment from the Poesie al museo library. Original audio omitted.'
  }
];
