const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated() && !req.user.isadmin) {
    next();
  } else {
    res.redirect("/login");
  }
};

const checkNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    if (!req.user.isadmin) {
      res.redirect("/");
    } else {
      req.logOut((err) => {
        res.status(404).json({ message: "Login Again" });
      });
    }
  }
};

const checkAuthenticatedAxios = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.json({ denied: true });
  }
};

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  checkAuthenticatedAxios,
};
