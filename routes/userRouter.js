const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getHome);
router.get("/login", userController.getLogin);
router.post("/login", userController.postLogin);
router.get("/signup", userController.getSignUp);
router.post("/signup", userController.postSignUp);
router.get("/cart", userController.getCart);
router.get("/contact", userController.getContact);
router.get("/shop", userController.getShop);

module.exports = router;
