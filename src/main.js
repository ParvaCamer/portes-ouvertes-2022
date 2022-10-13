import { createApp } from 'vue';
import router from './router.js';
import App from './App.vue';
import db from './firebase.js';

import TheHeader from './components/layout/TheHeader.vue';
import TheFooter from './components/layout/TheFooter.vue';
import BaseCard from './components/ui/BaseCard.vue';
import PropositionAnswer from './components/ui/PropositionAnswer.vue';
import BaseButton from './components/ui/BaseButton.vue';
import ValidateButton from './components/ui/ValidateButton.vue';
import PlayCard from './components/activity/PlayCard.vue';
import Activitefinie from './pages/Jouer/Activitefinie.vue';
import BaseDialog from './components/ui/BaseDialog.vue';
import BaseSpinner from './components/ui/BaseSpinner.vue';

const app = createApp(App);

app.use(router);
app.use(db);

app.component('the-header', TheHeader);
app.component('the-footer', TheFooter);
app.component('base-card', BaseCard);
app.component('proposition-answer', PropositionAnswer);
app.component('base-button', BaseButton);
app.component('validate-button', ValidateButton);
app.component('play-card', PlayCard);
app.component('activite-finie', Activitefinie);
app.component('base-dialog', BaseDialog);
app.component('base-spinner', BaseSpinner);
app.mount('#app');