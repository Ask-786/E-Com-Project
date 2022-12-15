const express = require("express");

const Product = require("../models/Product");

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
} = require("../controllers/userController");

const { productPaginationResults } = require("../utils/pagination");
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

router.route("/shop").get(productPaginationResults(Product), getShop);

router.route("/shop/product").get(getProduct);

router.route("/orders").get(checkAuthenticated, checkIsBlocked, getOrders);

router
  .route("/cart/checkout")
  .get(checkAuthenticated, checkIsBlocked, getCheckout)
  .post(
    checkAuthenticatedAxios,
    checkAuthenticated,
    checkIsBlocked,
    postCheckout
  );

router
  .route("/cart/checkout/verify-payment")
  .post(
    checkAuthenticatedAxios,
    checkAuthenticated,
    checkIsBlocked,
    postVerifyPayment
  );

router
  .route("/cart/checkout/order-confirmation")
  .get(checkAuthenticated, getOrderConfirmation);

router
  .route("/cart/verify-coupon")
  .post(checkAuthenticatedAxios, checkAuthenticated, postVerifyCoupon);

router
  .route("/cart/remove-coupon")
  .patch(checkAuthenticatedAxios, checkAuthenticated, patchRemoveCoupon);

router
  .route("/orders/cancel-order")
  .patch(
    checkAuthenticatedAxios,
    checkAuthenticated,
    checkIsBlocked,
    patchCancelOrder
  );

router
  .route("/otp-verify")
  .get(checkNotAuthenticated, getOtpVerify)
  .post(checkNotAuthenticated, postOtpVerify);

router
  .route("/forgot-password")
  .get(checkNotAuthenticated, getForgotPassword)
  .post(checkNotAuthenticated, postForgotPassword);

router
  .route("/otp-verify-reset-pass")
  .get(checkNotAuthenticated, getOtpVerifyResetPass)
  .post(checkNotAuthenticated, postOtpverifyResetPass);

router
  .route("/reset-pass")
  .get(checkNotAuthenticated, getResetPass)
  .patch(checkNotAuthenticated, patchResetPass);

router
  .route("/userprofile/edit-user-details")
  .get(checkAuthenticated, getEditUserDetails)
  .post(checkAuthenticated, postEditUserDetails);

router
  .route("/userprofile/edit-address")
  .get(checkAuthenticated, getEditAddress)
  .patch(checkAuthenticated, patchEditAddress);

router.route("/shop/search").get(getSearchResult);

router.route("/logout").delete(checkAuthenticated, deleteLogout);

module.exports = router;
