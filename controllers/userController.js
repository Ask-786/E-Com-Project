const passport = require("passport");
const User = require("../models/User");
const Address = require("../models/Address");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Favorites = require("../models/Favorites");
const querystring = require("querystring");
const initializePassport = require("../config/passport-config");
const { response } = require("express");
const { error } = require("console");
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

const getUserProfile = async (req, res) => {
  try {
    let Addresses = await Address.findOne({ user: req.user._id });
    res.render("user-views/profile", { user: req.user, address: Addresses });
  } catch {
    res.redirect("/home");
  }
};

const getAddAddress = (req, res) => {
  res.render("user-views/add-address");
};

const getDeleteAddress = async (req, res) => {
  try {
    await Address.updateOne(
      { user: req.user._id },
      {
        $pull: {
          Addressess: {
            _id: req.query.id,
          },
        },
      }
    );
    res.json({ status: true });
  } catch (err) {
    console.log(err.message);
  }
};

const getOtpVerify = (req, res) => {
  res.render("user-views/otp-verify");
};

const getSignUp = (req, res) => {
  res.render("user-views/signup", { message: req.flash("message") });
};

const getContact = (req, res) => {
  res.render("user-views/contact");
};

const getShop = async (req, res) => {
  try {
    const category = await Category.find({});
    const products = await Product.find({}).populate("category").limit(20);
    res.render("user-views/shop", {
      products,
      category,
    });
  } catch (err) {
    console.log(err.message);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.id);
    res.render("user-views/product", {
      product,
    });
  } catch (err) {
    next(err);
  }
};

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user._id,
      isexpired: false,
    }).populate({
      path: "bucket",
      populate: {
        path: "products",
      },
    });
    if (cart !== null && cart.bucket.length > 0) {
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
  } catch (err) {
    console.log(err.message);
  }
};

const getAddToCart = async (req, res) => {
  try {
    let cartExists = await Cart.findOne({
      user: req.user._id,
      isexpired: false,
    });
    let product = await Product.findById(req.query.id);
    if (cartExists === null) {
      await Cart.create({
        user: req.user._id,
        bucket: { products: req.query.id, subtotal: product.price },
        grandtotal: product.price,
      });
      res.json({ alert: true });
    } else {
      let itemExists = await Cart.exists({
        user: req.user._id,
        "bucket.products": req.query.id,
      });
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
        res.json({ alert: true });
      } else {
        res.json({ alert: false });
      }
    }
  } catch (err) {
    console.log(err.message);
  }
};

const getCartItemIncrement = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err.message);
  }
};

const getCartItemDecrement = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err.message);
  }
};

const getCartItemDelete = async (req, res, next) => {
  try {
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
      status: true,
    });
  } catch (err) {
    res.json({
      status: false,
    });
  }
};

const getFavorites = async (req, res) => {
  try {
    let favorites = await Favorites.findOne({ user: req.user._id }).populate(
      "products"
    );
    if (favorites !== null && favorites.products.length > 0) {
      res.render("user-views/favorites", { products: favorites.products });
    } else {
      res.render("user-views/empty-favorites");
    }
  } catch (err) {
    console.log(err.message);
  }
};

const getAddToFavorites = async (req, res) => {
  try {
    let favoritesExists = await Favorites.exists({ user: req.user._id });

    if (favoritesExists === null) {
      await Favorites.create({
        user: req.user._id,
        products: req.query.id,
      });
      res.json({ status: true });
    } else {
      let itemExists = await Favorites.exists({ products: req.query.id });
      if (itemExists === null) {
        await Favorites.updateOne(
          { user: req.user._id },
          { $push: { products: req.query.id } }
        );
        res.json({ status: true });
      } else {
        res.json({ status: false });
      }
    }
  } catch (err) {
    console.log(err.message);
  }
};

const getFavoriteItemDelete = async (req, res) => {
  try {
    let favorites = await Favorites.findOne({ user: req.user._id });
    let favoriteItem = favorites.products.find((elm) => {
      return elm.toString() === req.query.id;
    });
    await Favorites.updateOne(
      { user: req.user._id },
      {
        $pull: { products: favoriteItem },
      }
    );
    res.json({ status: true });
  } catch (err) {
    console.log(err.message);
  }
};

const postAddAddress = async (req, res) => {
  try {
    let addressExists = await Address.exists({ user: req.user._id });
    if (addressExists === null) {
      await Address.create({
        user: req.user._id,
        Addressess: req.body,
      });
      res.redirect("/userprofile");
    } else {
      await Address.updateOne(
        { user: req.user._id },
        {
          $push: { Addressess: req.body },
        }
      );
      res.redirect("/userprofile");
    }
  } catch (err) {
    console.log(err.message);
  }
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
      req.flash(
        "message",
        "User Already Exists (Username, Email or Phone is Already Registered)"
      );
      res.redirect("/signup");
    }
  } catch (err) {
    req.flash("message", "Something went wrong");
    res.redirect("/signup");
  }
};

const postLogin = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
});

const postOtpVerify = (req, res) => {
  try {
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
  } catch (err) {
    console.log(err.message);
  }
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
  getFavorites,
  getAddToFavorites,
  getFavoriteItemDelete,
  getUserProfile,
  getAddAddress,
  postAddAddress,
  getDeleteAddress,
};
