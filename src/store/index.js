import Vue from 'vue';
import Vuex from 'vuex';
import VuexFire from 'vuexfire';

Vue.use(Vuex);
Vue.use(VuexFire);

import auth from './auth';
import db from './db';

const app = {
  state: {
    loading: false
  },
  mutations: {
    app_setLoadingState(state, loadingState) {
      state.loading = loadingState;
    }
  }
};

const store = new Vuex.Store({
  modules: {
    app,
    auth,
    db
  }
});

export default store;
