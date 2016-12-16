// Based on VueTypeahead
// https://github.com/pespantelis/vue-typeahead

import Vue from 'vue';

import Loader from 'components/Loader/loader';
import TempInput from 'components/TempInput/tempinput';

import template from './locationcard.html';
import './locationcard.scss';

import { mixin as clickaway } from 'vue-clickaway';

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

  mixins: [ clickaway ],

  data() {
    return {
      raised: false
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

    isOpen() {
      return this.data.isOpen;
    },

    isLit() {
      return this.data.isLit;
    },

    isDark() {
      return this.data.isDark;
    },

    isLow() {
      return this.data.tempThresholds.minC !== false && (this.data.currentTemp < this.data.tempThresholds.minC);
    },

    isHigh() {
      return this.data.tempThresholds.maxC !== false && (this.data.currentTemp > this.data.tempThresholds.maxC);
    },

    isRaised() {
      return this.raised;
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
      if (this.data.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    open() {
      if (!this.data.isOpen) {
        this.raised = true;
        this.$store.dispatch('app__setOverlay', { 'onClick': this.remoteClose });
        this.$store.commit('card_m__cards_open', this.fuckey);
      }
    },

    close() {
      if (this.data.isOpen) {
        this.$store.dispatch('app__setOverlay', false);
        this.$store.commit('card_m__cards_close', this.fuckey);
        var self = this;
        setTimeout(() => {
          self.raised = false;
        }, 200);
      }
    },

    remoteClose() {
      var self = this;
      return new Promise(function(resolve) {
        self.$store.commit('card_m__cards_close', self.fuckey);
        setTimeout(() => {
          self.raised = false;
        }, 200);
        resolve();
      });
    }

  }
});
