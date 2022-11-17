const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const isAuthenticated = userController.checkAuthenticated;
const isNotAuthenticated = userController.checkNotAuthenticated;

router.get("/", userController.getHome);
router.get("/login", isNotAuthenticated, userController.getLogin);
router.get("/signup", isNotAuthenticated, userController.getSignUp);
router.get("/cart", isAuthenticated, userController.getCart);
router.get("/contact", userController.getContact);
router.get("/shop", userController.getShop);
router.get("/product", isAuthenticated, userController.getProduct);
router.get("/otp-verify", isAuthenticated, userController.getOtpVerify);
router.post("/login", isNotAuthenticated, userController.postLogin);
router.post("/signup", isNotAuthenticated, userController.postSignUp);
router.post("/otp-verify", isAuthenticated, userController.postOtpVerify);
router.delete("/logout", userController.deleteLogout);

module.exports = router;
