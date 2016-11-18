import Vue from 'vue';
import Vuex from 'vuex';

import backend from 'helpers/backend';

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
      backend.login();
    },

    auth_initiateLogout() {
    // auth_initiateLogout({ commit }) {
      return new Promise((resolve, reject) => {
        backend.logout(
          () => {
            // successful logout
            // commit('auth_setUser', null); // double commit?
            resolve();
          },
          (error) => {
            // logout error
            console.log(error);
            reject();
          }
        );
      });
    },

    auth_checkFacebookRedirect() {
    // auth_checkFacebookRedirect({ commit }) {
      return new Promise((resolve, reject) => {
        backend.checkFacebookRedirect(
          () => {
          // (userData) => {
            // commit('auth_setUser', userData); // double commit?
            resolve();
          },
          reject
        );
      });
    }

  },

  getters: {
    auth_isAuthenticated: state => {
      if (state.user) {
        return true;
      } else {
        return false;
      }
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
