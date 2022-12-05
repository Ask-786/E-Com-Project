const Order = require("../models/Orders");
const Cart = require("../models/Cart");
const mongoose = require("mongoose");

const placeOrder = (user, cartId, address, payType, payStatus, rzPayId) => {
  return new Promise(async (resolve, reject) => {
    const order = await Order.create({
      user,
      cart: mongoose.Types.ObjectId(cartId),
      address: address,
      paymentDetails: {
        paymentType: payType,
        paymentStatus: payStatus,
        rzPayId: rzPayId,
      },
    });
    await Cart.updateOne(
      { user: user, isexpired: false },
      { $set: { isexpired: true } }
    );
    resolve(order);
  });
};

module.exports = { placeOrder };
