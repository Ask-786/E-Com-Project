const { boolean } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = new Schema(
  {
    couponCode: {
      type: String,
      required: true,
      unique: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    users: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: "Users",
      unique: true,
    },
    minAmount: {
      type: Number,
      required: true,
    },
    diactivated: {
      type: Boolean,
      default: false,
    },
    deductionType: {
      type: String,
      enum: ["percentage", "amount"],
      required: true,
    },
    deduction: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
