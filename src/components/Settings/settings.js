import Vue from 'vue';
import template from './settings.html';

import { mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  name: 'Settings',
  template,

  computed: mapGetters({
    user: 'auth_getUser',
    authenticated: 'auth_isAuthenticated'
  }),

  watch: {
    // redirect after logout
    authenticated: function(value) {
      if (value === false) {
        this.$router.push('/login');
      }
    }
  },

  methods: {
    logout() {
      this.setOverlay({ loader: true });
      this._logout();
    },
    ...mapActions({
      setOverlay: 'app__setOverlay',
      _logout: 'auth_initiateLogout'
    })
  }

});
