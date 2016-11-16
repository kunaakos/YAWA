// Based on VueTypeahead
// https://github.com/pespantelis/vue-typeahead

import Vue from 'vue';
import template from './citycards.html';

import './citycards.scss';

import CityCard from 'components/CityCard/citycard';
// import weather from 'helpers/weather';

export default Vue.extend({
  template,
  components: {
    CityCard
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
