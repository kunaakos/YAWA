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
