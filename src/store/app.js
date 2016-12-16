const app = {
  state: {
    menu: false,
    overlay: {
      active: false,
      loading: false,
      onClick: null,
    },
    trigger: {
      hidden: false
    }
  },

  // action name pattern: app__[action]
  actions: {

    // used by router only, allowed to not give shits about raised elements
    app__setLoading(context, val) {
      if (val === true) {
        context.commit('app_m__overlay_set', {
          loading: true
        });
      } else if (val === false) {
        context.commit('app_m__overlay_set', false);
      }
    },

    // (de)activate overlay
    app__setOverlay(context, options) {

      if (context.state.overlay.onClick) {
        context.state.overlay.onClick().then(() => {
          context.commit('app_m__overlay_set', options);
        });
        // TODO: handle error
        return;
      }

      context.commit('app_m__overlay_set', options);

    },

    // open/close menu
    app__setMenu(context, option) {
      context.commit('app_m__menu_set', option);
    }
  },

  // mutation name pattern: app_m__[property]_[action]
  mutations: {
    app_m__menu_set(state, option) {
      state.menu = !!option;
    },
    app_m__overlay_set(state, options) {
      if (options) {
        state.overlay.onClick = options.onClick || null;
        state.overlay.loading = options.loading || false;
        state.trigger.hidden = options.hideTrigger || false;
        state.overlay.active = true;
      } else {
        state.overlay = {
          active: false,
          loading: false,
          onClick: null
        };
        state.trigger.hidden = false;
      }
      // TODO: validate!
    }
  },

  // getter name pattern: app_g__[property]
  getters: {
    // app_g__loader: state => {
    //
    // }
  }
};

export default app;
