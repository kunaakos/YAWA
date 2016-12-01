import Vue from 'vue';
import template from './main.html';

import LocationSearch from 'components/LocationSearch/locationsearch';
import LocationCard from 'components/LocationCard/locationcard';

import draggable from 'vuedraggable';

import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'Main',
  template,
  components: {
    draggable,
    LocationSearch,
    LocationCard
  },
  data() {
    return {
      newAlertKeyArray: []
    };
  },
  computed: mapGetters({
    alertKeyArray: 'db_getAlertKeyArray',
    hasItems: 'db_hasItems'
  }),
  methods: {
    updateKeyArray() {
      this.$store.dispatch('db_setAlertKeyArray', this.newAlertKeyArray);
    }
  },
  created() {
    var self = this;
    this.$watch('alertKeyArray', function(newVal) {
      self.newAlertKeyArray = newVal.slice();
    });
  }
});
