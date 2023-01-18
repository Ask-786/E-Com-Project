const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    address: {
      type: Object,
    },
    paymentDetails: {
      paymentType: {
        type: String,
        enum: ["Razor Pay", "Cash on Delivery"],
      },
      paymentStatus: {
        type: String,
        enum: ["success", "failed", "pending"],
      },
      rzPayId: {
        type: String,
      },
    },
    orderStatus: {
      type: String,
      default: "confirmed",
      enum: [
        "confirmed",
        "shipped",
        "out_for_delivery",
        "deliveredd",
        "cancelled",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
