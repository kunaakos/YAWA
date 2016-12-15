import Vue from 'vue';
import template from './locations.html';

import './locations.scss';

import LocationSearch from 'components/LocationSearch/locationsearch';
import LocationCard from 'components/LocationCard/locationcard';

import draggable from 'vuedraggable';

import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'Locations',
  template,
  components: {
    draggable,
    LocationSearch,
    LocationCard
  },

  data() {
    return {
      dragging: false,
      scrolledEnough: false,
      stickySize: 0,
      localOrder: [],
      dangerZone: []
    };
  },

  computed: {
    hasScrolledEnough() {
      return this.scrolledEnough;
    },

    ...mapGetters({
      order: 'card_g__order',
      cards: 'card_g__cards'
    })
  },

  methods: {
    dragStart() {
      this.dragging = true;
    },

    dragEnd() {
      this.dragging = false;
      this.$store.dispatch('card__order_set', this.localOrder);
      // TODO: shouldn't dispatch if element was deleted, since it's not visible locally, going to be removed from remote automatically
    },

    dangerZoneAdd(event) {
      // card was AADDDED TOOO THHEE DANGERR ZONE ... erm we delete it
      this.$store.dispatch('card__cards_delete', this.dangerZone[event.newIndex]);
    },

    checkScroll(event) {
      if (event.target.scrollTop >= 42) {
        this.scrolledEnough = true;
      } else if (this.scrolledEnough) {
        this.scrolledEnough = false;
      }
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

    this.stickySize = this.$el.querySelector('.sticky').clientHeight;
    // console.log(this.$el.querySelector('.sticky'));
  }
});
