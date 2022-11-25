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
  getFavorites,
  getAddToFavorites,
  getFavoriteItemDelete,
  getUserProfile,
  getAddAddress,
  postAddAddress,
  getDeleteAddress,
} = require("../controllers/userController");

const {
  checkAuthenticated,
  checkNotAuthenticated,
  checkAuthenticatedAxios,
  checkIsBlocked,
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

router
  .route("/userprofile")
  .get(checkAuthenticated, checkIsBlocked, getUserProfile);

router
  .route("/userprofile/add-address")
  .get(checkAuthenticated, checkIsBlocked, getAddAddress)
  .post(checkAuthenticated, checkIsBlocked, postAddAddress);

router
  .route("/userprofile/delete-address")
  .get(checkAuthenticatedAxios, checkIsBlocked, getDeleteAddress);

router.route("/cart").get(checkAuthenticated, checkIsBlocked, getCart);

router
  .route("/shop/addtocart")
  .get(checkAuthenticatedAxios, checkIsBlocked, getAddToCart);

router
  .route("/cart-item-increment")
  .get(checkAuthenticatedAxios, checkIsBlocked, getCartItemIncrement);

router
  .route("/cart-item-decrement")
  .get(checkAuthenticatedAxios, checkIsBlocked, getCartItemDecrement);

router
  .route("/cart-item-delete")
  .get(checkAuthenticatedAxios, checkIsBlocked, getCartItemDelete);

router
  .route("/favorites")
  .get(checkAuthenticated, checkIsBlocked, getFavorites);

router
  .route("/favorites-item-delete")
  .get(checkAuthenticatedAxios, checkIsBlocked, getFavoriteItemDelete);

router
  .route("/shop/addtofavorites")
  .get(checkAuthenticatedAxios, checkIsBlocked, getAddToFavorites);

router.route("/contact").get(getContact);

router.route("/shop").get(getShop);

router.route("/shop/product").get(getProduct);

router
  .route("/otp-verify")
  .get(checkNotAuthenticated, getOtpVerify)
  .post(checkNotAuthenticated, postOtpVerify);

router.route("/logout").delete(checkAuthenticated, deleteLogout);

module.exports = router;
