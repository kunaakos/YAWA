import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import VueFire from 'vuefire';

import Navigation from 'components/Navigation/navigation';
import Loader from 'components/Loader/Loader';

Vue.use(VueFire);
Vue.use(VueRouter);
Vue.use(VueResource);

import { routes, authGate } from 'src/routes';
import 'src/style.scss';

export const PubSub = new Vue();

export const router = new VueRouter({
  routes,
  mode: 'history',
  linkActiveClass: 'active'
});

router.beforeEach((to, from, next) => {
  authGate(to, from, next);
});

export const App = new Vue({
  router,

  el: '#app',

  components: {
    Navigation,
    Loader
  },

  data: {
    loaderState: true
  },

  created: function(){
    PubSub.$on('toggleLoader', (loaderState) => {
      this.loaderState = loaderState;
    });
  }

});
