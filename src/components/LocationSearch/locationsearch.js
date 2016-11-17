// Based on VueTypeahead
// https://github.com/pespantelis/vue-typeahead

import Vue from 'vue';
import template from './locationsearch.html';

import './locationsearch.scss';

import weather from 'helpers/weather';

import { focus } from 'vue-focus';

export default Vue.extend({
  template,
  directives: {
    focus: focus
  },
  data() {
    return {
      items: [],
      query: '',
      current: -1,
      loading: false,
      focused: false,
      selectFirst: false,
      limit: 10,
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
      this.current = -1;
      this.query = '';
      this.loading = false;
      this.focused = false;
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
        this.$emit('gotResultID', this.items[this.current].id);
        this.reset();
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
    }
  }
});
