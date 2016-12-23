import Vue from 'vue';
import template from './locations.html';

import './locations.scss';

import LocationSearch from 'components/LocationSearch/locationsearch';
import LocationCard from 'components/LocationCard/locationcard';
import Loader from 'components/Loader/loader';

import draggable from 'vuedraggable';

import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'Locations',
  template,
  components: {
    draggable,
    LocationSearch,
    LocationCard,
    Loader
  },

  data() {
    return {
      draggableOptions: {
        delay: 100,
        animation: 200,
        handle: '.drag-handle',
        group: 'locationCards'
      },
      dragging: false,
      cardsHitSticky: false,
      pixelsTillSticky: 0,
      localOrder: [],
      dangerZone: []
    };
  },

  computed: {
    hasScrolledEnough() {
      return this.cardsHitSticky;
    },

    hasCards() {
      return this.localOrder.length > 0;
    },

    ...mapGetters({
      order: 'card_g__order',
      cards: 'card_g__cards',
      gotFbData: 'card_g__gotFbData'
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
      if (event.target.scrollTop >= this.pixelsTillSticky) {
        this.cardsHitSticky = true;
      } else if (this.cardsHitSticky) {
        this.cardsHitSticky = false;
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

    // this is needed to hide/show the shadow under the sticky top bar
    this.pixelsTillSticky = this.$el.querySelector('.location-cards').offsetTop - this.$el.querySelector('.sticky').offsetHeight;
  }
});
