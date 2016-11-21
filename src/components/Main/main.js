import Vue from 'vue';
import template from './main.html';

import LocationSearch from 'components/LocationSearch/locationsearch';
import LocationCards from 'components/LocationCards/locationcards';

import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'Main',
  template,
  components: {
    LocationSearch,
    LocationCards
  },
  computed: mapGetters({
    alerts: 'db_getAlerts',
    hasItems: 'db_hasItems'
  }),
  methods: {
  }
});
