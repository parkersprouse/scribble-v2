import axios from 'axios';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import Vue from 'vue';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import './assets/styles/styles.scss';

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
