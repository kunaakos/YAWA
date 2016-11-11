import Home from 'components/Home/home';
import Login from 'components/Login/login';
import NotFound from 'components/NotFound/notFound';

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '*',
    component: NotFound
  }
];

export default routes;
