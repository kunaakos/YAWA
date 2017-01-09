import * as firebase from 'firebase';

import store from 'src/store';

// move elsewhere?
var firebaseConfig = {
  apiKey: 'AIzaSyCfPzIUom73nGO6DlD1oIV6g_M-RKBJb2g',
  authDomain: 'project-3546681884328698666.firebaseapp.com',
  databaseURL: 'https://project-3546681884328698666.firebaseio.com',
  storageBucket: 'project-3546681884328698666.appspot.com',
};

class FirebaseCard {
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
    // firebase init
    this.firebaseApp = firebase.initializeApp(config);
    this.fbAuthProvider = new firebase.auth.FacebookAuthProvider();
    this.db = firebase.database();

    // set up firebase refs
    this.cardsRef = null;
    this.CardOrderRef = null;

    // <3 JS
    var self = this;

    // handle firebase auth state changes
    firebase.auth().onAuthStateChanged(function(user) {
      // check auth state
      if (user) {
        // user is authenticated
        self.__authenticated(user);
      } else {
        // user not authenticated, or just logged out
        self.__unauthenticated();
      }
      // ... either way, this means the firebase auth module is up and running.
      store.commit('auth_setInitState', true);
    });

  }

  __authenticated(user) {
    store.commit('auth_setUser', user); // should map data!
    this.userRef = this.db.ref('users/' + user.uid);
    this.cardsRef = this.db.ref('users/' + user.uid + '/cards');
    this.cardOrderRef = this.db.ref('users/' + user.uid + '/cardOrder');
    this.__setupMutations();
  }

  __unauthenticated() {
    this.userRef = null;
    this.cardsRef = null;
    this.cardOrderRef = null;
    store.commit('auth_setUser', null);
    store.commit('card_m_fb__nuke', null);
  }

  __setupMutations() {

    // card added
    this.cardsRef.on('child_added', function(childSnapshot) {
      var data = {
        'key': childSnapshot.key,
        'value': childSnapshot.val()
      };
      // add a new card to store
      store.commit('card_m_fb__cards_add', childSnapshot.key);
      // and update with firebase data
      store.commit('card_m_fb__cards_update', data);
    });

    // card changed
    this.cardsRef.on('child_changed', function(childSnapshot) {
      var data = {
        'key': childSnapshot.key,
        'value': childSnapshot.val()
      };
      store.commit('card_m_fb__cards_update', data);
    });

    // card removed
    this.cardsRef.on('child_removed', function(childSnapshot) {
      store.commit('card_m_fb__cards_remove', childSnapshot.key);
    });

    // card order changed
    this.cardOrderRef.on('value', function(snapshot) {

      // comparator
      function bySortKey(a, b) {
        return (a.sortKey > b.sortKey) ? true : false;
      }
      // mapping: an array of keys to a sortable aray of objects
      function toSortable(key) {
        return {
          'sortKey': values[key], // not pure, needs values from upper scope
          'cardKey': key
        };
      }
      // mapping: an array of objects to an array of their 'cardKey' values
      function toKeyArray(value) {
        return value.cardKey;
      }

      var values = snapshot.val();

      if (values) {
        var keys = Object.keys(values);
        var keyArray = keys.map(toSortable).sort(bySortKey).map(toKeyArray).reverse();

        store.commit('card_m_fb__order_set', keyArray);
      }

      // HACK: no values, but we need to confirm that we have checked
      if (values === null) {
        store.commit('card_m_fb__order_set', []);
      }
    });

  }

  // check for existing cards that have a given owmCityId
  _check(owmCityId) {
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

  _add(owmCityId) {
    // get unique key - we need this as an inital sortKey value
    var newCardKey = this.cardsRef.push().key;
    // create update data
    var data = {};
    data['cards/' + newCardKey] = new FirebaseCard(owmCityId, newCardKey);
    data['cardOrder/' + newCardKey] = newCardKey;
    // do the update, return update Promise
    return this._update(data);
  }

  _setThresh(key, type, val) {
    var data = {};
    data['cards/' + key + '/tempThresholds/' + type] = val;
    return this._update(data);
  }

  _update(data) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.userRef.update(data, function(error) {
        if (error) {
          reject('Error updating cards.');
        } else {
          resolve();
        }
      });
    });
  }

  _delete(key) {
    // create update data - null value deletes
    var data = {};
    data['cards/' + key] = null;
    data['cardOrder/' + key] = null;

    // do the update, return update Promise
    return this._update(data);
  }

  _setOrder(keyArray) {
    // create update data
    var data = keyArray.reverse().reduce((acc, currValue, index) => {
      acc['cardOrder/' + currValue] = index;
      return acc;
    }, {});

    // do the update, return update Promise
    return this._update(data);
  }

  fbLogin() {
    firebase.auth().signInWithRedirect(this.fbAuthProvider);
  }

  anonLogin() {
    return new Promise((resolve, reject) => {
      firebase.auth().signInAnonymously().then(() => {
        resolve();
      }, (error) => {
        reject(error);
      });
    });
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
