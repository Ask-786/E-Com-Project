const User = require("../models/User");
const Product = require("../models/Product");
const passport = require("passport");
const initializePassport = require("../config/passport-config");
const checkVerificationToken =
  require("../services/twilio").checkVerificationToken;

initializePassport(passport);

const getHome = async (req, res) => {
  const product = await Product.find({});
  res.render("user-views/home", { products: product, name: req.user });
};

const getLogin = (req, res) => {
  res.render("user-views/login");
};

const getOtpVerify = (req, res) => {
  res.render("user-views/otp-verify");
};

const getSignUp = (req, res) => {
  res.render("user-views/signup", { err: false });
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

const postSignUp = async (req, res) => {
  try {
    await User.create(req.body);
    res.redirect("/login");
  } catch (err) {
    res.locals.message = err.message;
    res.redirect("/signup");
  }
};

const postLogin = passport.authenticate("local", {
  successRedirect: "/otp-verify",
  failureRedirect: "/login",
  failureFlash: true,
});

const postOtpVerify = (req, res) => {
  checkVerificationToken(req.user.phone, req.body.otp).then((status) => {
    if (status === "approved") {
      res.redirect("/");
    } else {
      req.logOut((err) => {
        res.redirect("/login");
      });
    }
  });
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

const deleteLogout = (req, res) => {
  req.logOut((err) => {
    res.redirect("/");
  });
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
  deleteLogout,
  getOtpVerify,
  postOtpVerify,
};
