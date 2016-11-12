import Home from 'components/Home/home';
import Login from 'components/Login/login';
import NotFound from 'components/NotFound/notFound';

import auth from './helpers/auth';

// guar/filter that checks for authentication
function checkAuth(to, from, next) {
  // redirect to login page if not authenticated, avoid looping
  if (!auth.check() && to.path !== '/login') {
    console.log('redirect to login');
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
    component: Login,
    beforeEnter: checkAuth
  },
  {
    path: '*',
    component: NotFound
  }
];

export default routes;
