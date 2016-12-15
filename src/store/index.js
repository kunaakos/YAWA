import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import auth from './auth';
import card from './card';

const app = {
  state: {
    loading: false,
    open: false
  },
  mutations: {
    app_setLoadingState(state, loadingState) {
      state.loading = loadingState;
    },
    app_toggleOpenState(state) {
      state.open = !state.open;
    }
  }
};

const store = new Vuex.Store({
  modules: {
    app,
    auth,
    card
  }
});

export default store;
