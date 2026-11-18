export const recipePhases = [
  { id: 'prepare', title: 'Before the first episode', text: 'What the films will share: the channel, the material it may use, its cast and its format. Do each when a film needs it.' },
  { id: 'produce', title: 'Make a film', text: 'One recipe per kind of film. Each says what you end with, what the agent runs, what it costs and where it goes wrong.' },
  { id: 'continue', title: 'Keep the work moving', text: 'The second take, and the second person: a correction that stays small, and a handoff that can be verified.' }
];

export const recipes = [
  { slug: 'build-a-channel', phase: 'prepare', title: 'Build a channel with a point of view', category: 'Channel', level: 'Set-up', needs: 'An audience + a promise', text: 'A folder the next film starts from: its promise, its shared sources, voices and cast, a budget, and its own Git repository.' },
  { slug: 'research-and-materials', phase: 'prepare', title: 'Borrow it with its licence', category: 'Archive media', level: 'Set-up', needs: 'A subject + what you may do with the result', text: 'Find pictures, footage and music in free archives. Each file arrives with its licence, its credit and the evidence for both.' },
  { slug: 'create-a-character', phase: 'prepare', title: 'A character people recognise', category: 'Characters', level: 'Set-up', needs: 'A role + the material for a form + voice rights', text: 'A record of who it is, the forms it takes and what each can do, released and pinned to the series that casts it. A voice alone is a form; so is a 3D model made from one picture, given a skeleton, a motion, and filmed.' },
  { slug: 'repeatable-series', phase: 'prepare', title: 'A format worth repeating', category: 'Series', level: 'Development', needs: 'A film you would make again + a second subject', text: 'A pinned template with its compiler and validator. The next episode is a data file checked against it.' },
  { slug: 'first-render', phase: 'produce', title: 'Your first local render', category: 'Getting started', level: 'Five minutes', needs: 'FFmpeg + one browser download', text: 'Six seconds of titles through the real composer, audited. No account, no key, no paid call.' },
  { slug: 'software-explainer', phase: 'produce', title: 'Explain the software, not the hype', category: 'Software', level: 'First real film', needs: 'A repository + a commit + an agent', text: 'A narrated explainer whose every command and claim is checked against one pinned commit, and that can be made again when the code moves.' },
  { slug: 'existing-media', phase: 'produce', title: 'A film from the footage you have', category: 'Film', level: 'No generation', needs: 'Your footage + an agent', text: 'Every clip looked at and logged, a cut at three levels, and a render that redoes only the shots you change.' },
  { slug: 'illustrated-story', phase: 'produce', title: 'An illustrated short', category: 'Storytelling', level: 'Metered', needs: 'A story + an image provider', text: 'Settle the look on three pictures before paying for thirty. Hold the camera, move one thing, cut to the sound.' },
  { slug: 'ambient-world', phase: 'produce', title: 'A place to spend an hour', category: 'Ambient', level: 'Metered', needs: 'A place + music you may use for an hour', text: 'One room in moving layers, a short looping master, then an hour assembled on your machine without encoding the picture again.' },
  { slug: 'music-in-code', phase: 'produce', title: 'Write a score in code', category: 'Music', level: 'Local', needs: 'A Chrome on the machine + an agent', text: 'Procedural music: written as Strudel code, checked without a sound, rendered on your machine at no cost and mixed by measurements. You listen; the agent cannot.' },
  { slug: 'blender-scene', phase: 'produce', title: 'A scene you can open in Blender', category: '3D', level: 'Local', needs: 'Blender + an agent', text: 'An editable scene built by script and directed from cheap previews. You keep the file, not only the video.' },
  { slug: 'poetry-lesson', phase: 'produce', title: 'One poem. Two films.', category: 'Case study', level: 'Case study', needs: 'A prepared channel + a poem', text: 'Inside Poesie al museo: how the preparation behind “Il sabato del villaggio” leads to a vertical recital and a complete lesson.' },
  { slug: 'revise-with-confidence', phase: 'continue', title: 'Change the line. Keep the film.', category: 'Correction', level: 'The second take', needs: 'A rendered episode + a precise correction', text: 'Find what depends on the change, redo only that, keep the delivered render, and compare the two to see nothing else moved.' },
  { slug: 'team-handoff', phase: 'continue', title: 'Pick up where your collaborator left off', category: 'Collaboration', level: 'Two machines', needs: 'Git + an S3-compatible bucket', text: 'Text through Git, media restored by hash, and a check on the other machine that both match.' }
];

export function filterRecipes(query = '') {
  const needle = query.trim().toLowerCase();
  return recipes.filter(recipe => [recipe.title, recipe.category, recipe.needs, recipe.text, recipe.level]
    .join(' ').toLowerCase().includes(needle));
}
