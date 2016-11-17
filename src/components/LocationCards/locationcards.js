// Based on VueTypeahead
// https://github.com/pespantelis/vue-typeahead

import Vue from 'vue';
import template from './locationcards.html';

import './locationcards.scss';

import LocationCard from 'components/LocationCard/locationcard';
// import weather from 'helpers/weather';

export default Vue.extend({
  template,
  components: {
    LocationCard
  },
  props: [ 'alerts' ],
  data() {
    return {
    };
  },

  computed: {
    hasItems() {
      return this.alerts.length > 0;
    }
  },

  methods: {
    update() {

    },

    reset() {

    }
  }
});
