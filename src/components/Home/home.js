import Vue from 'vue';
import template from './home.html';

import weather from 'helpers/weather';

console.log(weather);

export default Vue.extend({
  template,
  data: function() {
    return {
      // weather: weather
    };
  },
  methods: {
    search: function() {
      weather.getCities('Buda', 4).then(
        (data) => {
          // success yay
          console.log(data);
        },
        (data) => {
          // fail nooo
          console.log(data);
        }
      );
    }
  }
});
