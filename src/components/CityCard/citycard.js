// Based on VueTypeahead
// https://github.com/pespantelis/vue-typeahead

import Vue from 'vue';
import template from './citycard.html';

import './citycard.scss';

import weather from 'helpers/weather';

export default Vue.extend({
  template,
  props: [ 'alert' ],
  data() {
    return {
      state: {
        gotWeatherData: false,
        loading: true
      },
      name: null,
      currentTemp: null,
      description: null,
      conditions: null,
      night: null
    };
  },

  computed: {
    weatherConditionsFAIcon: function() {
      switch (this.description) {
        case 'clear':
          if (this.night) {
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

  created: function(){
    var self = this;
    weather.getCityById(this.alert.cityId).then(
      (data) => {
        // success yay
        self.name = data.name;
        self.currentTemp = data.currentTemp;
        self.description = data.description;
        self.night = data.night;
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
    update() {

    },

    reset() {

    }
  }
});
