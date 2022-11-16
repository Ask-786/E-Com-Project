const Product = require("../models/Product");
const passport = require("passport");
const User = require("../models/User");
const initializePassport = require("../config/passport-config");
const upload = require("../config/multer");

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

const getProductAdd = (req, res) => {
  res.render("admin-views/add-product", { layout: "./layouts/admin-layout" });
};

const getProducts = async (req, res) => {
  let products = await Product.find({});
  res.render("admin-views/view-products", {
    layout: "./layouts/admin-layout",
    products: products,
  });
};

const getEditProduct = async (req, res) => {
  let product = await Product.findById(req.query.id);
  res.render("admin-views/edit-product", {
    layout: "./layouts/admin-layout",
    product,
  });
};

const getDeleteProduct = async (req, res) => {
  await Product.deleteOne({ _id: req.query.id });
  res.redirect("/admin/products");
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
    Product.create({
      title: req.body.title,
      price: req.body.price,
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
    res.redirect("/admin/add-product");
  } catch (err) {
    console.log(err.message);
    res.redirect("/admin/add-product");
  }
};

const postEditProduct = async (req, res) => {
  let data = req.body;
  await Product.updateOne(
    { _id: req.query.id },
    {
      $set: {
        title: data.title,
        price: data.price,
        description: data.description,
        size: data.size,
        stock: data.stock,
      },
    }
  );
  res.redirect("/admin/products");
};

const postLogin = passport.authenticate("local", {
  successRedirect: "/admin/dash",
  failureRedirect: "/admin",
  failureFlash: true,
});

const deleteLogout = (req, res) => {
  req.logOut((err) => {
    res.redirect("/admin");
  });
};

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isadmin) {
    next();
  } else {
    res.redirect("/admin");
  }
};

const checkNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(404).json({ message: "Logout From User Account" });
  }
};

module.exports = {
  getLogin,
  getDashboard,
  postLogin,
  getProductAdd,
  postProductAdd,
  checkAuthenticated,
  checkNotAuthenticated,
  deleteLogout,
  getProducts,
  getEditProduct,
  getDeleteProduct,
  postEditProduct,
  upload,
};
