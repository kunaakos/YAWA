import Vue from 'vue';
import template from './settings.html';

import backend from 'helpers/backend';

import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'Settings',
  template,
  computed: mapGetters({
    user: 'auth_getUser',
    authenticated: 'auth_isAuthenticated'
  }),
  methods: {
    logout: function() {
      backend.logout(()=>{
        this.$router.push('/login');
      });
    }
  }
});
