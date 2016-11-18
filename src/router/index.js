import Vue from 'vue';
import VueRouter from 'vue-router';

import Main from 'components/Main/main';
import Settings from 'components/Settings/settings';
import Login from 'components/Login/login';

import backend from 'helpers/backend';

import { PubSub } from 'src/app';

Vue.use(VueRouter);

// wait until auth is up and running
function authGate(to, from, next){
  // start by showing ye olde loader
  PubSub.$emit('toggleLoader', true);
  // check auth module state
  if (backend.auth.initialized) {
    routeGuard(to, from, next);
  } else {
    // we need to wait until it gets its act together before we move on
    PubSub.$once('authStateChanged', function(){
      routeGuard(to, from, next);
    });
  }
}

// restricts access for unauthd users
function routeGuard(to, from, next) {
  // check if route requires authorization, and if user is authd
  if (to.matched.some(record => record.meta.requiresAuth) && !backend.auth.loggedIn) {
    // yep and nope, redirect to login
    next({
      path: '/login'
    });
    PubSub.$emit('toggleLoader', false);
  } else {
    // can proceed
    next();
    PubSub.$emit('toggleLoader', false);
  }
}

// handles /login stuff
function handleAuth(to, from, next) {
  if (!backend.auth.loggedIn) {
    backend.checkFacebookRedirect(next, next);
  } else {
    // if already logged in go to home page instead
    next({
      path: '/'
    });
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
    beforeEnter: handleAuth,
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
  authGate(to, from, next);
});

export default router;
