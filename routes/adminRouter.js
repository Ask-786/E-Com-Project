const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Orders");
const Product = require("../models/Product");
const {
  productsPaginatedResults,
  usersPaginatedResults,
  orderPaginationResults,
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
  getOrders,
  getUserDetails,
  patchOrderDetails,
  getOrderDetails,
  getCoupons,
  getAdddCoupons,
  postAddCoupon,
  getPieChartDetails,
  getSalesReport,
  getBarChartDetails,
  postQueriedSalesReport,
  getProductDetails,
  getCouponDetails,
  getEditCoupon,
  patchEditCoupon,
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
  .route("/dash/products/disable-product")
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

router
  .route("/dash/users/user-details")
  .get(checkAuthenticated, getUserDetails);

router
  .route("/dash/users/user-details/update-order")
  .patch(checkAuthenticated, patchOrderDetails);

router
  .route("/dash/orders/order-details")
  .get(checkAuthenticated, getOrderDetails)
  .patch(checkAuthenticated, patchOrderDetails);

router.route("/dash/orders").get(checkAuthenticated, getOrders);

router.route("/dash/coupons").get(checkAuthenticated, getCoupons);

router
  .route("/dash/add-coupon")
  .get(checkAuthenticated, getAdddCoupons)
  .post(checkAuthenticated, postAddCoupon);

router
  .route("/dash/getPieChartDetails")
  .get(checkAuthenticated, getPieChartDetails);

router
  .route("/dash/getBarChartDetails")
  .get(checkAuthenticated, getBarChartDetails);

router
  .route("/dash/sales-report")
  .get(checkAuthenticated, orderPaginationResults(Order), getSalesReport);

router
  .route("/dash/queried-sales-report")
  .post(checkAuthenticated, postQueriedSalesReport);

router
  .route("/dash/products/product-details")
  .get(checkAuthenticated, getProductDetails);

router
  .route("/dash/coupons/coupon-details")
  .get(checkAuthenticated, getCouponDetails);

router
  .route("/dash/coupons/coupon-details/edit-coupon")
  .get(checkAuthenticated, getEditCoupon)
  .patch(checkAuthenticated, patchEditCoupon);

router.route("/adlogout").delete(deleteLogout);

module.exports = router;
