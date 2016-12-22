import Vue from 'vue';
import template from './offcanvas.html';

import './offcanvas.scss';

import Loader from 'components/Loader/loader';

import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'Offcanvas',
  template,

  components: {
    Loader
  },

  data() {
    return {
      navigation: {
        open: false
      }
    };
  },

  computed: {
    ...mapGetters({
      overlay: 'app_g__overlay'
    })
  },

  methods: {

    overlayClick() {
      if (this.overlay.cb) {
        this.overlay.cb();
        this.$store.dispatch('app__setOverlay', false);
      }
    },

    triggerClick() {
      if (this.navigation.open) {
        this.navigation.open = false;
        this.$store.dispatch('app__setOverlay', false);
      } else {
        this.navigation.open = true;
        this.$store.dispatch('app__setOverlay', {
          cb: this.triggerClick
        });
      }
    }

  }
});
