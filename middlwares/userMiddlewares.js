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
      req.logOut(() => {
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

const checkIsBlocked = (req, res, next) => {
  if (!req.user.access) {
    req.logOut(() => {
      res.render("user-views/blocked-message", {
        layout: "./layouts/no-hea-foo-user-layout",
      });
    });
  } else {
    next();
  }
};

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  checkAuthenticatedAxios,
  checkIsBlocked,
};
