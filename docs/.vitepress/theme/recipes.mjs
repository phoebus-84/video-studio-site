export const recipePhases = [
  { id: 'prepare', title: 'Before the first episode', text: 'Develop the idea together. Research, compare directions, prepare the cast and prove a format you can return to.' },
  { id: 'produce', title: 'Make a film', text: 'Put the preparation to work. Each guide follows the material, the choices and the checks—not just the opening prompt.' },
  { id: 'continue', title: 'Keep the work moving', text: 'Make a correction or bring in a collaborator without losing the decisions and sources that made the film.' }
];

export const recipes = [
  { slug: 'build-a-channel', phase: 'prepare', title: 'Build a channel with a point of view', category: 'Channel', level: 'Development', needs: 'An idea + an audience + an agent', text: 'Research the audience, compare creative proposals and turn your choices into a world worth returning to.' },
  { slug: 'research-and-materials', phase: 'prepare', title: 'Gather a world, not a folder', category: 'Research', level: 'Development', needs: 'A question + your sources', text: 'Bring references and material. Let the agent research the gaps, then choose what the films will actually use.' },
  { slug: 'create-a-character', phase: 'prepare', title: 'A character people recognise', category: 'Characters', level: 'Development', needs: 'A role + visual and voice references', text: 'Compare identities, audition a voice and test the character in a real scene. Keep a cast you can use again.' },
  { slug: 'repeatable-series', phase: 'prepare', title: 'A format worth repeating', category: 'Series', level: 'Development', needs: 'A channel direction or a reviewed pilot', text: 'Develop the format, review a pilot and prove it with a second subject before making it a production standard.' },
  { slug: 'first-render', phase: 'produce', title: 'Your first local render', category: 'Getting started', level: 'Beginner', needs: 'FFmpeg + a browser download', text: 'Render a six-second title sequence through the real composer. No API keys, no library assets, no paid generation.' },
  { slug: 'poetry-lesson', phase: 'produce', title: 'One poem. Two films.', category: 'Education', level: 'Case study', needs: 'A prepared channel + a poem', text: 'Inside Poesie al museo: how the preparation behind “Il sabato del villaggio” leads to a vertical recital and a complete lesson.' },
  { slug: 'existing-media', phase: 'produce', title: 'A film from the footage you have', category: 'Editing', level: 'Beginner', needs: 'Your media + an agent', text: 'Review the material, compare two possible stories and shape an edit before adding polish or buying new assets.' },
  { slug: 'illustrated-story', phase: 'produce', title: 'An illustrated short', category: 'Storytelling', level: 'Intermediate', needs: 'An agent + images', text: 'Find the story’s turn, compare visual treatments and test the character before producing the full sequence.' },
  { slug: 'ambient-world', phase: 'produce', title: 'A place to spend an hour', category: 'Ambient', level: 'Intermediate', needs: 'A scene + motion + a licensed soundtrack', text: 'Research a place, choose its atmosphere and prove the motion and sound in a short master before extending it.' },
  { slug: 'software-explainer', phase: 'produce', title: 'Explain the software, not the hype', category: 'Software', level: 'Intermediate', needs: 'A source repository + an agent', text: 'Choose a real user task, verify it against the source and develop a visual explanation a newcomer can follow.' },
  { slug: 'blender-scene', phase: 'produce', title: 'A scene you can open in Blender', category: '3D', level: 'Intermediate', needs: 'Blender + an agent', text: 'Turn a technique reference into an original scene. Direct the light and movement, then keep the editable source.' },
  { slug: 'revise-with-confidence', phase: 'continue', title: 'Change the line. Keep the film.', category: 'Editing', level: 'Intermediate', needs: 'An existing rendered episode', text: 'Turn feedback into a bounded change, agree what it affects and compare the new render with the version you delivered.' },
  { slug: 'team-handoff', phase: 'continue', title: 'Pick up where your collaborator left off', category: 'Collaboration', level: 'Intermediate', needs: 'Git + an S3-compatible remote', text: 'Hand over the creative decisions as well as the files. Restore the media by hash and verify the project on a second machine.' }
];

export function filterRecipes(query = '') {
  const needle = query.trim().toLowerCase();
  return recipes.filter(recipe => [recipe.title, recipe.category, recipe.needs, recipe.text, recipe.level]
    .join(' ').toLowerCase().includes(needle));
}
