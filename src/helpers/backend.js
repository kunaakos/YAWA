import * as firebase from 'firebase';

import { PubSub } from 'src/main';

var firebaseConfig = {
  apiKey: 'AIzaSyCfPzIUom73nGO6DlD1oIV6g_M-RKBJb2g',
  authDomain: 'project-3546681884328698666.firebaseapp.com',
  databaseURL: 'https://project-3546681884328698666.firebaseio.com',
  storageBucket: 'project-3546681884328698666.appspot.com',
};

var firebaseApp = firebase.initializeApp(firebaseConfig);
// var db = firebaseApp.database();
if (firebaseApp) {
  // avoid unused var crap
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    backend.auth.user = user;
    backend.auth.loggedIn = true;
  } else {
    backend.auth.user = null;
    backend.auth.loggedIn = false;
  }
  console.log('auth state: ' + backend.auth.loggedIn);
  backend.auth.initialized = true;
  PubSub.$emit('authStateChanged', backend.auth.loggedIn);
});

var backend = {
  auth: {
    initialized: false,
    loggedIn: false,
    user: null
  },

  check() {
    return this.auth.loggedIn;
  },

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
  },

  login() {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  },

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

};

export default backend;
