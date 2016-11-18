import Vue from 'vue';
import template from './login.html';

import { mapActions } from 'vuex';

export default Vue.extend({
  ame: 'Login',
  template,
  methods: mapActions({
    login: 'auth_initiateLogin'
  }),
});
