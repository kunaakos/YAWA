import Vue from 'vue';

import Navigation from 'components/Navigation/navigation';
import Loader from 'components/Loader/loader';

import router from 'src/router';
import store from 'src/store';

import 'src/styles/main.scss';

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
    }
  },

  created: function(){
  }
  
});
