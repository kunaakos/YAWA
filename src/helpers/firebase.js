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

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        store.commit('auth_setUser', user); // should map data!
      } else {
        store.commit('auth_setUser', null);
      }
      store.commit('auth_setInitState', true);
    });

  }

  login() {
    firebase.auth().signInWithRedirect(this.fbAuthProvider);
  }

  logout(success, fail) {
    firebase.auth().signOut().then(function() {
      success();
    }, function(error) {
      fail(error);
    });
  }

}

export default new FirebaseHelper(firebaseConfig);
