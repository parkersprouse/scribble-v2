import axios from 'axios';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import Vue from 'vue';

import './assets/styles/styles.scss';
import './registerServiceWorker';
import router from './router';
import store from './store';
import App from './App.vue';
import Navbar from './components/Navbar.vue';

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.component('navbar', Navbar);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
