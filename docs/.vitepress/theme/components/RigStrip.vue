<script setup>
// A generated model given a skeleton, as it was posed on 18 November 2026:
// two test figures, rigged on the real services and posed by pva_rig_sheet.
// The stills are tiles of the tool's own sheets, labels and all; the figures
// have no textures because the test did not pay for them.
// docs/recipes/create-a-character.md gives the runs.
import { withBase } from 'vitepress';
const props = defineProps({ show: { type: String, default: 'poses' } });
const strips = {
  // The second figure, rigged by Hyper3D with core skinning.
  poses: {
    label: 'One picture, and the rig made from its model in five of the poses it was looked at in.',
    cells: [
      { file: 'rig-picture', label: 'The picture', alt: 'A generated picture of a small boy in a short blue jacket and a grey cap, standing with his arms held away from his body and his legs apart.', given: true },
      { file: 'rig-rest', label: 'The rig, at rest', alt: 'The 3D model made from that picture, untextured, standing as it was drawn.' },
      { file: 'rig-arms-up', label: 'Arms up', alt: 'The same model with both arms raised above its head. The shoulders and the jacket keep their shape.' },
      { file: 'rig-reach', label: 'Reach', alt: 'The same model with both arms brought forward and bent at the elbow.' },
      { file: 'rig-step', label: 'Step', alt: 'The same model from the side, one leg lifted forward with the knee bent, the other behind.' },
      { file: 'rig-bow', label: 'Bow', alt: 'The same model bent forward from the waist.' },
    ],
  },
  // The walk Meshy adds to every rig, on the second figure.
  walk: {
    label: 'Six moments of the walk that came with a rig.',
    cells: [0, 1, 2, 3, 4, 5].map(moment => ({ file: 'walk-' + moment, label: (moment * 0.17).toFixed(2) + ' s', alt: moment === 0 ? 'The untextured model in mid-stride, seen from three-quarter.' : '' })),
  },
  // The same engine, the same pose, the two ways the figure was drawn.
  drawn: {
    label: 'One figure drawn two ways, each rigged by the same engine and asked to raise its arms.',
    cells: [
      { file: 'drawn-coat', label: 'Drawn in a long coat, arms at its sides: 810 edges torn', alt: 'A model of a boy in a long coat with its arms raised: the coat has come up with the arms in two sheets, like wings.', given: true },
      { file: 'drawn-apose', label: 'Drawn in a short jacket, arms away from the body: 3 edges torn', alt: 'A model of the same boy in a short jacket with its arms raised cleanly above its head.' },
    ],
  },
};
const strip = strips[props.show] ?? strips.poses;
</script>
<template>
  <ol class="model-strip" :class="'cells-' + strip.cells.length" :aria-label="strip.label">
    <li v-for="cell in strip.cells" :key="cell.file" :class="{ given: cell.given }">
      <img :src="withBase('/proof/' + cell.file + '.jpg')" :alt="cell.alt" width="480" height="480" loading="lazy" decoding="async">
      <span>{{ cell.label }}</span>
    </li>
  </ol>
</template>
