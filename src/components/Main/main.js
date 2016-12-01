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
      newCardKeys: []
    };
  },
  computed: mapGetters({
    cardKeys: 'db_getCardKeys',
    hasCards: 'db_hasCards'
  }),
  methods: {
    updateSortKeys() {
      this.$store.dispatch('db_updateSortKeys', this.newCardKeys);
    }
  },
  created() {
    var self = this;
    this.$watch('cardKeys', function(newVal) {
      self.newCardKeys = newVal.slice();
    });
  }
});
