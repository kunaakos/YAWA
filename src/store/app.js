const app = {
  state: {
    overlay: {
      active: false,
      loader: false,
      cb: null,
      raisedEl: null
    }
  },

  // action name pattern: app__[action]
  actions: {

    // used by router only, allowed to not give shits about raised elements
    app__setLoading(context, val) {
      if (val === true) {
        context.commit('app_m__overlay_set', {
          loader: true
        });
      } else if (val === false) {
        context.commit('app_m__overlay_set', false);
      }
    },

    // (de)activate overlay
    app__setOverlay(context, options) {
      context.commit('app_m__overlay_set', options);
    }

  },

  // mutation name pattern: app_m__[property]_[action]
  mutations: {
    app_m__overlay_set(state, options) {
      if (options) {
        state.overlay = {
          cb: options.cb || null,
          loader: options.loader || false,
          raisedEl: options.raisedEl || null,
          active: true
        };
      } else {
        state.overlay = {
          active: false,
          loader: false,
          cb: null,
          raisedEl: null
        };
      }
      // TODO: validate!
    }
  },

  // getter name pattern: app_g__[property]
  getters: {
    app_g__overlay: state => {
      return state.overlay;
    }
  }
};

export default app;
