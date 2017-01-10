import Vue from 'vue';
import template from './login.html';

import './login.scss';

import { mapActions, mapGetters } from 'vuex';

export default Vue.extend({
  name: 'Login',
  template,

  computed: mapGetters({
    authenticated: 'auth_isAuthenticated'
  }),

  watch: {
    // redirect after auth
    authenticated: function(value) {
      if (value === true) {
        this.$router.push('/');
      }
    }
  },

  methods: {
    anonLogin() {
      this.setOverlay({ loader: true });
      this._anonLogin();
    },
    ...mapActions({
      setOverlay: 'app__setOverlay',
      fbLogin: 'auth_initiateFbLogin',
      _anonLogin: 'auth_initiateAnonLogin'
    })
  }

});
