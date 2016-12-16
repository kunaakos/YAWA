import Vue from 'vue';
import template from './overlay.html';

import './overlay.scss';

import Loader from 'components/Loader/loader';

export default Vue.extend({
  name: 'Overlay',
  template,

  components: {
    Loader
  },

  computed: {
    isActive() {
      return this.$store.state.app.overlay.active;
    },
    isClickable() {
      return !!this.$store.state.app.overlay.callback;
    },
    isLoading() {
      return this.$store.state.app.overlay.loading;
    }
  },

  methods: {
    clicked() {
      if (this.isClickable) {
        this.$store.state.app.overlay.callback().then(() => {
          this.$store.commit('app_m__overlay_set', false);
        });
      }
    }
  }
});
