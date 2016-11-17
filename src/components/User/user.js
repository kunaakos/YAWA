import Vue from 'vue';
import template from './user.html';

import backend from 'helpers/backend';

export default Vue.extend({
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
