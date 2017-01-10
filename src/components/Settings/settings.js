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

  methods: {
    logout() {
      var self = this;
      this.setOverlay({ loader: true });
      this._logout().then(
        () => {
          self.$router.push('/login');
        },
        null // no error handling
      );
    },
    ...mapActions({
      setOverlay: 'app__setOverlay',
      _logout: 'auth_initiateLogout'
    })
  }
});
