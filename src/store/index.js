import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    auth: {
      initialized: false,
      loggedIn: false,
      user: null
    }
  },
  mutations: {
    setAuthState(state, authState) {
      state.auth.loggedIn = authState;
    }
  }
});
