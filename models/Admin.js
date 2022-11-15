const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

adminSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  } else {
    bcrypt.hash(this.password, 10, (err, hasedPassword) => {
      if (err) {
        return next(err);
      } else {
        this.password = hasedPassword;
        next();
      }
    });
  }
});

adminSchema.methods.comparePasswords = function (password, cb) {
  try {
    bcrypt.compare(password, this.password, (err, isMatch) => {
      if (err) {
        return cb(err);
      } else {
        if (!isMatch) {
          return cb(null, isMatch);
        } else {
          return cb(null, this);
        }
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};

const Admin = new mongoose.model("Admin", adminSchema);
module.exports = Admin;
