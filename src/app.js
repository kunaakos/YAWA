import Vue from 'vue';

import Navigation from 'components/Navigation/navigation';
import Loader from 'components/Loader/loader';

import router from 'src/router';
import store from 'src/store';

import 'src/style.scss';

export const PubSub = new Vue();

export const App = new Vue({
  router,
  store,
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
