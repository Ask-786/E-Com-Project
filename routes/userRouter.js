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

router.route("/userprofile").get(checkAuthenticated, getUserProfile);

router
  .route("/userprofile/add-address")
  .get(checkAuthenticated, getAddAddress)
  .post(checkAuthenticated, postAddAddress);

router
  .route("/userprofile/delete-address")
  .get(checkAuthenticatedAxios, getDeleteAddress);

router.route("/cart").get(checkAuthenticated, getCart);

router.route("/shop/addtocart").get(checkAuthenticatedAxios, getAddToCart);

router
  .route("/cart-item-increment")
  .get(checkAuthenticatedAxios, getCartItemIncrement);

router
  .route("/cart-item-decrement")
  .get(checkAuthenticatedAxios, getCartItemDecrement);

router
  .route("/cart-item-delete")
  .get(checkAuthenticatedAxios, getCartItemDelete);

router.route("/favorites").get(checkAuthenticated, getFavorites);

router
  .route("/favorites-item-delete")
  .get(checkAuthenticatedAxios, getFavoriteItemDelete);

router
  .route("/shop/addtofavorites")
  .get(checkAuthenticatedAxios, getAddToFavorites);

router.route("/contact").get(getContact);

router.route("/shop").get(getShop);

router.route("/shop/product").get(getProduct);

router
  .route("/otp-verify")
  .get(checkNotAuthenticated, getOtpVerify)
  .post(checkNotAuthenticated, postOtpVerify);

router.route("/logout").delete(checkAuthenticated, deleteLogout);

module.exports = router;
