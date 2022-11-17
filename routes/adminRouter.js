const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const {
  getLogin,
  getDashboard,
  postLogin,
  getProductAdd,
  postProductAdd,
  deleteLogout,
  getProducts,
  getEditProduct,
  getDeleteProduct,
  postEditProduct,
  getOtpVerify,
  postOtpVerify,
} = require("../controllers/adminController");

const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlwares/adminMiddlewares");

router.get("/", checkNotAuthenticated, getLogin);
router.get("/dash", checkAuthenticated, getDashboard);
router.get("/dash/products", checkAuthenticated, getProducts);
router.get("/dash/add-product", checkAuthenticated, getProductAdd);
router.get("/otp-verify", checkAuthenticated, getOtpVerify);
router.get("/dash/products/edit-product", checkAuthenticated, getEditProduct);
router.get(
  "/dash/products/delete-product",
  checkAuthenticated,
  getDeleteProduct
);

router.post("/", postLogin);
router.post("/dash/add-product", checkAuthenticated, upload, postProductAdd);
router.post("/otp-verify", checkAuthenticated, postOtpVerify);
router.post(
  "/dash/products/edit-product",
  checkAuthenticated,
  upload,
  postEditProduct
);

router.delete("/adlogout", deleteLogout);

module.exports = router;
