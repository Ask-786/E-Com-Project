const User = require("./../models/userModels");

const getHome = (req, res) => {
  res.render("user-views/home");
};

const redirectHome = (req, res) => {
  res.redirect("/");
};

const getLogin = (req, res) => {
  res.render("user-views/login");
};

const getSignUp = (req, res) => {
  res.render("user-views/signup", { err: false });
};

const redirectLogin = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.redirect("/login");
  } catch (err) {
    res.render("user-views/signup");
  }
};

const getCart = (req, res) => {
  res.render("user-views/cart");
};

const getContact = (req, res) => {
  res.render("user-views/contact");
};

const getShop = (req, res) => {
  res.render("user-views/shop");
};

module.exports = {
  getHome,
  getLogin,
  redirectHome,
  getSignUp,
  redirectLogin,
  getCart,
  getContact,
  getShop,
};
