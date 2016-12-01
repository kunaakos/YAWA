
import { App } from 'src/app';

import VuexFire from 'vuexfire';

import firebaseHelper from 'helpers/firebase';

class Alert {
  constructor(owmCityId, sortKey) {
    this.owmCityId = owmCityId;
    this.sortKey = sortKey;
    this.tempThresholds = {
      maxC: false,
      minC: false
    };
  }
}

// will move to firebaseHelper, but:
// write first, structure later!
const alerts = {
  alertsRef: null,

  // check for existing alerts for the given owmCityId
  check(owmCityId) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.alertsRef.orderByChild('owmCityId').equalTo(owmCityId).once('value', (snapshot) => {
        if (!snapshot.val()) {
          // no existing alert for this owmCityId
          resolve();
        } else {
          // alert already exists for this owmCityId
          reject();
        }
      });
    });
  },

  // add a new alert
  add(owmCityId) {
    var self = this;
    return new Promise(function(resolve, reject) {
      // get unique key - we need this for sorting
      var newAlertKey = self.alertsRef.push().key;
      // Create the data we want to update
      var alertData = {};
      alertData[newAlertKey] = new Alert(owmCityId, newAlertKey);
      // Do a deep-path update
      self.alertsRef.update(alertData, function(error) {
        if (error) {
          console.log('Error updating data:', error);
          reject();
        } else {
          resolve();
        }
      });
    });
  },

  delete(firebaseKey) {
    this.alertsRef.child(firebaseKey).remove();
    // what to return?
  }

};

if (alerts) {
 // no unused vars
}

const db = {
  state: {
    alerts: null
  },

  actions: {
    db_addAlertByOwmId(context, owmCityId) {
      // check if already added
      alerts.check(owmCityId).then(() => {
        // no existing alert
        alerts.add(owmCityId);
      })
      .catch(() => {
        // alert exists
        console.log('Error: ' + owmCityId + ' already exists ... OR something else happened.');
      });
    },

    db_deleteAlertByFirebaseKey(context, firebaseKey) {
      alerts.delete(firebaseKey);
    },

    // update sortKey values of cards
    db_setAlertKeyArray(context, keyArray) {
      var data = keyArray.reduce((alertsData, key, index) => {
        alertsData[key + '/sortKey'] = index;
        return alertsData;
      }, {});

      alerts.alertsRef.update(data, function(error) {
        if (error) {
          console.log('Error updating data:', error);
        } else {
          console.log('keyArray updated');
        }
      });
    },

    db_doFirebaseBindings(context) {
      var userId = context.rootState.auth.user.uid;
      App.$bindAsObject('db.alerts', firebaseHelper.db.ref('users/' + userId + '/alerts'));
      alerts.alertsRef = App.$firebaseRefs['db.alerts'];
    }
  },

  mutations: VuexFire.moduleMutations('db'),

  getters: {
    db_getAlerts: state => {
      return state.alerts;
    },
    // returns an array containing the unique IDs of cards in the order they
    // should appear on screen
    db_getAlertKeyArray: state => {
      var sortable = [];
      for (var alertKey in state.alerts) {
        var alert = state.alerts[alertKey];
        if (alert && alert.hasOwnProperty('sortKey')) {
          sortable.push({
            'sortKey': alert.sortKey,
            'alertKey': alertKey
          });
        }
      }
      sortable.sort((a, b) => {
        return (a.sortKey > b.sortKey) ? true : false;
      });
      return sortable.map((value) => {
        return value.alertKey;
      });
    },
    db_hasItems: state => {
      return !!state.alerts.length;
    }
  }
};

export default db;
