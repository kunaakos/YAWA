import Home from 'components/Home/home';
import User from 'components/User/user';
import Login from 'components/Login/login';
import NotFound from 'components/NotFound/notFound';

import auth from 'helpers/auth';

import { PubSub } from 'src/main';

// wait until auth is up and running
function authGate(to, from, next){
  // start by showing ye olde loader
  PubSub.$emit('toggleLoader', true);
  // check auth module state
  if (auth.state.initialized) {
    routeGuard(to, from, next);
  } else {
    // we need to wait until it gets its act together before we move on
    PubSub.$once('authStateChanged', function(){
      routeGuard(to, from, next);
    });
  }
}

// restricts access for unauthd users, handles redirects
function routeGuard(to, from, next) {
  console.log('guard');
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.state.loggedIn) {
      next({
        path: '/login'
      });
      PubSub.$emit('toggleLoader', false);
    } else {
      next();
      PubSub.$emit('toggleLoader', false);
    }
  } else {
    next();
    PubSub.$emit('toggleLoader', false);
  }
}

// handles /login stuff
function handleAuth(to, from, next) {
  if (!auth.state.loggedIn) {
    auth.checkRedirect(next, next);
  } else {
    // if already logged in go to user page instead
    next({
      path: '/user'
    });
  }
}

const routes = [
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: Login,
    beforeEnter: handleAuth,
  },
  {
    path: '/user',
    component: User,
    meta: { requiresAuth: true }
  },
  {
    path: '*',
    component: NotFound
  }
];

export { routes, authGate };
