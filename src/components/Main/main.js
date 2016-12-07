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
      order: []
    };
  },
  computed: mapGetters({
    _order: 'card_g__order',
    cards: 'card_g__cards'
  }),
  methods: {
    setOrder() {
      this.$store.dispatch('card__order_set', this.order);
    }
  },
  created() {
    var self = this;
    this.$watch('_order', function(newVal) {
      self.order = newVal.slice();
    });
  }
});
