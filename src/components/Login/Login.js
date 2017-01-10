import Vue from 'vue';
import template from './login.html';

import './login.scss';

import { mapActions } from 'vuex';

export default Vue.extend({
  name: 'Login',
  template,
  methods: {
    anonLogin() {
      var self = this;
      this.setOverlay({ loader: true });
      this._anonLogin().then(
        () => {
          self.$router.push('/');
        },
        null // no error handling
      );
    },
    ...mapActions({
      setOverlay: 'app__setOverlay',
      fbLogin: 'auth_initiateFbLogin',
      _anonLogin: 'auth_initiateAnonLogin'
    })
  }

});
