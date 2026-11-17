<script setup>
// A 3D model made from one picture, as it came back on 17 November 2026: a
// test figure, the light quad model (18,889 quads, $0.35), rendered in Blender.
// docs/recipes/create-a-character.md gives the run.
// The renders are named by camera, and the model came back facing +x: the
// front view is the one the right-hand camera took.
import { withBase } from 'vitepress';
const cells = [
  { file: 'model-picture', label: 'The picture', alt: 'A generated picture of a small figure in a blue coat, a yellow scarf and a grey cap, seen from the front.', given: true },
  { file: 'model-front', label: 'The model, front', alt: 'The 3D model made from that picture, seen from the front.' },
  { file: 'model-side', label: 'Side', alt: 'The same model from the side: the cap, the scarf and the coat have depth the picture did not show.' },
  { file: 'model-back', label: 'Back', alt: 'The same model from behind, a side the picture never showed.' },
  { file: 'model-three-quarter', label: 'From above', alt: 'The same model from above and to one side.' },
];
</script>
<template>
  <ol class="model-strip" aria-label="One picture, and the 3D model made from it, from four sides.">
    <li v-for="cell in cells" :key="cell.file" :class="{ given: cell.given }">
      <img :src="withBase('/proof/' + cell.file + '.jpg')" :alt="cell.alt" width="480" height="480" loading="lazy" decoding="async">
      <span>{{ cell.label }}</span>
    </li>
  </ol>
</template>
