const mongoose = require("mongoose");

const { Schema } = mongoose;

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
      ref: "Users",
    },
    minAmount: {
      type: Number,
      required: true,
    },
    diactivated: {
      type: Boolean,
      default: false,
    },
    maxUsers: {
      type: Number,
      required: true,
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
    maxLimit: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
