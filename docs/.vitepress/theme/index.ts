import DefaultTheme from 'vitepress/theme';
import HomePage from './components/HomePage.vue';
import ExamplesPage from './components/ExamplesPage.vue';
import RecipesPage from './components/RecipesPage.vue';
import MediaFrame from './components/MediaFrame.vue';
import CopyCommand from './components/CopyCommand.vue';
import TakeStrip from './components/TakeStrip.vue';
import ModelStrip from './components/ModelStrip.vue';
import RigStrip from './components/RigStrip.vue';
import ScoreAudio from './components/ScoreAudio.vue';
import RecipeFilm from './components/RecipeFilm.vue';
import './style.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage);
    app.component('ExamplesPage', ExamplesPage);
    app.component('RecipesPage', RecipesPage);
    app.component('MediaFrame', MediaFrame);
    app.component('CopyCommand', CopyCommand);
    app.component('TakeStrip', TakeStrip);
    app.component('ModelStrip', ModelStrip);
    app.component('RigStrip', RigStrip);
    app.component('ScoreAudio', ScoreAudio);
    app.component('RecipeFilm', RecipeFilm);
  }
};
