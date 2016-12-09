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
      localOrder: []
    };
  },

  computed: mapGetters({
    order: 'card_g__order',
    cards: 'card_g__cards'
  }),

  methods: {
    setOrder() {
      // commit the modified card order array
      this.$store.dispatch('card__order_set', this.localOrder);
    }
  },

  mounted: function() {
    // vuedraggable needs a local copy of the card order array beause it
    // can't deal with vuex
    this.localOrder = this.order;
    // we set up a watcher to update this local array if the card order
    // changes in the store
    var self = this;
    this.$watch('order', function(newVal) {
      self.localOrder = newVal.slice();
    });
  }
});
