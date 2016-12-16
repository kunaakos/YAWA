import Vue from 'vue';

import Navigation from 'components/Navigation/navigation';
import Overlay from 'components/Overlay/overlay';

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
    Overlay
  },

  computed: {
    menuOpen() {
      return store.state.app.menu;
    },
    triggerHidden() {
      return store.state.app.trigger.hidden;
    }
  },

  methods: {
    toggle() {
      store.dispatch('app__setMenu', !this.menuOpen);
      store.dispatch('app__setOverlay', this.menuOpen);
    }
  },

  created: function(){
  }

});
