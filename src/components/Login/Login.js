import Vue from 'vue';
import template from './login.html';

import auth from 'helpers/auth';

export default Vue.extend({
  template,
  data: function() {
    return {
      auth: auth.state
    };
  },
  methods: {
    login: function() {
      auth.login();
    }
  }
});
