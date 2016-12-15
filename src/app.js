import Vue from 'vue';

import Navigation from 'components/Navigation/navigation';
import Loader from 'components/Loader/loader';

import router from 'src/router';
import store from 'src/store';

import 'src/styles/main.scss';

import VueTouch from 'vue-touch';
Vue.use(VueTouch);

VueTouch.config.pan = {
  direction: 'horizontal',
  threshold: 5
};

export const App = new Vue({
  router,
  store,
  el: '#app',

  components: {
    Navigation,
    Loader
  },

  computed: {
    isLoading() {
      return store.state.app.loading;
    },
    isOpen() {
      return store.state.app.open;
    }
  },

  methods: {
    toggle() {
      store.commit('app_toggleOpenState');
    }
  },

  created: function(){
  }

});
