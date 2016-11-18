import * as firebase from 'firebase';

import { PubSub } from 'src/app';

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

    this.state = {
      initialized: false,
      loggedIn: false,
      user: null
    };

    this.auth = this.state;

    var self = this;

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        self.state.user = user;
        self.state.loggedIn = true;
        store.commit('auth_setUser', user); // should map data!
      } else {
        console.log('unauthd');
        self.state.user = null;
        self.state.loggedIn = false;
        store.commit('auth_setUser', null);
      }
      self.state.initialized = true;
      store.commit('auth_setInitState', true);
      PubSub.$emit('authStateChanged', true);
    });

  }

  checkFacebookRedirect(cbSuccess, cbFail) {
    firebase.auth().getRedirectResult().then(function(result) {
      if (result.user) {
        if (cbSuccess) {
          cbSuccess();
        }
      } else if (cbFail) {
        cbFail();
      }
    }).catch(function(error) {
      if (error) {
        console.log(error);
      }
    });
  }

  login() {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  logout(cbSuccess, cbFail) {
    var self = this;
    firebase.auth().signOut().then(function() {
      self.auth.loggedIn = false;
      self.auth.user = null;
      if (cbSuccess) {
        cbSuccess();
      }
    }, function(error) {
      if (error) {
        console.log(error);
        if (cbSuccess) {
          cbFail(error);
        }
      }
    });
  }

}

export default new FirebaseHelper(firebaseConfig);
