const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

const upload = adminController.upload;

const isAuthenticated = adminController.checkAuthenticated;
const isNotAuthenticated = adminController.checkNotAuthenticated;

router.get("/", isNotAuthenticated, adminController.getLogin);
router.get("/dash", isAuthenticated, adminController.getDashboard);
router.get(
  "/dash/products/edit-product",
  isAuthenticated,
  adminController.getEditProduct
);
router.get(
  "/dash/products/delete-product",
  isAuthenticated,
  adminController.getDeleteProduct
);
router.get("/dash/products", isAuthenticated, adminController.getProducts);
router.get("/dash/add-product", isAuthenticated, adminController.getProductAdd);

router.post("/", adminController.postLogin);
router.post(
  "/dash/products/edit-product",
  isAuthenticated,
  upload,
  adminController.postEditProduct
);
router.post(
  "/dash/add-product",
  isAuthenticated,
  upload,
  adminController.postProductAdd
);

router.delete("/adlogout", adminController.deleteLogout);

module.exports = router;
