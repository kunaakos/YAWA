import Vue from 'vue';
import template from './navigation.html';

import './navigation.scss';

import backend from 'helpers/backend';

export default Vue.extend({
  template,
  data: function() {
    return {
      auth: backend.auth
    };
  }
});
