const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/userController");

const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlwares/userMiddlewares");

router.route("/").get(getHome);

router
  .route("/login")
  .get(checkNotAuthenticated, getLogin)
  .post(checkNotAuthenticated, postLogin);

router
  .route("/signup")
  .get(checkNotAuthenticated, getSignUp)
  .post(checkNotAuthenticated, postSignUp);

router.route("/cart").get(checkAuthenticated, getCart);

router.route("/contact").get(getContact);

router.route("/shop").get(getShop);

router.route("/shop/product").get(getProduct);

router
  .route("/otp-verify")
  .get(checkNotAuthenticated, getOtpVerify)
  .post(checkNotAuthenticated, postOtpVerify);

router.route("/shop/addtocart").get(checkAuthenticated, getAddToCart);

router
  .route("/cart-item-increment")
  .get(checkAuthenticated, getCartItemIncrement);

router
  .route("/cart-item-decrement")
  .get(checkAuthenticated, getCartItemDecrement);

router.route("/cart-item-delete").get(checkAuthenticated, getCartItemDelete);

router.route("/logout").delete(checkAuthenticated, deleteLogout);

module.exports = router;
