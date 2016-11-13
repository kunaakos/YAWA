import Home from 'components/Home/home';
import User from 'components/User/user';
import NotFound from 'components/NotFound/notFound';

import { PubSub } from 'src/main';

import auth from './helpers/auth';

// guard/filter that checks for authentication
function checkAuth(to, from, next) {
  // ye olde loader
  PubSub.$emit('toggleLoader', true);

  var redirectToLogin = (to.path !== '/login');

  if (!auth.check()) {
    var cbSuccess = function() {
      PubSub.$emit('toggleLoader', false);
      console.log('sucessfully logged in adter redirect!');
      next();
    };
    var cbFail = function() {
      console.log('no facebook login redirect data');
      if (redirectToLogin) {
        console.log('redirecting to login page...');
        next({
          path: '/login'
        });
      } else {
        PubSub.$emit('toggleLoader', false);
        next();
      }
    };
    auth.checkRedirect(cbSuccess, cbFail);
  } else {
    console.log('authOk');
    PubSub.$emit('toggleLoader', false);
    next();
  }
}

const routes = [
  {
    path: '/',
    component: Home,
    beforeEnter: checkAuth
  },
  {
    path: '/login',
    component: User,
    beforeEnter: checkAuth
  },
  {
    path: '/user',
    component: User,
    beforeEnter: checkAuth
  },
  {
    path: '*',
    component: NotFound
  }
];

export default routes;
