const passport = require("passport");
const mongoose = require("mongoose");
const moment = require("moment");
const User = require("../models/User");
const Address = require("../models/Address");
const Cart = require("../models/Cart");
const Orders = require("../models/Orders");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Favorites = require("../models/Favorites");
const { placeOrder } = require("../utils/place-order");
const { createOrderRz, verifyPayment } = require("../services/razorpay");
const initializePassport = require("../config/passport-config");
const { validateSignup } = require("../utils/joi-validation");
const Coupon = require("../models/Coupons");
const {
  sendVerifyToken,
  checkVerificationToken,
} = require("../services/twilio");

initializePassport(passport);

const getHome = async (req, res, next) => {
  try {
    const category = await Category.find({});
    const product = await Product.find({})
      .populate("category")
      .sort({ updatedAt: -1 })
      .limit(12);
    res.render("user-views/home", {
      search: true,
      name: req.user,
      product,
      category,
      title: "Persuit",
    });
  } catch (err) {
    next(err);
  }
};

const getLogin = (req, res) => {
  res.render("user-views/login", {
    search: false,
    message: req.flash("message"),
    title: "Persuit: Login",
  });
};

const getUserProfile = async (req, res, next) => {
  try {
    const Addresses = await Address.findOne({ user: req.user._id });
    res.render("user-views/profile", {
      search: false,
      user: req.user,
      address: Addresses,
      message: req.flash("message"),
      title: "Persuit: Profile",
    });
  } catch (err) {
    next(err);
  }
};

const getAddAddress = (req, res) => {
  if (req.query.from === "checkOut") {
    res.render("user-views/add-address", {
      search: false,
      title: "Persuit: Add Address",
      from: req.query.from,
    });
  } else {
    res.render("user-views/add-address", {
      search: false,
      title: "Persuit: Add Address",
      from: null,
    });
  }
};

const getDeleteAddress = async (req, res, next) => {
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
    next(err);
  }
};

const getOtpVerify = (req, res) => {
  res.render("user-views/otp-verify", {
    search: false,
    title: "Persuit: OTP Verify",
  });
};

const getSignUp = (req, res) => {
  res.render("user-views/signup", {
    search: false,
    message: req.flash("message"),
    title: "Persuit: SignUp",
  });
};

const getContact = (req, res) => {
  res.render("user-views/contact", {
    search: false,
    title: "Persuit: Contact Us",
  });
};

const getShop = async (req, res, next) => {
  try {
    if (req.query.searchData) {
      const products = {};
      const { searchData } = req.query;
      const regEx = new RegExp(searchData, "i");
      products.results = await Product.find({
        $or: [{ title: { $regex: regEx } }, { description: { $regex: regEx } }],
      });
      if (products.results.length > 0) {
        const category = await Category.find({});
        res.render("user-views/shop", {
          pagination: false,
          message: req.flash("message"),
          search: true,
          products,
          category,
          title: "Persuit: Shop",
        });
      } else {
        req.flash("message", "No Search Results");
        res.redirect("/shop");
      }
    } else if (req.query.category) {
      const products = await Product.find({ category: req.query.category });
      if (products.length > 0) {
        res.json({ products, status: true });
      } else {
        res.json({ status: false });
      }
    } else {
      const category = await Category.find({});
      const products = res.paginatedResults;
      res.render("user-views/shop", {
        pagination: true,
        message: req.flash("message"),
        search: true,
        products,
        category,
        title: "Persuit: Shop",
      });
    }
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.id);
    res.render("user-views/product", {
      search: true,
      product,
      title: `Persuit: ${product.title}`,
    });
  } catch (err) {
    next(err);
  }
};

const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
      isexpired: false,
    })
      .populate({
        path: "bucket",
        populate: {
          path: "products",
        },
      })
      .populate("couponDetails");

    if (cart !== null && cart.bucket.length > 0) {
      if (
        cart.coupon === true &&
        cart.couponDetails.deductionType === "percentage"
      ) {
        const discount = (cart.grandtotal / 100) * cart.couponDetails.deduction;
        if (discount <= cart.couponDetails.maxLimit) {
          const total = cart.grandtotal - discount;
          res.render("user-views/cart", {
            search: false,
            title: "Persuit: Cart",
            message: req.flash("message"),
            max: false,
            cart,
            total,
            discount,
            grandtotal: cart.grandtotal,
            deduction: cart.couponDetails.deduction,
            type: "percentage",
          });
        } else {
          const total = cart.grandtotal - cart.couponDetails.maxLimit;
          res.render("user-views/cart", {
            search: false,
            title: "Persuit: Cart",
            message: req.flash("message"),
            max: true,
            cart,
            total,
            discount: cart.couponDetails.maxLimit,
            grandtotal: cart.grandtotal,
            deduction: cart.couponDetails.deduction,
            type: "percentage",
          });
        }
      } else if (
        cart.coupon === true &&
        cart.couponDetails.deductionType === "amount"
      ) {
        const discount = cart.couponDetails.deduction;
        const total = cart.grandtotal - discount;
        res.render("user-views/cart", {
          search: false,
          title: "Persuit: Cart",
          message: req.flash("message"),
          cart,
          total,
          grandtotal: cart.grandtotal,
          deduction: cart.couponDetails.deduction,
          discount,
          type: "amount",
        });
      } else {
        const total = cart.grandtotal;
        res.render("user-views/cart", {
          search: false,
          title: "Persuit: Cart",
          message: req.flash("message"),
          cart,
          total,
          grandtotal: cart.grandtotal,
        });
      }
    } else {
      res.render("user-views/empty-cart", {
        search: false,
        title: "Persuit: Cart",
      });
    }
  } catch (err) {
    next(err);
  }
};

const getAddToCart = async (req, res, next) => {
  try {
    const cartExists = await Cart.findOne({
      user: req.user._id,
      isexpired: false,
    });
    const product = await Product.findById(req.query.id);
    if (product.stock > 0) {
      if (cartExists === null) {
        await Cart.create({
          user: req.user._id,
          bucket: { products: req.query.id, subtotal: product.price },
          grandtotal: product.price,
        });
        res.json({ alert: true });
      } else {
        const itemExists = await Cart.exists({
          user: req.user._id,
          isexpired: false,
          "bucket.products": req.query.id,
        });
        if (itemExists === null) {
          await Cart.updateOne(
            { user: req.user._id, isexpired: false },
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
          res.json({
            alert: false,
            message: "Item already exists in the cart",
          });
        }
      }
    } else {
      res.json({ alert: false, message: "No Stock" });
    }
  } catch (err) {
    next(err);
  }
};

const getCartItemIncrement = async (req, res, next) => {
  try {
    const id = mongoose.Types.ObjectId(req.query.id);
    const product = await Product.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: "carts",
          let: { product: "$_id" },
          pipeline: [
            {
              $match: {
                user: req.user._id,
                isexpired: false,
              },
            },
          ],
          as: "userCart",
        },
      },
    ]);

    const userCartItem = product[0].userCart[0].bucket.find(
      (elm) => elm.products.toString() === req.query.id
    );

    if (product[0].stock > userCartItem.quantity) {
      await Cart.updateOne(
        {
          user: req.user._id,
          isexpired: false,
          "bucket.products": req.query.id,
        },
        {
          $inc: {
            "bucket.$.quantity": 1,
            "bucket.$.subtotal": product[0].price,
            grandtotal: product[0].price,
          },
        }
      );

      const cart = await Cart.findOne({
        user: req.user._id,
        isexpired: false,
        "bucket.products": req.query.id,
      }).populate("couponDetails");
      const cartItem = cart.bucket.find(
        (elm) => elm.products.toString() === req.query.id
      );

      if (
        cart.coupon === true &&
        cart.couponDetails.deductionType === "percentage"
      ) {
        const discount = (cart.grandtotal / 100) * cart.couponDetails.deduction;
        if (discount <= cart.couponDetails.maxLimit) {
          const total = cart.grandtotal - discount;
          res.json({
            max: false,
            count: cartItem.quantity,
            subtotal: cartItem.subtotal,
            grandtotal: cart.grandtotal,
            discount,
            deduction: cart.couponDetails.deduction,
            total,
            type: "percentage",
          });
        } else {
          const total = cart.grandtotal - cart.couponDetails.maxLimit;
          res.json({
            max: true,
            count: cartItem.quantity,
            subtotal: cartItem.subtotal,
            grandtotal: cart.grandtotal,
            discount: cart.couponDetails.maxLimit,
            deduction: cart.couponDetails.deduction,
            total,
            type: "percentage",
          });
        }
      } else if (
        cart.coupon === true &&
        cart.couponDetails.deductionType === "amount"
      ) {
        const discount = cart.couponDetails.deduction;
        const total = cart.grandtotal - discount;
        res.json({
          count: cartItem.quantity,
          subtotal: cartItem.subtotal,
          grandtotal: cart.grandtotal,
          discount,
          total,
          deduction: cart.couponDetails.deduction,
          type: "amount",
        });
      } else {
        res.json({
          count: cartItem.quantity,
          subtotal: cartItem.subtotal,
          grandtotal: cart.grandtotal,
        });
      }
    } else {
      res.json({ noStock: true });
    }
  } catch (err) {
    next(err);
  }
};

const getCartItemDecrement = async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);
    const preCart = await Cart.findOne({
      user: req.user._id,
      isexpired: false,
      "bucket.products": req.query.id,
    }).populate("couponDetails");

    if (
      preCart.coupon === true &&
      preCart.grandtotal - product.price < preCart.couponDetails.minAmount
    ) {
      return res.json({
        status: false,
        message: `Cant decrement the item lessthan the limited amount of ${preCart.couponDetails.minAmount}. else remove the coupon`,
      });
    }

    const cart = await Cart.findOneAndUpdate(
      {
        user: req.user._id,
        isexpired: false,
        "bucket.products": req.query.id,
      },
      {
        $inc: {
          "bucket.$.quantity": -1,
          "bucket.$.subtotal": -product.price,
          grandtotal: -product.price,
        },
      },
      { new: true }
    ).populate("couponDetails");

    const cartItem = cart.bucket.find(
      (elm) => elm.products.toString() === req.query.id
    );

    if (
      cart.coupon === true &&
      cart.couponDetails.deductionType === "percentage"
    ) {
      const discount = (cart.grandtotal / 100) * cart.couponDetails.deduction;
      if (discount <= cart.couponDetails.maxLimit) {
        const total = cart.grandtotal - discount;
        res.json({
          max: false,
          status: true,
          count: cartItem.quantity,
          subtotal: cartItem.subtotal,
          grandtotal: cart.grandtotal,
          discount,
          deduction: cart.couponDetails.deduction,
          total,
          type: "percentage",
        });
      } else {
        const total = cart.grandtotal - cart.couponDetails.maxLimit;
        res.json({
          max: true,
          status: true,
          count: cartItem.quantity,
          subtotal: cartItem.subtotal,
          grandtotal: cart.grandtotal,
          discount: cart.couponDetails.maxLimit,
          deduction: cart.couponDetails.deduction,
          total,
          type: "percentage",
        });
      }
    } else if (
      cart.coupon === true &&
      cart.couponDetails.deductionType === "amount"
    ) {
      const discount = cart.couponDetails.deduction;
      const total = cart.grandtotal - discount;
      res.json({
        status: true,
        count: cartItem.quantity,
        subtotal: cartItem.subtotal,
        grandtotal: cart.grandtotal,
        discount,
        total,
        type: "amount",
      });
    } else {
      res.json({
        status: true,
        count: cartItem.quantity,
        subtotal: cartItem.subtotal,
        grandtotal: cart.grandtotal,
      });
    }
  } catch (err) {
    res.json({ status: false, message: err.message });
  }
};

const getCartItemDelete = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
      isexpired: false,
    }).populate("couponDetails");

    const cartItem = cart.bucket.find(
      (elm) => elm.products.toString() === req.query.id
    );

    if (
      cart.coupon === true &&
      cart.grandtotal - cartItem.subtotal < cart.couponDetails.minAmount
    ) {
      return res.json({
        status: false,
        message:
          "Cant Delete the item less than the limited amount. else remove the coupon",
      });
    }

    await Cart.updateOne(
      {
        user: req.user._id,
        isexpired: false,
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

    const cartAfter = await Cart.findOne({
      user: req.user._id,
      isexpired: false,
    });

    res.json({
      grandtotal: cartAfter.grandtotal,
      status: true,
    });
  } catch (err) {
    res.json({
      status: false,
      message: err.message,
    });
  }
};

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorites.findOne({ user: req.user._id }).populate(
      "products"
    );
    if (favorites !== null && favorites.products.length > 0) {
      res.render("user-views/favorites", {
        search: false,
        products: favorites.products,
        title: "Persuit: Favorites",
      });
    } else {
      res.render("user-views/empty-favorites", {
        search: false,
        title: "Persuit: Favorites",
      });
    }
  } catch (err) {
    next(err);
  }
};

const getAddToFavorites = async (req, res, next) => {
  try {
    const favoritesExists = await Favorites.exists({ user: req.user._id });

    if (favoritesExists === null) {
      await Favorites.create({
        user: req.user._id,
        products: req.query.id,
      });
      res.json({ status: true });
    } else {
      const itemExists = await Favorites.exists({
        user: req.user._id,
        products: req.query.id,
      });
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
    next(err);
  }
};

const getFavoriteItemDelete = async (req, res, next) => {
  try {
    const favorites = await Favorites.findOne({ user: req.user._id });
    const favoriteItem = favorites.products.find(
      (elm) => elm.toString() === req.query.id
    );
    await Favorites.updateOne(
      { user: req.user._id },
      {
        $pull: { products: favoriteItem },
      }
    );
    res.json({ status: true });
  } catch (err) {
    next(err);
  }
};

const getCheckout = async (req, res, next) => {
  try {
    const userCart = await Cart.findOne({
      user: req.user._id,
      isexpired: false,
    })
      .populate("bucket.products")
      .populate("couponDetails");

    if (userCart !== null) {
      userCart.bucket.forEach((product) => {
        if (product.quantity > product.products.stock) {
          req.flash(
            "message",
            `${product.products.title} is not in stock right now`
          );
          return res.redirect("/cart");
        }
      });

      const userAddress = await Address.findOne({ user: req.user._id });

      if (
        userCart.coupon === true &&
        userCart.couponDetails.deductionType === "percentage"
      ) {
        const discount =
          (userCart.grandtotal / 100) * userCart.couponDetails.deduction;
        if (discount <= userCart.couponDetails.maxLimit) {
          const total = userCart.grandtotal - discount;
          res.render("user-views/checkout", {
            search: false,
            title: "Persuit: Checkout",
            max: false,
            cart: userCart,
            total,
            discount,
            grandtotal: userCart.grandtotal,
            deduction: userCart.couponDetails.deduction,
            type: "percentage",
            address: userAddress,
          });
        } else {
          const total = userCart.grandtotal - userCart.couponDetails.maxLimit;
          res.render("user-views/checkout", {
            search: false,
            title: "Persuit: Checkout",
            max: true,
            cart: userCart,
            total,
            discount: userCart.couponDetails.maxLimit,
            grandtotal: userCart.grandtotal,
            deduction: userCart.couponDetails.deduction,
            type: "percentage",
            address: userAddress,
          });
        }
      } else if (
        userCart.coupon === true &&
        userCart.couponDetails.deductionType === "amount"
      ) {
        const discount = userCart.couponDetails.deduction;
        const total = userCart.grandtotal - discount;
        res.render("user-views/checkout", {
          search: false,
          title: "Persuit: Checkout",
          cart: userCart,
          total,
          grandtotal: userCart.grandtotal,
          deduction: userCart.couponDetails.deduction,
          discount,
          type: "amount",
          address: userAddress,
        });
      } else {
        const total = userCart.grandtotal;
        res.render("user-views/checkout", {
          search: false,
          title: "Persuit: Checkout",
          cart: userCart,
          total,
          grandtotal: userCart.grandtotal,
          address: userAddress,
        });
      }
    } else {
      res.redirect("/cart");
    }
  } catch (err) {
    next(err);
  }
};

const getOrderConfirmation = async (req, res, next) => {
  try {
    const preOrder = await Orders.findById(req.query.id).populate("cart");
    const preOrder1 = await Coupon.populate(preOrder, {
      path: "cart.couponDetails",
    });
    const order = await Product.populate(preOrder1, {
      path: "cart.bucket.products",
    });
    res.render("user-views/order-confirm", {
      search: false,
      order,
      user: req.user,
      title: "Persuit: Thank You for Your Order!!",
    });
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const preOrders = await Orders.find({ user: req.user._id })
      .populate("cart")
      .sort({ updatedAt: -1 });
    const preOrders1 = await Coupon.populate(preOrders, {
      path: "cart.couponDetails",
    });
    const orders = await Product.populate(preOrders1, {
      path: "cart.bucket.products",
    });
    const formatedOrders = orders.map((el) => {
      let newEl = { ...el._doc };
      newEl.createdAt = moment(newEl.createdAt).format("LL");
      return newEl;
    });
    if (formatedOrders.length > 0) {
      res.render("user-views/orders", {
        search: false,
        title: "Persuit: Your Orders",
        orders: formatedOrders,
        message: req.flash("message"),
      });
    } else {
      res.render("user-views/empty-orders", {
        search: false,
        title: "Persuit: Your Orders",
      });
    }
  } catch (err) {
    next(err);
  }
};

const getForgotPassword = (req, res, next) => {
  res.render("user-views/forgot-pass", {
    search: false,
    message: req.flash("message"),
    title: "Persuit: Rest Password",
  });
};

const getOtpVerifyResetPass = (req, res, next) => {
  res.render("user-views/otp-verify-reset-pass", {
    search: false,
    title: "Persuit: Enter OTP",
  });
};

const getResetPass = (req, res, next) => {
  if (req.session.temp) {
    res.render("user-views/reset-pass", {
      search: false,
      title: "Persuit: Reset Password",
    });
  } else {
    res.redirect("/login");
  }
};

const getEditUserDetails = async (req, res, next) => {
  res.render("user-views/edit-user-details", {
    search: false,
    title: "Persuit: Update User Details",
    user: req.user,
  });
};

const getSearchResult = async (req, res, next) => {
  const { searchData } = req.query;
  const regEx = new RegExp(searchData, "i");
  const products = await Product.find({
    $or: [{ title: { $regex: regEx } }, { description: { $regex: regEx } }],
  });
  res.json({ status: true, products });
};

const getEditAddress = async (req, res, next) => {
  try {
    const allAddress = await Address.findOne({ user: req.user._id });
    const address = allAddress.Addressess.find((el) => el._id == req.query.id);
    res.render("user-views/edit-address", {
      search: false,
      title: "Persuit: Edit Address",
      address,
    });
  } catch (err) {
    next(err);
  }
};

const postEditUserDetails = async (req, res, next) => {
  const { username, fullname, phone, email } = req.body;
  try {
    const user = await User.findById(req.user._id);
    user.username = username;
    user.fullname = fullname;
    user.phone = phone;
    user.email = email;
    await user.save();
    res.redirect("/userprofile");
  } catch (err) {
    next(err);
  }
};

const postCheckout = async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.body.cartId).populate("couponDetails");
    if (
      cart.coupon === true &&
      cart.couponDetails.deductionType === "percentage"
    ) {
      if (req.body.payType === "Cash on Delivery") {
        const Addressess = await Address.findOne({ user: req.user._id });
        const address = Addressess.Addressess.find(
          (elm) => elm._id.toString() === req.body.address
        );
        const discount = (cart.grandtotal / 100) * cart.couponDetails.deduction;
        if (discount <= cart.couponDetails.maxLimit) {
          placeOrder(
            req.user._id,
            req.body.cartId,
            address,
            req.body.payType,
            "pending",
            "",
            cart.grandtotal - discount
          ).then((order) => {
            res.json({ order, codStatus: true });
          });
        } else {
          placeOrder(
            req.user._id,
            req.body.cartId,
            address,
            req.body.payType,
            "pending",
            "",
            cart.grandtotal - cart.couponDetails.maxLimit
          ).then((order) => {
            res.json({ order, codStatus: true });
          });
        }
      } else {
        const discount = (cart.grandtotal / 100) * cart.couponDetails.deduction;
        if (discount <= cart.couponDetails.maxLimit) {
          const amount =
            cart.grandtotal -
            (cart.grandtotal / 100) * cart.couponDetails.deduction;
          createOrderRz(amount, req.body.cartId)
            .then((val) => {
              res.json({
                rzSuccess: true,
                order: val,
                keyId: process.env.RAZORPAY_KEY_ID,
                user: req.user,
                address: req.body.address,
                payType: req.body.payType,
              });
            })
            .catch((err) => {
              res.json({
                rzError: true,
                message: err.error,
              });
            });
        } else {
          const amount = cart.grandtotal - cart.couponDetails.maxLimit;
          createOrderRz(amount, req.body.cartId)
            .then((val) => {
              res.json({
                rzSuccess: true,
                order: val,
                keyId: process.env.RAZORPAY_KEY_ID,
                user: req.user,
                address: req.body.address,
                payType: req.body.payType,
              });
            })
            .catch((err) => {
              res.json({
                rzError: true,
                message: err.error,
              });
            });
        }
      }
    } else if (
      cart.coupon === true &&
      cart.couponDetails.deductionType === "amount"
    ) {
      if (req.body.payType === "Cash on Delivery") {
        const Addressess = await Address.findOne({ user: req.user._id });
        const address = Addressess.Addressess.find(
          (elm) => elm._id.toString() === req.body.address
        );
        placeOrder(
          req.user._id,
          req.body.cartId,
          address,
          req.body.payType,
          "pending",
          "",
          cart.grandtotal - cart.couponDetails.deduction
        ).then((order) => {
          res.json({ order, codStatus: true });
        });
      } else {
        const amount = cart.grandtotal - cart.couponDetails.deduction;
        createOrderRz(amount, req.body.cartId)
          .then((val) => {
            res.json({
              rzSuccess: true,
              order: val,
              keyId: process.env.RAZORPAY_KEY_ID,
              user: req.user,
              address: req.body.address,
              payType: req.body.payType,
            });
          })
          .catch((err) => {
            res.json({
              rzError: true,
              message: err.error,
            });
          });
      }
    } else {
      if (req.body.payType === "Cash on Delivery") {
        const Addressess = await Address.findOne({ user: req.user._id });
        const address = Addressess.Addressess.find(
          (elm) => elm._id.toString() === req.body.address
        );
        placeOrder(
          req.user._id,
          req.body.cartId,
          address,
          req.body.payType,
          "pending",
          "",
          cart.grandtotal
        ).then((order) => {
          res.json({ order, codStatus: true });
        });
      } else {
        createOrderRz(cart.grandtotal, req.body.cartId)
          .then((val) => {
            res.json({
              rzSuccess: true,
              order: val,
              keyId: process.env.RAZORPAY_KEY_ID,
              user: req.user,
              address: req.body.address,
              payType: req.body.payType,
            });
          })
          .catch((err) => {
            res.json({
              rzError: true,
              message: err.error,
            });
          });
      }
    }
  } catch (err) {
    next(err);
  }
};

const postAddAddress = async (req, res, next) => {
  try {
    const addressExists = await Address.exists({ user: req.user._id });
    if (addressExists === null) {
      await Address.create({
        user: req.user._id,
        Addressess: req.body,
      });
      if (req.query.from === "checkOut") {
        res.redirect("/cart/checkout");
      } else {
        res.redirect("/userprofile");
      }
    } else {
      await Address.updateOne(
        { user: req.user._id },
        {
          $push: { Addressess: req.body },
        }
      );
      if (req.query.from === "checkOut") {
        res.redirect("/cart/checkout");
      } else {
        res.redirect("/userprofile");
      }
    }
  } catch (err) {
    next(err);
  }
};

const postSignUp = async (req, res) => {
  const { error } = validateSignup(req.body);
  if (error) {
    req.flash("message", error.message);
    res.redirect("/signup");
  } else {
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
  }
};

const postForgotPassword = async (req, res, next) => {
  const { nameOrEmail } = req.body;
  const user = await User.findOne({
    $or: [{ email: nameOrEmail }, { username: nameOrEmail }],
    isadmin: false,
  });
  if (user !== null) {
    req.session.temp = user;
    sendVerifyToken(user.phone).then(() => {
      res.redirect("/otp-verify-reset-pass");
    });
  } else {
    req.flash("message", "There is no such user with that username or email");
    res.redirect("/forgot-password");
  }
};

const postLogin = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
});

const postOtpVerify = (req, res, next) => {
  try {
    checkVerificationToken(req.session.temp.phone, req.body.otp).then(
      (status) => {
        if (status === "approved") {
          User.create(req.session.temp).then(() => {
            req.logOut(() => {
              res.redirect("/login");
            });
          });
        } else {
          req.logOut(() => {
            req.flash("message", "Wrong OTP");
            res.redirect("/signup");
          });
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

const postOtpverifyResetPass = (req, res, next) => {
  try {
    checkVerificationToken(req.session.temp.phone, req.body.otp).then(
      (status) => {
        if (status === "approved") {
          res.redirect("/reset-pass");
        } else {
          req.logOut(() => {
            req.flash("message", "Wrong OTP");
            res.redirect("/forgot-password");
          });
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

const patchResetPass = async (req, res, next) => {
  const user = await User.findById(req.session.temp._id);
  user.password = req.body.password;
  try {
    await user.save();
    req.flash("message", "password reset successfully");
    res.redirect("/login");
  } catch (err) {
    req.flash("message", "something went wrong");
    res.redirect("/forgot-password");
  }
};

const postVerifyPayment = async (req, res, next) => {
  try {
    verifyPayment(req.body.response).then(async (response) => {
      if (response.signatureIsValid) {
        const cartId = req.body.order.receipt;
        const cart = await Cart.findById(cartId).populate("couponDetails");
        const Addressess = await Address.findOne({ user: req.user._id });
        const address = Addressess.Addressess.find(
          (elm) => elm._id.toString() === req.body.addressId
        );
        if (
          cart.coupon === true &&
          cart.couponDetails.deductionType === "percentage"
        ) {
          const discount =
            (cart.grandtotal / 100) * cart.couponDetails.deduction;
          if (discount <= cart.couponDetails.maxLimit) {
            placeOrder(
              req.user._id,
              cartId,
              address,
              req.body.payType,
              "success",
              req.body.response.razorpay_payment_id,
              cart.grandtotal - discount
            ).then((order) => {
              res.json({ order, rzStatus: true });
            });
          } else {
            placeOrder(
              req.user._id,
              cartId,
              address,
              req.body.payType,
              "success",
              req.body.response.razorpay_payment_id,
              cart.grandtotal - cart.couponDetails.maxLimit
            ).then((order) => {
              res.json({ order, rzStatus: true });
            });
          }
        } else if (
          cart.coupon === true &&
          cart.couponDetails.deductionType === "amount"
        ) {
          placeOrder(
            req.user._id,
            cartId,
            address,
            req.body.payType,
            "success",
            req.body.response.razorpay_payment_id,
            cart.grandtotal - cart.couponDetails.deduction
          ).then((order) => {
            res.json({ order, rzStatus: true });
          });
        } else {
          placeOrder(
            req.user._id,
            cartId,
            address,
            req.body.payType,
            "success",
            req.body.response.razorpay_payment_id,
            cart.grandtotal
          ).then((order) => {
            res.json({ order, rzStatus: true });
          });
        }
      } else {
        res.json({ rzStatus: false });
      }
    });
  } catch (err) {
    next(err);
  }
};

const postVerifyCoupon = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id, isexpired: false });
    const coupon = await Coupon.findOne({ couponCode: req.body.couponCode });
    if (coupon !== null) {
      const userCheck = coupon.users.includes(req.user._id);
      const expr = moment(coupon.expiryDate).format();
      const now = moment(Date.now()).format();
      if (coupon.diactivated === true) {
        res.json({
          status: false,
          message: "This coupon was removed by admins for some reason",
        });
      } else if (now > expr) {
        res.json({
          status: false,
          message: "This coupon is expired",
        });
      } else if (userCheck === true) {
        res.json({
          status: false,
          message: "You have already availed this coupon",
        });
      } else if (coupon.minAmount > cart.grandtotal) {
        res.json({
          status: false,
          message: `This coupon is applicable only for purchases above $ ${coupon.minAmount}`,
        });
      } else if (coupon.users.length === coupon.maxUsers) {
        res.json({
          status: false,
          message: `This coupon was available only for limited number of persons`,
        });
      } else {
        const updatedCart = await Cart.findOneAndUpdate(
          {
            user: req.user._id,
            isexpired: false,
          },
          { coupon: true, couponDetails: coupon._id },
          { new: true }
        ).populate("couponDetails");
        coupon.users.push(req.user._id);
        await coupon.save();
        if (coupon.deductionType === "percentage") {
          const discount = (updatedCart.grandtotal / 100) * coupon.deduction;
          if (discount <= coupon.maxLimit) {
            const total = updatedCart.grandtotal - discount;
            res.json({
              max: false,
              status: true,
              total,
              discount,
              type: "percentage",
              deduction: coupon.deduction,
            });
          } else {
            const total = updatedCart.grandtotal - coupon.maxLimit;
            res.json({
              max: true,
              status: true,
              total,
              discount: coupon.maxLimit,
              type: "percentage",
              deduction: coupon.deduction,
            });
          }
        } else {
          const discount = coupon.deduction;
          const total = updatedCart.grandtotal - discount;
          res.json({
            status: true,
            total,
            discount,
            type: "amount",
            deduction: coupon.deduction,
          });
        }
      }
    } else {
      res.json({ status: false, message: "There is no such coupon!!" });
    }
  } catch (err) {
    res.json({ status: false, message: "Something went wrong!!!" });
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

const patchCancelOrder = async (req, res, next) => {
  try {
    await Orders.updateOne(
      { _id: req.body.orderId },
      { orderStatus: "cancelled" }
    );
    req.flash("message", "Order Cancelled Successfully");
    res.json({ status: true, orderStatus: "cancelled" });
  } catch (err) {
    next(err);
  }
};

const patchRemoveCoupon = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
      isexpired: false,
    }).populate("couponDetails");
    const coupon = await Coupon.findById(cart.couponDetails._id);
    const userIndex = coupon.users.indexOf(
      mongoose.Types.ObjectId(req.user._id)
    );

    if (userIndex !== -1) {
      coupon.users.splice(userIndex, 1);
    }

    cart.coupon = false;
    cart.couponDetails = null;

    await cart.save();
    await coupon.save();

    res.json({ removeStatus: true });
  } catch (err) {
    res.json({ removeStatus: false, message: err.message });
  }
};

const patchEditAddress = async (req, res, next) => {
  try {
    const allAddress = await Address.findOne({ user: req.user._id });
    const address = allAddress.Addressess.map((el) => {
      if (el._id == req.body._id) {
        el = req.body;
      }
      return el;
    });
    allAddress.Addressess = address;
    await allAddress.save();
    req.flash("message", "Address Updated Successfully");
    res.redirect("/userprofile");
  } catch (err) {
    next(err);
  }
};

const deleteLogout = (req, res) => {
  req.logOut(() => {
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
  getCheckout,
  postCheckout,
  getOrderConfirmation,
  getOrders,
  postVerifyPayment,
  patchCancelOrder,
  postVerifyCoupon,
  patchRemoveCoupon,
  getForgotPassword,
  postForgotPassword,
  getOtpVerifyResetPass,
  postOtpverifyResetPass,
  getResetPass,
  patchResetPass,
  getEditUserDetails,
  postEditUserDetails,
  getEditAddress,
  patchEditAddress,
  getSearchResult,
};
