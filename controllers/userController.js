const User = require("./../models/userModels");

const getHome = (req, res) => {
  res.render("user-views/home");
};

const postLogin = (req, res) => {
  console.log(req.body);
  res.redirect("/");
};

const getLogin = (req, res) => {
  res.render("user-views/login");
};

const getSignUp = (req, res) => {
  res.render("user-views/signup", { err: false });
};

const postSignUp = async (req, res) => {
  try {
    // const user = new User(req.body);
    // user.save();
    await User.create(req.body);
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
  postLogin,
  getSignUp,
  postSignUp,
  getCart,
  getContact,
  getShop,
};
