import Vue from 'vue';
import template from './home.html';

import CitySearch from 'components/CitySearch/citysearch';
import CityCards from 'components/CityCards/citycards';

class Alert {
  constructor(cityId) {
    this.cityId = cityId;
  }
}

export default Vue.extend({
  template,
  components: {
    CitySearch,
    CityCards
  },
  data: function() {
    return {
      alerts: []
    };
  },
  created: function(){
    // add some cards
    // 3054643 is Budapest
    this.alerts.push(new Alert(3054643));
    // 665000 is Budaors
    this.alerts.push(new Alert(665000));
    // 3449741 is Santiago
    this.alerts.push(new Alert(3449741));
  },
  methods: {
    gotResultID: function(resultID) {
      if (this.alerts.filter(function(alert) { return alert.cityId === resultID; }).length === 0 && resultID !== 0) {
        this.alerts.push(new Alert(resultID));
      }
    }
  }
});
