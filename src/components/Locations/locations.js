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
      stickyHeight: 0,
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
    },

    // quick and dirty vanilla js animated scroll based on:
    // http://stackoverflow.com/questions/17722497/scroll-smoothly-to-specific-element-on-page/39494245#39494245
    doScrollToEl(el, targetScr) {
      return new Promise(function(resolve) {
        var startScr = el.scrollTop;
        var diff = targetScr - startScr;
        var start_ts;
        var duration = 100;

        function step(current_ts) {
          if (!start_ts) start_ts = current_ts;
          var elapsed = current_ts - start_ts;
          var percent = Math.min(elapsed / duration, 1);
          el.scrollTop = startScr + diff * percent;
          if (elapsed < duration) {
            window.requestAnimationFrame(step);
          } else {
            resolve();
          }
        }

        window.requestAnimationFrame(step);
      });
    },

    // called by clicked elements
    // check if element is fully visible, scroll if needed
    // fire callback when finished
    // NOTE: don't forget to fire callback
    // NOTE: could use scrollIntoView instead, with polyfills?
    // https://developer.mozilla.org/en/docs/Web/API/Element/scrollIntoView
    scrollToEl(options) {
      var sc = this.$el.querySelector('.scrollable');
      var sc_h = sc.offsetHeight; // scroll container height
      var sc_st = sc.scrollTop; // scroll container scrollTop
      var el_h = options.el.offsetHeight; // element height
      var el_ot = options.el.offsetTop; // element offsetTop
      var st_h = this.stickyHeight; // sticky container height

      // element distance from top of sticky container bottom
      var dt = el_ot - sc_st - st_h;
      // element distance from top of scroll container bottom
      var db = sc_st - el_ot - el_h + sc_h;

      if (dt < 0) {
        // scroll down
        this.doScrollToEl(sc, el_ot - st_h - 10).then(options.cb);
      } else if (db < 0) {
        // scroll up
        this.doScrollToEl(sc, sc_st - db + 10).then(options.cb);
      } else {
        options.cb();
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

    // needed by scrollToEl
    this.stickyHeight = this.$el.querySelector('.sticky').offsetHeight;

    // this is needed to hide/show the shadow under the sticky top bar
    this.pixelsTillSticky = this.$el.querySelector('.location-cards').offsetTop - this.stickyHeight;
  }
});
