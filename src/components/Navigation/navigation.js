import Vue from 'vue';
import template from './navigation.html';

import auth from '../../helpers/auth';

export default Vue.extend({
  template,
  data: function() {
    return {
      auth: auth.state
    };
  }
});
