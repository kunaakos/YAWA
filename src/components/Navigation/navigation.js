import Vue from 'vue';
import template from './navigation.html';

import './navigation.scss';

import auth from 'helpers/auth';

export default Vue.extend({
  template,
  data: function() {
    return {
      auth: auth.state
    };
  }
});
