// Based on VueTypeahead
// https://github.com/pespantelis/vue-typeahead

import Vue from 'vue';
import template from './citysearch.html';

import './citysearch.scss';

import weather from 'helpers/weather';

export default Vue.extend({
  template,
  data() {
    return {
      items: [],
      query: '',
      current: -1,
      loading: false,
      selectFirst: false,
      limit: 5,
      minChars: 3
    };
  },

  computed: {
    hasItems() {
      return this.items.length > 0;
    },

    isEmpty() {
      return !this.query;
    },

    isDirty() {
      return !!this.query;
    }
  },

  methods: {
    update() {
      if (!this.query) {
        return this.reset();
      }

      if (this.minChars && this.query.length < this.minChars) {
        return null;
      }

      this.loading = true;

      weather.getCities(this.query, this.limit).then(
        (data) => {
          // success yay
          console.log(data);

          if (this.query) {
            this.items = data;
            this.current = -1;
            this.loading = false;
            if (this.selectFirst) {
              this.down();
            }
          }
        },
        (data) => {
          // fail nooo
          console.log(data);
        }
      );
      return null;
    },

    reset() {
      this.items = [];
      this.query = '';
      this.loading = false;
    },

    setActive(index) {
      this.current = index;
    },

    activeClass(index) {
      return {
        active: this.current === index
      };
    },

    hit() {
      if (this.current !== -1) {
        this.onHit(this.items[this.current]);
      }
    },

    up() {
      if (this.current > 0) {
        this.current--;
      } else if (this.current === -1) {
        this.current = this.items.length - 1;
      } else {
        this.current = -1;
      }
    },

    down() {
      if (this.current < this.items.length - 1) {
        this.current++;
      } else {
        this.current = -1;
      }
    },

    onHit() {
      // util.warn('You need to implement the `onHit` method', this)
    }
  }
});
