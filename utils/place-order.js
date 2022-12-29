const mongoose = require("mongoose");
const Order = require("../models/Orders");
const Propduct = require("../models/Product");
const Cart = require("../models/Cart");

const placeOrder = (
  user,
  cartId,
  address,
  payType,
  payStatus,
  rzPayId,
  finalPrice
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.create({
        user,
        cart: mongoose.Types.ObjectId(cartId),
        address: address,
        finalPrice,
        paymentDetails: {
          paymentType: payType,
          paymentStatus: payStatus,
          rzPayId: rzPayId,
        },
      });
      const cart = await Cart.findOne({
        user: user,
        isexpired: false,
      });
      await Cart.updateOne(
        { user: user, isexpired: false },
        { $set: { isexpired: true } }
      );
      cart.bucket.forEach(async (product) => {
        await Propduct.updateOne(
          { _id: product.products },
          { $inc: { stock: -product.quantity } }
        );
      });
      resolve(order);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { placeOrder };
