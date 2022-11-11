const getHome = (req, res) => {
  res.render("../views/user-views/home");
};

const redirectHome = (req, res) => {
  res.redirect("/");
};

const getLogin = (req, res) => {
  res.render("../views/user-views/login");
};

const getSignUp = (req, res) => {
  res.render("../views/user-views/signup");
};

const redirectLogin = (req, res) => {
  res.redirect("/login");
};

module.exports = { getHome, getLogin, redirectHome, getSignUp, redirectLogin };
