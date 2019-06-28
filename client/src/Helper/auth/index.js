export default {
  get isAuthenticated() {
    return window.localStorage.getItem("isAuthenticated") == true
      ? true
      : false;
  },
  logout() {
    window.localStorage.clear();
  },
  setLogedIn(stats = false) {
    window.localStorage.setItem("isAuthenticated", stats);
  }
};
