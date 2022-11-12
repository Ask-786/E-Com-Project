const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

const userName = "Ask@786";
const password = "123456";

const validator = (req, res, next) => {
  console.log(req.body);
  if (req.body.username === userName && req.body.password === password) {
    next();
  } else {
    res.redirect("/admin");
  }
};

router.get("/", adminController.getLogin);
router.post("/", validator, adminController.postLogin);
router.get("/dash", adminController.getDashboard);

module.exports = router;
