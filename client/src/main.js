import axios from 'axios';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import Vue from 'vue';
import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap';

import './assets/styles/styles.scss';
import './registerServiceWorker';
import router from './router';
import store from './store';
import App from './App.vue';
import Alert from './components/Alert.vue';
import Navbar from './components/Navbar.vue';

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.component('alert', Alert);
Vue.component('navbar', Navbar);
Vue.component('v-typeahead', VueTypeaheadBootstrap);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
