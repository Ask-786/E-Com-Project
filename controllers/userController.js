const passport = require("passport");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Category = require("../models/Category");
const querystring = require("querystring");
const initializePassport = require("../config/passport-config");
const { response } = require("express");
const sendVerifyToken = require("../services/twilio").sendVerifyToken;
const checkVerificationToken =
  require("../services/twilio").checkVerificationToken;

initializePassport(passport);

const getHome = async (req, res) => {
  const category = await Category.find({});
  const product = await Product.find({})
    .populate("category")
    .sort({ updatedAt: -1 })
    .limit(12);
  res.render("user-views/home", {
    name: req.user,
    product,
    category,
  });
};

const getLogin = (req, res) => {
  res.render("user-views/login");
};

const getOtpVerify = (req, res) => {
  res.render("user-views/otp-verify");
};

const getSignUp = (req, res) => {
  console.log(req.query.errMessage);
  if (req.query) {
    res.render("user-views/signup", {
      errMessage: req.query.errMessage,
    });
  } else {
    res.render("user-views/signup");
  }
};

const getContact = (req, res) => {
  res.render("user-views/contact");
};

const getShop = async (req, res) => {
  const category = await Category.find({});
  const products = await Product.find({}).populate("category").limit(20);
  res.render("user-views/shop", {
    products,
    category,
  });
};

const getProduct = async (req, res) => {
  const product = await Product.findById(req.query.id);
  res.render("user-views/product", {
    product,
  });
};

const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: "bucket",
    populate: {
      path: "products",
    },
  });
  if (cart !== null) {
    let total = 0;
    for (let i = 0; i < cart.bucket.length; i++) {
      total += cart.bucket[i].products.price * cart.bucket[i].quantity;
    }
    res.render("user-views/cart", {
      cart,
      total,
    });
  } else {
    res.render("user-views/empty-cart");
  }
};

const getAddToCart = async (req, res) => {
  let cartExists = await Cart.exists({ user: req.user._id });
  let product = await Product.findById(req.query.id);
  console.log(product);
  if (cartExists === null) {
    await Cart.create({
      user: req.user._id,
      bucket: { products: req.query.id, subtotal: product.price },
      grandtotal: product.price,
    });
  } else {
    let itemExists = await Cart.exists({ "bucket.products": req.query.id });
    if (itemExists === null) {
      let product = await Product.findById(req.query.id);
      await Cart.updateOne(
        { user: req.user._id },
        {
          $push: {
            bucket: { products: req.query.id, subtotal: product.price },
          },
          $inc: {
            grandtotal: product.price,
          },
        }
      );
    } else {
      console.log("Item already in cart");
    }
  }
};

const getCartItemIncrement = async (req, res) => {
  let product = await Product.findById(req.query.id);

  await Cart.updateOne(
    {
      user: req.user._id,
      "bucket.products": req.query.id,
    },
    {
      $inc: {
        "bucket.$.quantity": 1,
        "bucket.$.subtotal": product.price,
        grandtotal: product.price,
      },
    }
  );

  let cart = await Cart.findOne({
    user: req.user._id,
    "bucket.products": req.query.id,
  });

  let cartItem = cart.bucket.find((elm) => {
    return elm.products.toString() === req.query.id;
  });

  res.json({
    count: cartItem.quantity,
    subtotal: cartItem.subtotal,
    grandtotal: cart.grandtotal,
  });
};

const getCartItemDecrement = async (req, res) => {
  let product = await Product.findById(req.query.id);

  await Cart.updateOne(
    {
      user: req.user._id,
      "bucket.products": req.query.id,
    },
    {
      $inc: {
        "bucket.$.quantity": -1,
        "bucket.$.subtotal": -product.price,
        grandtotal: -product.price,
      },
    }
  );

  let cart = await Cart.findOne({
    user: req.user._id,
    "bucket.products": req.query.id,
  });

  let cartItem = cart.bucket.find((elm) => {
    return elm.products.toString() === req.query.id;
  });

  res.json({
    count: cartItem.quantity,
    subtotal: cartItem.subtotal,
    grandtotal: cart.grandtotal,
  });
};

const getCartItemDelete = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  let cartItem = cart.bucket.find((elm) => {
    return elm.products.toString() === req.query.id;
  });
  await Cart.updateOne(
    {
      user: req.user._id,
    },
    {
      $pull: {
        bucket: { products: req.query.id },
      },
      $inc: {
        grandtotal: -cartItem.subtotal,
      },
    }
  );

  let cartAfter = await Cart.findOne({ user: req.user._id });

  res.json({
    grandtotal: cartAfter.grandtotal,
  });
};

const postSignUp = async (req, res) => {
  try {
    const tempUser = await User.exists({
      $or: [
        { username: req.body.name },
        { email: req.body.email },
        { phone: req.body.phone },
      ],
    });
    if (tempUser === null) {
      req.session.temp = req.body;
      sendVerifyToken(req.body.phone).then(() => {
        res.redirect("/otp-verify");
      });
    } else {
      const query = querystring.stringify({
        errMessage:
          "User Already Exists (Username, Email or Phone is Already Registered)",
      });
      res.redirect("/signup?" + query);
    }
  } catch (err) {
    const query = querystring.stringify({
      errMessage: err.message,
    });
    res.redirect("/signup?" + query);
  }
};

const postLogin = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
});

const postOtpVerify = (req, res) => {
  checkVerificationToken(req.session.temp.phone, req.body.otp).then(
    (status) => {
      if (status === "approved") {
        User.create(req.session.temp).then(() => {
          req.logOut((err) => {
            res.redirect("/login");
          });
        });
      } else {
        req.logOut((err) => {
          const query = querystring.stringify({
            errMessage: "Wrong OTP",
          });
          res.redirect("/signup");
        });
      }
    }
  );
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
  getAddToCart,
  getCartItemIncrement,
  getCartItemDecrement,
  getCartItemDelete,
};
