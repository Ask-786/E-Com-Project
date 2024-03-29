const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "Name is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Eamil is required"],
      unique: true,
      lowercase: true,
    },
    phone: {
      type: Number,
      required: [true, "Phone is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isadmin: {
      type: Boolean,
      default: false,
    },
    access: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
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

// userSchema.methods.comparePasswords = function (password, cb) {
//   try {
//     bcrypt.compare(password, this.password, (err, isMatch) => {
//       if (err) {
//         return cb(err);
//       } else {
//         if (!isMatch) {
//           return cb(null, isMatch);
//         } else {
//           return cb(null, this);
//         }
//       }
//     });
//   } catch (err) {
//     console.log(err.message);
//   }
// };

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
