const User = require("../models/User");

// const userExists = async (req, res, next) => {
//   let isFound = await User.findOne({
//     $or: [{ username: req.body.username }, { email: req.body.username }],
//   });
// };

const getHome = (req, res) => {
  res.render("user-views/home");
};

const postLogin = async (req, res) => {
  let found = await User.exists({
    $or: [{ username: req.body.username }, { email: req.body.username }],
  });
  if (found) {
    await User.findOne(
      {
        $or: [{ username: req.body.username }, { email: req.body.username }],
      },
      (err, user) => {
        if (err) {
          throw err;
        } else {
          user.comparePasswords(req.body.password, (err, isMatch) => {
            if (err) {
              res.redirect("/login");
            } else {
              if (isMatch) {
                res.redirect("/");
              } else {
                res.redirect("/login");
              }
            }
          });
        }
      }
    );
  } else {
    res.redirect("/login");
  }
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
    console.log(err.message);
    res.render("user-views/signup", { message: err.message });
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
