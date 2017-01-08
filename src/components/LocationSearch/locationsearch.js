// Based on VueTypeahead
// https://github.com/pespantelis/vue-typeahead

import Vue from 'vue';
import template from './locationsearch.html';

import './locationsearch.scss';

import owmHelper from 'helpers/owm';

export default Vue.extend({
  name: 'LocationSearch',
  template,
  data() {
    return {
      state: {
        loading: false,
        focused: false,
      },
      options: {
        selectFirst: false,
        limit: 10,
        minChars: 3
      },
      searchQuery: '',
      searchResults: [],
      currentSelection: -1,
      lastSearchToken: null
    };
  },

  computed: {
    hasItems() {
      return this.searchResults.length > 0;
    },

    isEmpty() {
      return !this.searchQuery;
    },

    isLoading() {
      return this.state.loading;
    }
  },

  methods: {
    update() {

      if (this.options.minChars && this.searchQuery.length < this.options.minChars) {
        this.searchResults = [];
        return null;
      }

      this.state.loading = true;

      var search = owmHelper.getCities(this.searchQuery, this.options.limit);

      this.lastSearchToken = search.resultToken;

      search.resultPromise.then(
        (data) => {
          // success yay
          if (this.searchQuery && this.lastSearchToken === data.resultToken) {
            this.searchResults = data.result;
            this.currentSelection = -1;
            this.state.loading = false;
            if (this.options.selectFirst) {
              this.down();
            }
          }
        },
        (data) => {
          // fail nooo
          if (this.lastSearchToken === data.resultToken) {
            this.searchResults = [{
              countryCode: ':(',
              name: 'Serverdown Town'
            }];
            this.state.loading = false;
          }
        }
      );
      return null;
    },

    focus() {
      this.state.focused = true;
      this.$store.dispatch('app__setOverlay', {
        cb: this.reset
      });
    },

    reset() {
      this.searchResults = [];
      this.currentSelection = -1;
      this.searchQuery = '';
      this.state.loading = false;
      var self = this;
      setTimeout(function() {
        self.$store.dispatch('app__setOverlay', false);
      }, 200);
      setTimeout(function() {
        self.state.focused = false;
      }, 400);
    },

    setActive(index) {
      this.currentSelection = index;
    },

    activeClass(index) {
      return {
        active: this.currentSelection === index
      };
    },

    hit() {
      if (this.currentSelection !== -1) {
        this.$emit('gotResultID', this.searchResults[this.currentSelection].id);
        this.$store.dispatch('card__cards_add', this.searchResults[this.currentSelection].id);
        this.reset();
      }
    },

    up() {
      if (this.currentSelection > 0) {
        this.currentSelection--;
      } else if (this.currentSelection === -1) {
        this.currentSelection = this.searchResults.length - 1;
      } else {
        this.currentSelection = -1;
      }
    },

    down() {
      if (this.currentSelection < this.searchResults.length - 1) {
        this.currentSelection++;
      } else {
        this.currentSelection = -1;
      }
    }
  }
});
