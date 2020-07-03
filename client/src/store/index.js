import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    current_user: null,
    selected_scribble: null,
  },
  mutations: {
    setState(state, { name, value }) {
      state[name] = value;
    },
  },
});
