const User = require("../models/User");
const Product = require("../models/Product");
const passport = require("passport");
const initializePassport = require("../config/passport-config");

initializePassport(passport);

const getHome = async (req, res) => {
  const product = await Product.find({});
  res.render("user-views/home", { products: product });
};

const getLogin = (req, res) => {
  res.render("user-views/login");
};

// const postLogin = (req, res) => {
//   try {
//     User.findOne(
//       {
//         $or: [{ username: req.body.username }, { email: req.body.username }],
//       },
//       (err, user) => {
//         if (user !== null) {
//           if (err) {
//             console.log(err);
//           } else {
//             user.comparePasswords(req.body.password, (err, isMatch) => {
//               console.log(isMatch);
//               if (err) {
//                 res.redirect("/login");
//               } else {
//                 if (isMatch) {
//                   res.redirect("/");
//                 } else {
//                   res.redirect("/login");
//                 }
//               }
//             });
//           }
//         } else {
//           res.redirect("/login");
//         }
//       }
//     );
//   } catch (err) {
//     res.redirect("/login");
//   }
// };

const postLogin = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
});

const getSignUp = (req, res) => {
  res.render("user-views/signup", { err: false });
};

const postSignUp = async (req, res) => {
  try {
    await User.create(req.body);
    res.redirect("/login");
  } catch (err) {
    console.log(err.message);
    res.redirect("/signup");
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

const getProduct = (req, res) => {
  res.render("user-views/product");
};

const deleteLogout = (req, res) => {
  req.logOut((err) => {
    res.redirect("/");
  });
};

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
    res.redirect("/");
  }
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
  getProduct,
  checkAuthenticated,
  checkNotAuthenticated,
  deleteLogout,
};
