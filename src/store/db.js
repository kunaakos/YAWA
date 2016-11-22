
import { App } from 'src/app';

import VuexFire from 'vuexfire';

import firebaseHelper from 'helpers/firebase';

class Alert {
  constructor(owmCityId) {
    this.owmCityId = owmCityId;
  }
}

const db = {
  state: {
    alerts: null
  },

  actions: {
    db_addAlertByOwmId(context, owmCityId) {
      App.$firebaseRefs['db.alerts'].orderByChild('owmCityId').equalTo(owmCityId).once('value', (snapshot) => {
        if (!snapshot.val()) {
          // new owmCityId, add to list of alerts
          App.$firebaseRefs['db.alerts'].push(new Alert(owmCityId));
        } else {
          // already added
        }
      });
    },

    db_deleteAlertByFirebaseKey(context, firebaseKey) {
      if (context) {
        console.log('store deleting ' + firebaseKey);
        App.$firebaseRefs['db.alerts'].child(firebaseKey).remove();
      }
    },

    db_doFirebaseBindings(context) {
      var userId = context.rootState.auth.user.uid;
      App.$bindAsArray('db.alerts', firebaseHelper.db.ref('users/' + userId + '/alerts'));
    }
  },

  mutations: VuexFire.moduleMutations('db'),

  getters: {
    db_getAlerts: state => {
      return state.alerts;
    },
    db_hasItems: state => {
      return !!state.alerts.length();
    }
  }
};

export default db;
