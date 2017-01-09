import Vue from 'vue';
import template from './login.html';

import { mapActions } from 'vuex';

export default Vue.extend({
  name: 'Login',
  template,
  methods: {
    anonLogin() {
      var self = this;
      this._anonLogin().then(
        () => {
          self.$router.push('/');
        },
        null // no error handling
      );
    },
    ...mapActions({
      'fbLogin': 'auth_initiateFbLogin',
      '_anonLogin': 'auth_initiateAnonLogin'
    })
  }

});
