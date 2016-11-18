import Vue from 'vue';
import Vuex from 'vuex';

import firebaseHelper from 'helpers/firebase';

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

  actions: {

    auth_initiateLogin() {
      // redirects to facebook, kills app, no need to handle anything
      firebaseHelper.login();
    },

    auth_initiateLogout() {
      // it's a Promise!
      return firebaseHelper.logout();
    }

  },

  getters: {
    auth_isAuthenticated: state => {
      return !!state.user;
    },
    // we need this for the router
    auth_isInitialized: state => {
      return state.initialized;
    },
    auth_getUser: state => {
      return state.user;
    }
  }
};

const appModule = {
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
    app: appModule,
    auth: authModule
  }
});

export default store;
