import Vue from 'vue';

import template from './tempinput.html';
import './tempinput.scss';

export default Vue.extend({
  name: 'TempInput',
  template,

  // make sure props aren't camelCase
  props: [ 'val', 'settings' ],

  data() {
    return {
      localVal: false
    };
  },

  mounted: function() {
    this.localVal = this.val;

    var self = this;
    this.$watch('val', function(newVal) {
      self.localVal = newVal;
    });
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
      var initial = this.val;
      if (initial === false) {
        initial = this.settings.initial;
      }
      this.setVal(Math.round(initial + event.deltaX / 10), event.isFinal);
    },

    setVal(val, isFinal) {
      if ((val >= this.settings.min || this.settings.min === false) && (val <= this.settings.max || this.settings.max === false)) {
        this.localVal = val;
        if (isFinal) {
          this.$emit('newVal', this.localVal);
        }
      }
    }
  }
});
