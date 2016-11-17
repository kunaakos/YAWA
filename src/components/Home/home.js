import Vue from 'vue';
import template from './home.html';

import LocationSearch from 'components/LocationSearch/locationsearch';
import LocationCards from 'components/LocationCards/locationcards';

class Alert {
  constructor(owmCityId) {
    this.owmCityId = owmCityId;
  }
}

export default Vue.extend({
  name: 'Home',
  template,
  components: {
    LocationSearch,
    LocationCards
  },
  data: function() {
    return {
      alerts: []
    };
  },
  created: function(){
    // add some locations
    // 3054643 is Budapest
    this.alerts.push(new Alert(3054643));
    // 665000 is Budaors
    this.alerts.push(new Alert(665000));
    // 3449741 is Santiago
    this.alerts.push(new Alert(3449741));
  },
  methods: {
    gotResultID: function(resultID) {
      if (this.alerts.filter(function(alert) { return alert.owmCityId === resultID; }).length === 0 && resultID !== 0) {
        this.alerts.push(new Alert(resultID));
      }
    }
  }
});
