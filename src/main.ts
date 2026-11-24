import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { IonicVue } from '@ionic/vue';

import App from './App.vue';
import { router } from './router';
import { createLocalStorageDriver } from './core/storage/storage';
import { createPersistPlugin } from './core/storage/persist.plugin';

/* Ionic core styles */
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* App theme */
import './theme/tokens.css';
import './theme/ionic.css';
import './theme/global.css';

const pinia = createPinia();
pinia.use(createPersistPlugin(createLocalStorageDriver()));

const app = createApp(App).use(IonicVue, { mode: 'md' }).use(pinia).use(router);

router.isReady().then(() => app.mount('#app'));
