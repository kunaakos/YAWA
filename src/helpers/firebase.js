import * as firebase from 'firebase';

import store from 'src/store';

// move elsewhere?
var firebaseConfig = {
  apiKey: 'AIzaSyCfPzIUom73nGO6DlD1oIV6g_M-RKBJb2g',
  authDomain: 'project-3546681884328698666.firebaseapp.com',
  databaseURL: 'https://project-3546681884328698666.firebaseio.com',
  storageBucket: 'project-3546681884328698666.appspot.com',
};

class Card {

  constructor(owmCityId, sortKey) {
    this.owmCityId = owmCityId;
    this.sortKey = sortKey;
    this.tempThresholds = {
      maxC: false,
      minC: false
    };
  }

}

class FirebaseHelper {

  constructor(config) {
    this.firebaseApp = firebase.initializeApp(config);
    this.fbAuthProvider = new firebase.auth.FacebookAuthProvider();
    this.db = firebase.database();
    this.cardsRef = null;

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        store.commit('auth_setUser', user); // should map data!
        store.dispatch('db_doFirebaseBindings');
      } else {
        store.commit('auth_setUser', null);
      }
      store.commit('auth_setInitState', true);
    });

  }

  // check for existing cards that have a given owmCityId
  checkForExistingCard(owmCityId) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.cardsRef.orderByChild('owmCityId').equalTo(owmCityId).once('value', (snapshot) => {
        if (!snapshot.val()) {
          // no existing card for this owmCityId
          resolve();
        } else {
          // card already exists for this owmCityId
          reject('card for this ID (' + owmCityId + ') already exists');
        }
      });
    });
  }

  createCard(owmCityId) {
    // get unique key - we need this as an inital sortKey value
    var newCardKey = this.cardsRef.push().key;
    // create update data
    var data = {};
    data[newCardKey] = new Card(owmCityId, newCardKey);
    // do the update
    return this.updateCards(data);
  }

  updateSortKeys(keyArray) {
    // create update data
    var data = keyArray.reduce((cardsData, key, index) => {
      cardsData[key + '/sortKey'] = index;
      return cardsData;
    }, {});
    // do the update
    return this.updateCards(data);
  }

  updateCards(data) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.cardsRef.update(data, function(error) {
        if (error) {
          reject('Error updating cards.');
        } else {
          resolve();
        }
      });
    });
  }

  deleteCard(firebaseKey) {
    this.cardsRef.child(firebaseKey).remove();
  }

  login() {
    firebase.auth().signInWithRedirect(this.fbAuthProvider);
  }

  logout() {
    // return a standard Promise to make life easier
    return new Promise((resolve, reject) => {
      firebase.auth().signOut().then(function() {
        resolve();
      }, function(error) {
        reject(error);
      });
    });
  }

}

export default new FirebaseHelper(firebaseConfig);
