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
      return !!this.$store.state.app.overlay.clickCallback;
    },
    isLoading() {
      return this.$store.state.app.overlay.loading;
    }
  },

  methods: {
    clicked() {
      console.log('clickety clack');
    }
  }
});
