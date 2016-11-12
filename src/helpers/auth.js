// auth module placeholder

export default {
  state: {
    loggedIn: false,
  },

  // check login state in localStorage AND update store object at the same time
  check() {
    // localStorage doesn't do bools, so we use strings <3
    if (localStorage.loggedIn === 'true') {
      this.state.loggedIn = true;
    } else {
      this.state.loggedIn = false;
    }
    return this.state.loggedIn;
  },

  // fake login
  login() {
    localStorage.loggedIn = 'true';
    this.state.loggedIn = true;
    console.log('logged in');
  },

  // fake logout
  logout() {
    localStorage.loggedIn = 'false';
    this.state.loggedIn = false;
    console.log('logged out');
  }

};
