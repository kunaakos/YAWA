import Vue from 'vue';
import template from './settings.html';

import { mapGetters } from 'vuex';

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
      this.$store.dispatch('auth_initiateLogout').then(
        () => {
          self.$router.push('/login');
        },
        null // no error handling
      );
    }
  }
});
