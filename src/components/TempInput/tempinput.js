import Vue from 'vue';

import template from './tempinput.html';
import './tempinput.scss';

export default Vue.extend({
  name: 'TempInput',
  template,

  // make sure props aren't camelCase
  props: [ 'val' ],

  data() {
    return {
      localVal: false
    };
  },

  mounted: function() {
    this.localVal = this.val;
  },

  computed: {
    saved() {
      return this.localVal === this.val;
    },
    isUnset() {
      if (this.localVal === false) {
        return true;
      } else {
        return false;
      }
    }
  },

  methods: {
    onPan(event) {
      console.log(event.deltaX);
      // console.log(event);
      this.setVal(Math.round(this.val + event.deltaX / 10));
    },

    setVal(val) {
      if (val >= -40 && val <= 40) {
        this.localVal = val;
      }
    }
  }
});
