import Vue from 'vue';
import template from './settings.html';

import backend from 'helpers/backend';

export default Vue.extend({
  name: 'Settings',
  template,
  data: function() {
    return {
      auth: backend.auth
    };
  },
  methods: {
    logout: function() {
      backend.logout(()=>{
        this.$router.push('/login');
      });
    }
  }
});
