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

initializePassport(passport);

const getLogin = (req, res) => {
  res.render("admin-views/login", {
    layout: "./layouts/admin-layout",
    message: req.message,
  });
};

const getDashboard = async (req, res) => {
  let products = await Product.find({});
  res.render("admin-views/dashboard", {
    layout: "./layouts/admin-layout",
    products: products,
  });
};

const getProductAdd = async (req, res) => {
  let category = await Category.find();
  res.render("admin-views/add-product", {
    layout: "./layouts/admin-layout",
    category,
  });
};

const getProducts = async (req, res) => {
  let products = res.paginatedResults;
  res.render("admin-views/products", {
    layout: "./layouts/admin-layout",
    products,
    message: req.flash("message"),
  });
};

const getEditProduct = async (req, res) => {
  let product = await Product.findById(req.query.id);
  let category = await Category.find();
  res.render("admin-views/edit-product", {
    layout: "./layouts/admin-layout",
    product,
    category,
    page: req.query.page,
    limit: req.query.limit,
  });
};

const getDeleteProduct = async (req, res, next) => {
  try {
    let preProduct = await Product.findOne({ _id: req.query.id });
    await Product.deleteOne({ _id: req.query.id });
    await deleteProductImages(preProduct.images).then((val) => {
      res.redirect("/admin/dash/products");
    });
  } catch (err) {
    next(err);
  }
};

const getCategories = async (req, res) => {
  let categories = await Category.find().sort({ updatedAt: -1 });
  res.render("admin-views/categories", {
    layout: "./layouts/admin-layout",
    categories,
    message: req.flash("message"),
  });
};

const getAddCategory = (req, res) => {
  res.render("admin-views/add-category", {
    layout: "./layouts/admin-layout",
    message: req.flash("message"),
  });
};

const getDeleteCategory = async (req, res) => {
  let check = await Products.exists({ category: req.query.id });
  if (check === null) {
    const preCategory = await Category.findOne({ _id: req.query.id });
    await Category.deleteOne({ _id: req.query.id });
    deleteCategoryImage(preCategory.image).then((val) => {
      req.flash("message", "Category Deleted Successfully");
      res.redirect("/admin/dash/categories");
    });
  } else {
    req.flash(
      "message",
      "Category Can't be Deleted Because it's already in use!"
    );
    res.redirect("/admin/dash/categories");
  }
};

const getEditCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.query.id);
    res.render("admin-views/edit-category", {
      layout: "./layouts/admin-layout",
      category,
    });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res) => {
  const users = res.paginatedResults;
  res.render("admin-views/users", {
    layout: "./layouts/admin-layout",
    users,
    message: req.flash("message"),
  });
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
    const user = await Product.populate(PreUser1, {
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
  });
};

const getOrderDetails = async (req, res, next) => {
  const preOrder = await Orders.findById(req.query.id)
    .populate("user")
    .populate("cart")
    .sort({ updatedAt: -1 });
  const order = await Product.populate(preOrder, {
    path: "cart.bucket.products",
  });
  const formatedOrder = { ...order._doc };
  formatedOrder.createdAt = moment(formatedOrder.createdAt).format("LL");
  res.render("admin-views/order-details", {
    message: req.flash("message"),
    layout: "./layouts/admin-layout",
    order: formatedOrder,
  });
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

const postProductAdd = async (req, res) => {
  try {
    await Product.create({
      title: req.body.title,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      size: req.body.size,
      stock: req.body.stock,
      images: [
        req.files[0].filename,
        req.files[1].filename,
        req.files[2].filename,
        req.files[3].filename,
      ],
    });
    req.flash("message", "Product Added Successfully");
    res.redirect("/admin/dash/add-product");
  } catch (err) {
    req.flash("message", err.message);
    res.redirect("/admin/dash/add-product");
  }
};

const postEditProduct = async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  if (req.files.length > 0) {
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
            req.files[0].filename,
            req.files[1].filename,
            req.files[2].filename,
            req.files[3].filename,
          ],
        },
      }
    );
    deleteProductImages(preProduct.images).then((val) => {
      req.flash("message", "Product Updated Successfully");
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

const postEditCategory = async (req, res) => {
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
    deleteCategoryImage(preCategory.image).then((val) => {
      req.flash("message", "Category Updated Successfully");
      res.redirect("/admin/dash/categories");
    });
  } else {
    await Category.updateOne({ _id: req.query.id }, req.body);
    req.flash("message", "Category Updated Successfully");
    res.redirect("/admin/dash/categories");
  }
};

const patchOrderDetails = async (req, res, next) => {
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
};
