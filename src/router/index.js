import Vue from 'vue';
import VueRouter from 'vue-router';

import Locations from 'components/Locations/locations';
import Settings from 'components/Settings/settings';
import Login from 'components/Login/login';

import store from 'src/store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Locations,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: '*',
    redirect: '/'
  }
];

const router = new VueRouter({
  routes,
  mode: 'history',
  linkActiveClass: 'active'
});

router.beforeEach((to, from, next) => {

  // start by showing ye olde loader
  store.dispatch('app__setLoading', true);

  // just to keep things readable
  const destRequiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const destIsLogin = (to.path === '/login');
  const authInitialized = function() { return store.getters.auth_isInitialized; };
  const userAuthenticated = function() { return store.getters.auth_isAuthenticated; };

  function keepMoving() {
    if (destRequiresAuth && !userAuthenticated()) {
      // not authenticated, redirect to login
      next({ path: '/login' });
      store.dispatch('app__setLoading', false);
    } else if (destIsLogin && userAuthenticated()) {
      // authenticated user heading for login page
      next({ path: '/' });
    } else {
      // can proceed
      next();
      store.dispatch('app__setLoading', false);
    }
  }

  // we have to wait until auth initiliazes for route filtering to work
  if (authInitialized()) {
    keepMoving();
  } else {
    var stopWatching = store.watch((value) => {
      if (value.auth.initialized) {
        stopWatching();   // dat subtle joke
        keepMoving();     // (￣～￣）
      }
    });
  }

});

export default router;
