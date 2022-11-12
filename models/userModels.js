const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: String,
  email: String,
  phone: Number,
  password: String,
  repassword: String,
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
