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
} = require("../controllers/userController");

const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlwares/userMiddlewares");

router.get("/", getHome);
router.get("/login", checkNotAuthenticated, getLogin);
router.get("/signup", checkNotAuthenticated, getSignUp);
router.get("/cart", checkAuthenticated, getCart);
router.get("/contact", getContact);
router.get("/shop", getShop);
router.get("/product", checkAuthenticated, getProduct);
router.get("/otp-verify", checkAuthenticated, getOtpVerify);

router.post("/login", checkNotAuthenticated, postLogin);
router.post("/signup", checkNotAuthenticated, postSignUp);
router.post("/otp-verify", checkAuthenticated, postOtpVerify);

router.delete("/logout", deleteLogout);

module.exports = router;
