import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import app from './app';
import auth from './auth';
import card from './card';

const store = new Vuex.Store({
  modules: {
    app,
    auth,
    card
  }
});

export default store;
