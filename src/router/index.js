import Vue from 'vue';
import VueRouter from 'vue-router';

import Main from 'components/Main/main';
import Settings from 'components/Settings/settings';
import Login from 'components/Login/login';

import store from 'src/store';

Vue.use(VueRouter);

// restricts access for unauthd users
function routeGuard(to, from, next) {
  // check if route requires authorization, and if user is authd
  if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.auth_isAuthenticated) {
    // not authenticated, redirect to login
    next({ path: '/login' });
    store.commit('app_setLoadingState', false);
  } else {
    // can proceed
    next();
    store.commit('app_setLoadingState', false);
  }
}

// handles fb login redirects, keeps authenticated users away from login page
function doLogin(to, from, next) {
  if (store.getters.auth_isAuthenticated) {
    // if already logged in go to home page instead
    next({ path: '/' });
  } else {
    store.dispatch('auth_checkFacebookRedirect').then(
      () => { next({ path: '/' }); }, // successful login, redirect to Main
      () => { next(); }               // no redirect data, stay at login page
    );
  }
}

const routes = [
  {
    path: '/',
    component: Main,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: Login,
    beforeEnter: doLogin,
  },
  {
    path: '/settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: '*',
    component: Main
  }
];

const router = new VueRouter({
  routes,
  mode: 'history',
  linkActiveClass: 'active'
});

router.beforeEach((to, from, next) => {
  // start by showing ye olde loader
  store.commit('app_setLoadingState', true);

  // check auth module state
  if (store.getters.auth_isInitialized) {
    // we can move on it it's initialized
    routeGuard(to, from, next);
  } else {
    // we have to wait until it initiliazes if it isn't
    var stopWatching = store.watch((value) => {
      if (value.auth.initialized) {
        stopWatching();
        console.log('what');
        routeGuard(to, from, next);
      }
    });
  }
});

export default router;
