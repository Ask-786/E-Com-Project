const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

const isAuthenticated = adminController.checkAuthenticated;
const isNotAuthenticated = adminController.checkNotAuthenticated;
const checkAdmin = adminController.checkAdmin;

router.get("/", adminController.getLogin);
router.get("/dash", isAuthenticated, checkAdmin, adminController.getDashboard);
router.get(
  "/add-product",
  isAuthenticated,
  checkAdmin,
  adminController.getProductAdd
);

router.post("/", adminController.postLogin);
router.post(
  "/add-product",
  isAuthenticated,
  checkAdmin,
  adminController.postProductAdd
);

router.delete("/adlogout", adminController.deleteLogout);

module.exports = router;
