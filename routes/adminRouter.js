const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const {
  productsPaginatedResults,
  usersPaginatedResults,
} = require("../utils/pagination");
const { uploadCategoryImg, uploadProductImgs } = require("../config/multer");
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
  getAddCategory,
  postAddCategory,
  getCategories,
  getDeleteCategory,
  getEditCategory,
  postEditCategory,
  getUsers,
  getBlockUser,
  getUnblockUser,
} = require("../controllers/adminController");

const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlwares/adminMiddlewares");

router
  .route("/")
  .get(checkNotAuthenticated, getLogin)
  .post(checkNotAuthenticated, postLogin);

router.route("/dash").get(checkAuthenticated, getDashboard);

router
  .route("/dash/products")
  .get(checkAuthenticated, productsPaginatedResults(Product), getProducts);

router
  .route("/dash/add-product")
  .get(checkAuthenticated, getProductAdd)
  .post(checkAuthenticated, uploadProductImgs, postProductAdd);

router
  .route("/dash/products/edit-product")
  .get(checkAuthenticated, getEditProduct)
  .post(checkAuthenticated, uploadProductImgs, postEditProduct);

router
  .route("/dash/products/delete-product")
  .get(checkAuthenticated, getDeleteProduct);

router.route("/dash/categories").get(checkAuthenticated, getCategories);

router
  .route("/dash/add-category")
  .get(checkAuthenticated, getAddCategory)
  .post(checkAuthenticated, uploadCategoryImg, postAddCategory);

router
  .route("/dash/categories/delete-category")
  .get(checkAuthenticated, getDeleteCategory);

router
  .route("/dash/categories/edit-category")
  .get(checkAuthenticated, getEditCategory)
  .post(checkAuthenticated, uploadCategoryImg, postEditCategory);

router.route("/dash/users/block-user").get(checkAuthenticated, getBlockUser);

router
  .route("/dash/users/unblock-user")
  .get(checkAuthenticated, getUnblockUser);

router
  .route("/dash/users")
  .get(checkAuthenticated, usersPaginatedResults(User), getUsers);

router.route("/adlogout").delete(deleteLogout);

module.exports = router;
