import Vue from 'vue';
import template from './login.html';

import backend from 'helpers/backend';

export default Vue.extend({
  ame: 'Login',
  template,
  data: function() {
    return {
      auth: backend.auth
    };
  },
  methods: {
    login: function() {
      backend.login();
    }
  }
});
