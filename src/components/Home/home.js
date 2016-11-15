import Vue from 'vue';
import template from './home.html';

import CitySearch from 'components/CitySearch/citysearch';

// import weather from 'helpers/weather';

// console.log(weather);

export default Vue.extend({
  template,
  components: {
    CitySearch
  },
  data: function() {
    return {
      // weather: weather
    };
  },
  methods: {
    search: function() {
      // weather.getCities('Buda', 4).then(
      //   (data) => {
      //     // success yay
      //     console.log(data);
      //   },
      //   (data) => {
      //     // fail nooo
      //     console.log(data);
      //   }
      // );
    }
  }
});
