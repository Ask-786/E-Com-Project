const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coupon: {
      type: Boolean,
      default: false,
    },
    couponDetails: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    bucket: [
      {
        products: {
          type: Schema.Types.ObjectId,
          ref: "Products",
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        subtotal: {
          type: Number,
        },
      },
    ],
    grandtotal: {
      type: Number,
    },
    isexpired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
