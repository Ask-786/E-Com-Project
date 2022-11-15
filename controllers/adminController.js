const Product = require("../models/Product");
const passport = require("passport");
const Admin = require("../models/Admin");
const initializePassport = require("../config/admin-passport-config");

initializePassport(
  passport,
  async (username) => {
    return Admin.findOne({ username: username });
  },
  (id) => {
    return Admin.findById(id);
  }
);

const getLogin = (req, res) => {
  res.render("admin-views/login", {
    layout: "./layouts/admin-layout",
    message: req.message,
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

const postLogin = passport.authenticate("admin", {
  successRedirect: "/admin/dash",
  failureRedirect: "/admin",
  failureFlash: true,
});

const getDashboard = async (req, res) => {
  console.log(req.session.passport.user);
  let products = await Product.find({});
  res.render("admin-views/dashboard", {
    layout: "./layouts/admin-layout",
    products: products,
  });
};

const getProductAdd = (req, res) => {
  res.render("admin-views/add-product", { layout: "./layouts/admin-layout" });
};

const postProductAdd = async (req, res) => {
  try {
    // await Product.create(req.body);
    let product = new Product(req.body);
    product.save();
    res.redirect("/admin/add-product");
  } catch (err) {
    console.log(err.message);
    res.redirect("/admin/add-product");
  }
};

const deleteLogout = (req, res) => {
  req.logOut((err) => {
    res.redirect("/admin");
  });
};

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/admin");
  }
};

// const checkNotAuthenticated = (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     next();
//   } else {
//     res.redirect("/admin/dash");
//   }
// };

const checkAdmin = (req, res, next) => {
  try {
    Admin.findById(req.session.passport.user, (err, admin) => {
      if (admin !== null) {
        console.log(admin);
        next();
      } else {
        res.redirect("/admin");
      }
    });
  } catch {}
};

module.exports = {
  getLogin,
  getDashboard,
  postLogin,
  getProductAdd,
  postProductAdd,
  checkAuthenticated,
  // checkNotAuthenticated,
  checkAdmin,
  deleteLogout,
};
