// Based on VueTypeahead
// https://github.com/pespantelis/vue-typeahead

import Vue from 'vue';

import Loader from 'components/Loader/loader';

import template from './locationcard.html';
import './locationcard.scss';

import weather from 'helpers/weather';
import store from 'src/store';

import { mixin as clickaway } from 'vue-clickaway';

export default Vue.extend({
  template,
  components: {
    Loader
  },
  mixins: [ clickaway ],
  props: [ 'cardKey' ],
  data() {
    return {
      state: {
        gotWeatherData: false,
        loading: true,
        open: false
      },
      data: {
        name: null,
        currentTemp: null,
        description: null,
        conditions: null,
        night: null
      }
    };
  },

  computed: {
    remoteData() {
      return this.$store.getters.db_getCards[this.cardKey];
    },
    weatherConditionsFAIcon() {
      switch (this.data.description) {
        case 'clear':
          if (this.data.night) {
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
    }
  },

  created: function() {
    var self = this;
    weather.getWeatherDataById(this.remoteData.owmCityId).then(
      (data) => {
        // success yay
        self.data.name = data.name;
        self.data.currentTemp = data.currentTemp;
        self.data.description = data.description;
        self.data.night = data.night;
        self.state.gotWeatherData = true;
        self.state.loading = false;
      },
      (data) => {
        // fail nooo
        console.log(data);
      }
    );
  },

  methods: {
    deleteCard() {
      store.dispatch('db_deleteCard', this.cardKey);
    },

    toggleOpen() {
      this.state.open = !this.state.open;
    },

    close() {
      this.state.open = false;
    },

    update() {
      // NOT IMPLEMENTED
    }
  }
});
