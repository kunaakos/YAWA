import firebaseHelper from 'helpers/firebase';

const auth = {
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

    auth_initiateFbLogin() {
      // redirects to facebook, kills app, no need to handle anything
      firebaseHelper.fbLogin();
    },

    auth_initiateAnonLogin() {
      // no redirect!
      return firebaseHelper.anonLogin();
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

export default auth;
