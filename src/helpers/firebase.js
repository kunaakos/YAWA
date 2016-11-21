import * as firebase from 'firebase';

import store from 'src/store';

// move elsewhere?
var firebaseConfig = {
  apiKey: 'AIzaSyCfPzIUom73nGO6DlD1oIV6g_M-RKBJb2g',
  authDomain: 'project-3546681884328698666.firebaseapp.com',
  databaseURL: 'https://project-3546681884328698666.firebaseio.com',
  storageBucket: 'project-3546681884328698666.appspot.com',
};

class FirebaseHelper {

  constructor(config) {

    this.firebaseApp = firebase.initializeApp(config);
    this.fbAuthProvider = new firebase.auth.FacebookAuthProvider();
    this.db = firebase.database();

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
