// Based on VueTypeahead
// https://github.com/pespantelis/vue-typeahead

import Vue from 'vue';

import Loader from 'components/Loader/loader';
import TempInput from 'components/TempInput/tempinput';

import template from './locationcard.html';
import './locationcard.scss';

export default Vue.extend({
  name: 'LocationCard',
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

  data() {
    return {
      isOpen: false,
      isRaised: false
    };
  },

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

    isDark() {
      return this.data.isDark;
    },

    isLit() {
      return this.data.isLit;
    },

    isLow() {
      return this.data.tempThresholds.minC !== false && (this.data.currentTemp < this.data.tempThresholds.minC);
    },

    isHigh() {
      return this.data.tempThresholds.maxC !== false && (this.data.currentTemp > this.data.tempThresholds.maxC);
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

    update() {
      this.$store.dispatch('card__cards_weatherUpdate', this.fuckey);
    },

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    open() {
      if (!this.isOpen) {
        this.isOpen = true;
        this.isRaised = true;
        this.$store.dispatch('app__setOverlay', {
          raisedEl: this.$el,
          cb: this.extClose
        });
      }
    },

    close() {
      if (this.isOpen) {
        this.$store.dispatch('app__setOverlay', false);
        this.extClose();
      }
    },

    extClose() {
      this.isOpen = false;
      this.isRaised = false;
    }

  }
});
