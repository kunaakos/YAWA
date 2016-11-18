import Vue from 'vue';
import Vuex from 'vuex';

// import backend from 'helpers/backend';

Vue.use(Vuex);

const authModule = {
  state: {
    initialized: false,
    user: null
  },
  mutations: {
    auth_setInitState(state, authState) {
      state.initialized = authState;
    },
    auth_setUser(state, user) {
      state.user = user;
    }
  },
  getters: {
    auth_userLoggedIn: state => {
      if (state.user) {
        return true;
      } else {
        return false;
      }
    }
  }
};

const store = new Vuex.Store({
  modules: {
    auth: authModule
  }
});

export default store;
