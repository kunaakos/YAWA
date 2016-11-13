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
    auth.state.user = user;
    auth.state.loggedIn = true;
  } else {
    auth.state.user = null;
    auth.state.loggedIn = false;
  }
  console.log('auth state: ' + auth.state.loggedIn);
  auth.state.initialized = true;
  PubSub.$emit('authStateChanged', auth.state.loggedIn);
});

var auth = {
  state: {
    initialized: false,
    loggedIn: false,
    user: null
  },

  check() {
    return this.state.loggedIn;
  },

  checkRedirect(cbSuccess, cbFail) {
    firebase.auth().getRedirectResult().then(function(result) {
      if (result.user) {
        cbSuccess();
      } else {
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

  logout() {
    var self = this;
    firebase.auth().signOut().then(function() {
      self.state.loggedIn = false;
      self.state.user = null;
    }, function(error) {
      if (error) {
        console.log(error);
      }
    });

  }

};

export default auth;
