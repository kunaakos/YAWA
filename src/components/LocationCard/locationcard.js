// Based on VueTypeahead
// https://github.com/pespantelis/vue-typeahead

import Vue from 'vue';

import Loader from 'components/Loader/loader';

import template from './locationcard.html';
import './locationcard.scss';

import store from 'src/store';

export default Vue.extend({
  template,
  components: {
    Loader
  },
  props: [ 'cardKey' ],

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
      return this.data.isDark;
    },

    isDark() {
      return this.data.isDark;
    },

    data() {
      return store.getters.card_g__cards[this.cardKey];
    }
  },

  created: function() {
    this.update();
  },

  methods: {
    deleteCard() {
      store.dispatch('card__cards_delete', this.cardKey);
    },

    toggleOpen() {
      if (this.isOpen) {
        store.dispatch('card__cards_open', null);
      } else {
        store.dispatch('card__cards_open', this.cardKey);
      }
    },

    close() {

    },

    update() {
      store.dispatch('card__cards_weatherUpdate', this.cardKey);
    }
  }
});
