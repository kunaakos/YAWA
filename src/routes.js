import Home from 'components/Home/home';
import User from 'components/User/user';
import NotFound from 'components/NotFound/notFound';

import auth from './helpers/auth';

// guar/filter that checks for authentication
function checkAuth(to, from, next) {
  // redirect to login page if not authenticated, avoid looping
  if (!auth.check() && to.path !== '/login') {
    next({
      path: '/login'
    });
  } else {
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
