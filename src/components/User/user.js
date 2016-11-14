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
  methods: {
    logout: function() {
      auth.logout(()=>{
        this.$router.push('/login');
      });
    }
  }
});
