const passport = require("passport");
const Product = require("../models/Product");
const Orders = require("../models/Orders");
const User = require("../models/User");
const Cart = require("../models/Cart");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const initializePassport = require("../config/passport-config");
const moment = require("moment");
const Products = require("../models/Product");
const {
  deleteCategoryImage,
  deleteProductImages,
} = require("../config/delete-file");
const Order = require("../models/Orders");
const Coupon = require("../models/Coupons");
const { barChartDetails } = require("../utils/chart-details");
const { array } = require("joi");
initializePassport(passport);

const getLogin = (req, res) => {
  res.render("admin-views/login", {
    layout: "./layouts/admin-layout",
    message: req.message,
    title: "Persuit: login",
  });
};

const getDashboard = async (req, res, next) => {
  const date = moment().startOf("month").toISOString();
  try {
    const totalClients = await User.find().count();

    const lastMonthSales = await Order.find({ createdAt: { $gt: date } });
    const lastMonthRevenue = lastMonthSales.reduce((total, order) => {
      return (total += order.finalPrice);
    }, 0);

    const pendingOrders = await Order.find({
      orderStatus: { $nin: ["delivered", "cancelled"] },
    }).count();
    const lastMonthTotalSales = await Order.find({
      createdAt: { $gt: date },
    }).count();
    const users = await User.find().sort({ createdAt: -1 }).limit(5);
    const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
    const formattedOrders = orders.map((el) => {
      let newEl = { ...el._doc };
      newEl.createdAt = moment(newEl.createdAt).format("lll");
      return newEl;
    });
    res.render("admin-views/dashboard", {
      layout: "./layouts/admin-layout",
      users,
      totalClients,
      pendingOrders,
      lastMonthTotalSales,
      lastMonthRevenue,
      orders: formattedOrders,
      title: "Persuit: Dashboard",
    });
  } catch (err) {
    next(err);
  }
};

const getPieChartDetails = async (req, res, next) => {
  try {
    const date = moment().subtract(7, "days").toISOString();

    const orders = await Order.find({ createdAt: { $gt: date } }).populate(
      "cart"
    );

    await Product.populate(orders, {
      path: "cart.bucket.products",
    });

    await Category.populate(orders, {
      path: "cart.bucket.products.category",
    });

    const filteredOrderData = orders.map((el) => {
      return el.cart.bucket.reduce((result, el1) => {
        if (result[el1.products.category.name] == null) {
          result[el1.products.category.name] = 0;
        }
        result[el1.products.category.name] += el1.quantity;
        return result;
      }, {});
    });

    const groupedOrderData = filteredOrderData.reduce((result, el) => {
      for (let [key, value] of Object.entries(el)) {
        let data = {};
        if (result.some((e) => e.name == key)) {
          objIndex = result.findIndex((obj) => obj.name == key);
          result[objIndex].quantity += value;
        } else {
          data.quantity = value;
          data.name = key;
          result.push(data);
        }
      }
      return result;
    }, []);

    res.json({ status: true, groupedOrderData });
  } catch (err) {
    res.json({ status: false, message: err.message });
  }
};

const getBarChartDetails = async (req, res, next) => {
  try {
    const allMonths = [
      "August",
      "September",
      "October",
      "November",
      "December",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = new Date().getMonth();
    const months = allMonths.slice(month, month + 6);
    const allData = await barChartDetails();
    const check = allData.every((el) => el !== null);
    if (check) res.json({ dataset: allData, months, status: true });
    else res.json({ status: false });
  } catch (err) {
    res.json({ status: false });
  }
};

const getProductAdd = async (req, res, next) => {
  try {
    let category = await Category.find();
    res.render("admin-views/add-product", {
      layout: "./layouts/admin-layout",
      category,
      title: "Persuit: Add Products",
    });
  } catch (err) {
    next(err);
  }
};

const getProducts = async (req, res, next) => {
  try {
    let products = res.paginatedResults;
    res.render("admin-views/products", {
      layout: "./layouts/admin-layout",
      products,
      message: req.flash("message"),
      title: "Persuit: Products",
    });
  } catch (err) {
    next(err);
  }
};

const getProductDetails = async (req, res, next) => {
  const productId = req.query.id;
  const product = await Product.findById(productId).populate("category");
  const formattedProduct = { ...product._doc };
  formattedProduct.createdAt = moment(formattedProduct.createdAt).format("lll");
  formattedProduct.updatedAt = moment(formattedProduct.updatedAt).format("lll");
  res.render("admin-views/product-details", {
    product: formattedProduct,
    layout: "./layouts/admin-layout",
    title: product.title,
  });
};

const getEditProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.query.id);
    let category = await Category.find();
    res.render("admin-views/edit-product", {
      layout: "./layouts/admin-layout",
      product,
      category,
      page: req.query.page,
      limit: req.query.limit,
      title: "Persuit: Edit Products",
    });
  } catch (err) {
    next(err);
  }
};

const getDeleteProduct = async (req, res, next) => {
  try {
    let preProduct = await Product.findOne({ _id: req.query.id });
    await Product.deleteOne({ _id: req.query.id });
    await deleteProductImages(preProduct.images)
      .then((val) => {
        res.redirect("/admin/dash/products");
      })
      .catch(() => {
        res.redirect("/admin/dash/products");
      });
  } catch (err) {
    next(err);
  }
};

const getCategories = async (req, res, next) => {
  try {
    let categories = await Category.find().sort({ updatedAt: -1 });
    res.render("admin-views/categories", {
      layout: "./layouts/admin-layout",
      categories,
      message: req.flash("message"),
      title: "Persuit: Categories",
    });
  } catch (err) {
    next(err);
  }
};

const getAddCategory = (req, res) => {
  res.render("admin-views/add-category", {
    layout: "./layouts/admin-layout",
    message: req.flash("message"),
    title: "Persuit: Add Category",
  });
};

const getDeleteCategory = async (req, res, next) => {
  try {
    let check = await Products.exists({ category: req.query.id });
    if (check === null) {
      const preCategory = await Category.findOne({ _id: req.query.id });
      await Category.deleteOne({ _id: req.query.id });
      deleteCategoryImage(preCategory.image)
        .then((val) => {
          req.flash("message", "Category Deleted Successfully");
          res.redirect("/admin/dash/categories");
        })
        .catch(() => {
          req.flash("message", "There are some Issues with Deleting Images");
          res.redirect("/admin/dash/categories");
        });
    } else {
      req.flash(
        "message",
        "Category Can't be Deleted Because it's already in use!"
      );
      res.redirect("/admin/dash/categories");
    }
  } catch (err) {
    next(err);
  }
};

const getEditCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.query.id);
    res.render("admin-views/edit-category", {
      layout: "./layouts/admin-layout",
      category,
      title: "Persuit: Edit CAtegory",
    });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = res.paginatedResults;
    res.render("admin-views/users", {
      layout: "./layouts/admin-layout",
      users,
      message: req.flash("message"),
      title: "Persuit: Users List",
    });
  } catch (err) {
    next(err);
  }
};

const getUserDetails = async (req, res, next) => {
  try {
    const preUser = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.query.id) } },
      {
        $lookup: {
          from: "orders",
          let: {
            userId: "$_id",
          },
          pipeline: [
            { $match: { $expr: { $eq: ["$user", "$$userId"] } } },
            { $sort: { updatedAt: -1 } },
          ],
          as: "orders",
        },
      },
    ]);
    const PreUser1 = await Cart.populate(preUser, { path: "orders.cart" });
    const preUser2 = await Coupon.populate(PreUser1, {
      path: "orders.cart.couponDetails",
    });
    const user = await Product.populate(preUser2, {
      path: "orders.cart.bucket.products",
    });
    const newUser = { ...user[0] };
    newUser.orders = newUser.orders.map((el) => {
      el.createdAt = moment(el.createdAt).format("LL");
      return el;
    });
    res.render("admin-views/user-details", {
      layout: "./layouts/admin-layout",
      user: newUser,
      message: req.flash("message"),
      title: "Persuit: User Details",
    });
  } catch (err) {
    next(err);
  }
};

const getBlockUser = async (req, res, next) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    await User.updateOne({ _id: req.query.id }, { access: false });
    req.flash("message", "User Blocked successfully");
    res.redirect(`/admin/dash/users?page=${page}&limit=${limit}`);
  } catch (err) {
    next(err);
  }
};

const getUnblockUser = async (req, res, next) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    await User.updateOne({ _id: req.query.id }, { access: true });
    req.flash("message", "User Unblocked successfully");
    res.redirect(`/admin/dash/users?page=${page}&limit=${limit}`);
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const preOrders = await Orders.find()
      .populate("user")
      .sort({ updatedAt: -1 });

    const orders = preOrders.map((el) => {
      let newEl = { ...el._doc };
      newEl.createdAt = moment(newEl.createdAt).format("LL");
      return newEl;
    });

    res.render("admin-views/orders", {
      layout: "./layouts/admin-layout",
      orders,
      title: "Persuit: Orders",
    });
  } catch (err) {
    next(err);
  }
};

const getOrderDetails = async (req, res, next) => {
  try {
    const preOrder = await Orders.findById(req.query.id)
      .populate("user")
      .populate("cart")
      .sort({ updatedAt: -1 });
    const preOrder1 = await Coupon.populate(preOrder, {
      path: "cart.couponDetails",
    });
    const order = await Product.populate(preOrder1, {
      path: "cart.bucket.products",
    });
    const formatedOrder = { ...order._doc };
    formatedOrder.createdAt = moment(formatedOrder.createdAt).format("LL");
    res.render("admin-views/order-details", {
      message: req.flash("message"),
      layout: "./layouts/admin-layout",
      order: formatedOrder,
      title: "Persuit: Order Details",
    });
  } catch (err) {
    next(err);
  }
};

const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ updatedAt: -1 });
    const formattedCoupons = coupons.map((el) => {
      const newEl = { ...el._doc };
      newEl.expiryDate = moment(newEl.expiryDate).format("lll");
      newEl.createdAt = moment(newEl.createdAt).format("lll");
      newEl.updatedAt = moment(newEl.updatedAt).format("lll");
      return newEl;
    });
    res.render("admin-views/coupons", {
      layout: "./layouts/admin-layout",
      coupons: formattedCoupons,
      title: "Persuit: Coupons",
    });
  } catch (err) {
    next(err);
  }
};

const getAdddCoupons = async (req, res, next) => {
  res.render("admin-views/add-coupon", {
    layout: "./layouts/admin-layout",
    dateMessage: req.flash("dateMessage"),
    maxAmountMessage: req.flash("maxAmountMessage"),
    errMessag: req.flash("errMessag"),
    successMessage: req.flash("successMessage"),
    title: "Persuit: AddCoupons",
  });
};

const getSalesReport = async (req, res, next) => {
  try {
    const preOrders = res.paginatedResults;

    const orders = preOrders.results.map((el) => {
      let newEl = { ...el._doc };
      newEl.createdAt = moment(newEl.createdAt).format("LL");
      return newEl;
    });

    const total = preOrders.results.reduce((total, order) => {
      total += order.finalPrice;
      return total;
    }, 0);

    preOrders.results = orders;

    res.render("admin-views/sales-report", {
      title: "Persuit: Sales Report",
      layout: "./layouts/admin-layout",
      orders: preOrders,
      total,
    });
  } catch (err) {
    next(err);
  }
};

// const postLogin = (req, res) => {
//   try {
//     Admin.findOne({ username: req.body.username }, (err, admin) => {
//       if (admin !== null) {
//         if (err) {
//           console.log(err);
//         } else {
//           admin.comparePasswords(req.body.password, (err, isMatch) => {
//             console.log(isMatch);
//             if (err) {
//               res.redirect("/admin");
//             } else {
//               if (isMatch) {
//                 req.session.admin = true;
//                 res.redirect("/admin/dash");
//               } else {
//                 res.redirect("/admin");
//               }
//             }
//           });
//         }
//       } else {
//         res.redirect("/admin");
//       }
//     });
//   } catch (err) {
//     res.redirect("/admin");
//   }
// };

const postProductAdd = async (req, res, next) => {
  try {
    await Product.create({
      title: req.body.title,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      size: req.body.size,
      stock: req.body.stock,
      images: [
        req.files.image0[0].filename,
        req.files.image1[0].filename,
        req.files.image2[0].filename,
        req.files.image3[0].filename,
      ],
    });
    req.flash("message", "Product Added Successfully");
    res.redirect("/admin/dash/add-product");
  } catch (err) {
    console.log(err.message);
    req.flash("message", err.message);
    res.redirect("/admin/dash/add-product");
  }
};

const postEditProduct = async (req, res, next) => {
  try {
    const { image0, image1, image2, image3 } = req.files;
    const page = req.query.page;
    const limit = req.query.limit;
    if ((image0, image1, image2, image3)) {
      let preProduct = await Product.findOne({ _id: req.query.id });
      let data = req.body;
      await Product.updateOne(
        { _id: req.query.id },
        {
          $set: {
            title: data.title,
            price: data.price,
            category: data.category,
            description: data.description,
            size: data.size,
            stock: data.stock,
            images: [
              req.files.image0[0].filename,
              req.files.image1[0].filename,
              req.files.image2[0].filename,
              req.files.image3[0].filename,
            ],
          },
        }
      );
      deleteProductImages(preProduct.images)
        .then((val) => {
          req.flash("message", "Product Updated Successfully");
          res.redirect(`/admin/dash/products?page=${page}&limit=${limit}`);
        })
        .catch(() => {
          req.flash(
            "message",
            "There are some problems with deleting old images"
          );
          res.redirect(`/admin/dash/products?page=${page}&limit=${limit}`);
        });
    } else {
      let data = req.body;
      await Product.updateOne(
        { _id: req.query.id },
        {
          $set: {
            title: data.title,
            price: data.price,
            category: data.category,
            description: data.description,
            size: data.size,
            stock: data.stock,
          },
        }
      );
      req.flash("message", "Product Updated Successfully");
      res.redirect(`/admin/dash/products?page=${page}&limit=${limit}`);
    }
  } catch (err) {
    next(err);
  }
};

const postLogin = passport.authenticate("local", {
  successRedirect: "/admin/dash",
  failureRedirect: "/admin",
  failureFlash: true,
});

const postAddCategory = async (req, res, next) => {
  try {
    let name = req.body.name;
    let description = req.body.description;

    let capitalize = (elm) => elm[0].toUpperCase() + elm.slice(1).toLowerCase();

    let nameWords = name.split(" ").map(capitalize);
    let descriptionWords = description.split(" ").map(capitalize);

    let validatedName = nameWords.join(" ");
    let validatedDescription = descriptionWords.join(" ");

    await Category.create({
      name: validatedName,
      description: validatedDescription,
      image: req.file.filename,
    });
    req.flash("message", "Category Added Successfully");
    res.redirect("/admin/dash/add-category");
  } catch (err) {
    req.falsh("message", err.message);
    req.redirect("/dash/add-category");
  }
};

const postAddCoupon = async (req, res, next) => {
  const now = moment(Date.now()).format();
  const expr = moment(req.body.expiryDate).format();
  const {
    couponCode,
    expiryDate,
    deductionType,
    deduction,
    minAmount,
    maxLimit,
    maxUsers,
  } = req.body;
  try {
    if (expr > now) {
      if (deductionType === "percentage") {
        await Coupon.create({
          couponCode,
          expiryDate: moment(expiryDate).toISOString(),
          deductionType,
          deduction,
          minAmount,
          maxLimit,
          maxUsers,
        });
        req.flash("successMessage", "Coupon Added Successfully");
        res.redirect("/admin/dash/add-coupon");
      } else {
        if (maxLimit) {
          req.flash(
            "maxAmountMessage",
            "You there is no need to add Max limti with deduction type of amount"
          );
          res.redirect("/admin/dash/add-coupon");
        } else {
          await Coupon.create({
            couponCode,
            expiryDate: moment(expiryDate).toISOString(),
            deductionType,
            deduction,
            minAmount,
            maxUsers,
          });
          req.flash("successMessage", "Coupon Added Successfully");
          res.redirect("/admin/dash/add-coupon");
        }
      }
    } else {
      req.flash("dateMessage", "input a valid expr date");
      res.redirect("/admin/dash/add-coupon");
    }
  } catch (err) {
    req.flash("errMessag", err.message);
    res.redirect("/admin/dash/add-coupon");
  }
};

const postEditCategory = async (req, res, next) => {
  try {
    if (req.file) {
      const preCategory = await Category.findOne({ name: req.body.name });
      await Category.updateOne(
        { _id: req.query.id },
        {
          name: req.body.name,
          description: req.body.description,
          image: req.file.filename,
        }
      );
      deleteCategoryImage(preCategory.image)
        .then((val) => {
          req.flash("message", "Category Updated Successfully");
          res.redirect("/admin/dash/categories");
        })
        .catch(() => {
          req.flash("message", "There are some Issues with Deleting Images");
          res.redirect("/admin/dash/categories");
        });
    } else {
      await Category.updateOne({ _id: req.query.id }, req.body);
      req.flash("message", "Category Updated Successfully");
      res.redirect("/admin/dash/categories");
    }
  } catch (err) {
    next(err);
  }
};

const postQueriedSalesReport = async (req, res, next) => {
  const { from, to } = req.body;
  const now = moment().utc().toISOString();
  const formattedFrom = moment(from).utc().toISOString();
  const formattedTo = moment(to).utc().toISOString();
  if (formattedTo <= now) {
    const orders = await Order.find({
      createdAt: { $gt: formattedFrom, $lt: formattedTo },
    }).populate("user");
    const formattedOrders = orders.map((el) => {
      let newEl = { ...el._doc };
      newEl.createdAt = moment(newEl.createdAt).format("LL");
      return newEl;
    });
    const totalPrice = formattedOrders.reduce((total, orders) => {
      total += orders.finalPrice;
      return total;
    }, 0);
    res.json({ status: true, orders: formattedOrders, totalPrice });
  } else {
    res.json({ status: false });
  }
};

const patchOrderDetails = async (req, res, next) => {
  try {
    if (req.query.id) {
      await Orders.updateOne(
        { user: req.query.id, _id: req.query.orderId },
        { $set: { orderStatus: req.body.orderStatus } }
      );
      req.flash("message", "Order status updated");
      res.redirect(`/admin/dash/users/user-details?id=${req.query.id}`);
    } else {
      await Orders.updateOne(
        { _id: req.query.orderId },
        { $set: { orderStatus: req.body.orderStatus } }
      );
      req.flash("message", "Order status updated");
      res.redirect(`/admin/dash/orders/order-details?id=${req.query.orderId}`);
    }
  } catch (err) {
    next(err);
  }
};

const deleteLogout = (req, res) => {
  req.logOut((err) => {
    res.redirect("/admin");
  });
};

module.exports = {
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
};
