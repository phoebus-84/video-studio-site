import DefaultTheme from 'vitepress/theme';
import HomePage from './components/HomePage.vue';
import ExamplesPage from './components/ExamplesPage.vue';
import RecipesPage from './components/RecipesPage.vue';
import MediaFrame from './components/MediaFrame.vue';
import CopyCommand from './components/CopyCommand.vue';
import './style.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage);
    app.component('ExamplesPage', ExamplesPage);
    app.component('RecipesPage', RecipesPage);
    app.component('MediaFrame', MediaFrame);
    app.component('CopyCommand', CopyCommand);
  }
};
