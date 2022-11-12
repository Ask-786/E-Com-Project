const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
