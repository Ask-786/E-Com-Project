const checkAuthenticated = (req, res, next) => {
  console.log(req.user);
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
      res.status(404).json({ message: "Logout From Admin Account" });
    }
  }
};

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
};
