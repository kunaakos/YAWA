import Vue from 'vue';

import Navigation from 'components/Navigation/navigation';
import Offcanvas from 'components/Offcanvas/offcanvas';

import router from 'src/router';
import store from 'src/store';

import 'src/styles/main.scss';

import VueTouch from 'vue-touch';
Vue.use(VueTouch, { name: 'v-touch' });

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
    Offcanvas
  },

  computed: {

  },

  methods: {

  },

  created: function(){
  }

});
