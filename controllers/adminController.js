const passport = require("passport");
const Product = require("../models/Product");
const User = require("../models/User");
const Category = require("../models/Category");
const initializePassport = require("../config/passport-config");
const Products = require("../models/Product");
const {
  deleteCategoryImage,
  deleteProductImages,
} = require("../config/delete-file");

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
  let products = await Product.find({})
    .populate("category")
    .sort({ updatedAt: -1 });
  res.render("admin-views/products", {
    layout: "./layouts/admin-layout",
    products,
  });
};

const getEditProduct = async (req, res) => {
  let product = await Product.findById(req.query.id);
  let category = await Category.find();

  console.log(product.category);
  res.render("admin-views/edit-product", {
    layout: "./layouts/admin-layout",
    product,
    category,
  });
};

const getDeleteProduct = async (req, res) => {
  let preProduct = await Product.findOne({ _id: req.query.id });
  await Product.deleteOne({ _id: req.query.id });
  res.redirect("/admin/dash/products");
  await deleteProductImages(preProduct.images).then((val) => {
    res.redirect("/admin/dash/products");
  });
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
  const users = await User.find({});
  res.render("admin-views/users", {
    layout: "./layouts/admin-layout",
    users,
    message: req.flash("message"),
  });
};

const getBlockUser = async (req, res) => {
  console.log(req.query.id);
  await User.updateOne({ _id: req.query.id }, { access: false });
  req.flash("message", "User Blocked successfully");
  res.redirect("/admin/dash/users");
};

const getUnblockUser = async (req, res) => {
  console.log(req.query.id);
  await User.updateOne({ _id: req.query.id }, { access: true });
  req.flash("message", "User Unblocked successfully");
  res.redirect("/admin/dash/users");
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
    res.redirect("/admin/dash/add-product");
  } catch (err) {
    console.log(err.message);
    res.redirect("/admin/dash/add-product");
  }
};

const postEditProduct = async (req, res) => {
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
      res.redirect("/admin/dash/products");
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
    res.redirect("/admin/dash/products");
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
    next(err);
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
};
