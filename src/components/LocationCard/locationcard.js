// Based on VueTypeahead
// https://github.com/pespantelis/vue-typeahead

import Vue from 'vue';

import Loader from 'components/Loader/loader';
import TempInput from 'components/TempInput/tempinput';

import template from './locationcard.html';
import './locationcard.scss';

import { mixin as clickaway } from 'vue-clickaway';

export default Vue.extend({
  template,
  components: {
    Loader,
    TempInput
  },

  // make sure props aren't camelCase unless you want a bite in the ass when
  // building a production version
  // see: https://vuejs.org/v2/guide/components.html#camelCase-vs-kebab-case
  // note that v-bind:key is reserved for list rendering, so we have to go
  // with the second best option
  props: [ 'fuckey', 'data' ],

  mixins: [ clickaway ],

  computed: {
    weatherConditionsFAIcon() {
      switch (this.data.currentConditions) {
        case 'clear':
          if (this.data.isDark) {
            return 'fa-moon-o';
          } else {
            return 'fa-sun-o';
          }
        case 'cloudy':
          return 'fa-cloud';
        case 'rainy':
          return 'fa-tint';
        case 'thunderstorm':
          return 'fa-bolt';
        case 'snow':
          return 'fa-snowflake-o';
        case 'low-viz':
          return 'fa-low-vision';
        default:
          return 'fa-question';
      }
    },

    isLoading() {
      return !this.data.lastUpdate;
    },

    isOpen() {
      return this.data.isOpen;
    },

    isLit() {
      return this.data.isLit;
    },

    isDark() {
      return this.data.isDark;
    }

  },

  mounted: function() {
    this.update();
  },

  methods: {
    deleteCard() {
      this.$store.dispatch('card__cards_delete', this.fuckey);
    },

    setMaxThresh(val) {
      this.$store.dispatch('card__cards_thresh_set', {
        'key': this.fuckey,
        'type': 'maxC',
        'val': val
      });
    },

    setMinThresh(val) {
      this.$store.dispatch('card__cards_thresh_set', {
        'key': this.fuckey,
        'type': 'minC',
        'val': val
      });
    },

    toggle() {
      this.$store.commit('card_m__cards_toggle', this.fuckey);
    },

    close() {
      if (this.data.isOpen) {
        this.$store.commit('card_m__cards_close', this.fuckey);
      }
    },

    update() {
      this.$store.dispatch('card__cards_weatherUpdate', this.fuckey);
    }
  }
});
