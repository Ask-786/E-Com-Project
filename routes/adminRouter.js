const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

const upload = adminController.upload;

const isAuthenticated = adminController.checkAuthenticated;
const isNotAuthenticated = adminController.checkNotAuthenticated;

router.get("/", isNotAuthenticated, adminController.getLogin);
router.get("/dash", isAuthenticated, adminController.getDashboard);
router.get("/edit-product", isAuthenticated, adminController.getEditProduct);
router.get(
  "/delete-product",
  isAuthenticated,
  adminController.getDeleteProduct
);
router.get("/products", isAuthenticated, adminController.getProducts);
router.get("/add-product", isAuthenticated, adminController.getProductAdd);

router.post("/", adminController.postLogin);
router.post("/edit-product", isAuthenticated, adminController.postEditProduct);
router.post(
  "/add-product",
  isAuthenticated,
  upload,
  adminController.postProductAdd
);

router.delete("/adlogout", adminController.deleteLogout);

module.exports = router;
