const User = require("../models/User");

const getLogin = (req, res) => {
  res.render("admin-views/login", { layout: "./layouts/admin-layout" });
};

const postLogin = (req, res) => {
  console.log("hello");
  res.redirect("/admin/dash");
};

const getDashboard = (req, res) => {
  res.render("admin-views/dashboard", { layout: "./layouts/admin-layout" });
};

module.exports = {
  getLogin,
  getDashboard,
  postLogin,
};
