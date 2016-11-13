import Vue from 'vue';
import template from './user.html';

import auth from 'helpers/auth';

export default Vue.extend({
  template,
  data: function() {
    return {
      auth: auth.state
    };
  },
  ready: function() {
    auth.checkRedirect();
  },
  methods: {
    login: function() {
      auth.login();
    },
    logout: function() {
      auth.logout();
      this.$router.push('/login');
    }
  }
});
