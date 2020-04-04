import axios from 'axios';
import Vue from 'vue';
import VueRouter from 'vue-router';

import { call } from '../lib';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import(/* webpackChunkName: "index" */ '../views/Index.vue'),
    meta: { guest: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
    meta: { authorized: true },
  },
  {
    path: '/scribbles/new',
    name: 'create_scribble',
    component: () => import(/* webpackChunkName: "create_scribble" */ '../views/CreateScribble.vue'),
    meta: { authorized: true },
  },
  {
    path: '/scribbles/:id',
    name: 'show_scribble',
    component: () => import(/* webpackChunkName: "show_scribble" */ '../views/ShowScribble.vue'),
    meta: { authorized: true },
  },
  {
    path: '/logout',
    name: 'logout',
    beforeEnter: async (to, from, next) => {
      await call(axios.get('/api/logout'));
      next('/');
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  // If the user is logged in, `data` will contain the user's information.
  // If the user isn't logged in, a 401 Unauthorized error will be returned.
  const [err, data] = await call(axios.get('/api/users/me'));
  if (data) {
    store.commit('setCurrentUser', data.data.content);
  } else {
    store.commit('setCurrentUser', {});
  }

  // If the requested route is guest-only and the user is logged in
  if (to.matched.some((record) => record.meta.guest) && data) {
    return next('/dashboard');
  }

  // If the requested route needs authorization and the user is not logged in
  if (to.matched.some((record) => record.meta.authorized) && err) {
    return next({ path: '/', query: { n: to.fullPath } });
  }

  next();
});

export default router;
