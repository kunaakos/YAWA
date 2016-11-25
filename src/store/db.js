
import { App } from 'src/app';

import VuexFire from 'vuexfire';

import firebaseHelper from 'helpers/firebase';

class Alert {
  constructor(owmCityId) {
    this.owmCityId = owmCityId;
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
  alertKeyArrayRef: null,
  userRef: null,

  check(owmCityId) {
    // check for existing alerts for the given owmCityId
    var self = this;
    return new Promise(function(resolve, reject) {
      console.log('alertsRef: ' + self.alertsRef);
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
    // return a Promise
  },

  add(owmCityId) {
    var self = this;

    var alertObj = new Alert(owmCityId);
    console.log('new owmCityId! adding ' + alertObj);

    // cadd new alert and add the alert key to alertKeyArray AT ONCE
    return new Promise(function(resolve, reject) {
      // as seen on https://firebase.googleblog.com/2015/09/introducing-multi-location-updates-and_86.html
      var newAlertKey = self.userRef.child('alerts').push().key;
      // var newAlertKey = newAlertRef.key();
      // Create the data we want to update
      var updatedUserData = {};
      updatedUserData['alerts/' + newAlertKey] = alertObj;
      updatedUserData['alertKeyArray/' + newAlertKey] = newAlertKey;
      // Do a deep-path update
      self.userRef.update(updatedUserData, function(error) {
        if (error) {
          console.log('Error updating data:', error);
          reject();
        } else {
          resolve();
        }
      });
    });
    // MAGIC!!!
  },

  delete() {
    // delete the alert with the given firebaseKey
    // remove from alertKeyArray
    // what to return?
  },

  updateKeyArray() {
    // this should be done automatically by vuexfire, but in case it can't be...
    // what to return?
  },

  checkKeyArray() {
    // check the integrity of alertKeyArray
  }
};

if (alerts) {
 // no unused vars
}

const db = {
  state: {
    alerts: null,
    alertKeyArray: null
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
      if (context) {
        console.log('store deleting ' + firebaseKey);
        App.$firebaseRefs['db.alerts'].child(firebaseKey).remove();
        // remove from sortOrder
        // ...
      }
    },

    db_doFirebaseBindings(context) {
      var userId = context.rootState.auth.user.uid;
      App.$bindAsObject('db.alerts', firebaseHelper.db.ref('users/' + userId + '/alerts'));
      App.$bindAsArray('db.alertKeyArray', firebaseHelper.db.ref('users/' + userId + '/alertKeyArray'));
      alerts.alertsRef = App.$firebaseRefs['db.alerts'];
      alerts.alertKeyArrayRef = App.$firebaseRefs['db.alertKeyArray'];
      alerts.userRef = firebaseHelper.db.ref('users/' + userId); // not bound to vuex!

      // TODO check sortOrder integrity, add missing intems
    }
  },

  mutations: VuexFire.moduleMutations('db'),

  getters: {
    db_getAlerts: state => {
      return state.alerts;
    },
    db_getAlertKeyArray: state => {
      return state.alertKeyArray;
    },
    db_hasItems: state => {
      return !!state.alertKeyArray.length();
    }
  }
};

export default db;
