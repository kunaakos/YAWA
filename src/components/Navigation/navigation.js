import Vue from 'vue';
import template from './navigation.html';

import './navigation.scss';

import { mapGetters } from 'vuex';

export default Vue.extend({
  template,
  computed: mapGetters({
    user: 'auth_getUser',
    authenticated: 'auth_isAuthenticated'
  }),
});
