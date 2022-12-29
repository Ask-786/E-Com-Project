const Razorpay = require("razorpay");
const crypto = require("crypto");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

function createOrderRz(amount, orderId) {
  return new Promise((resolve, reject) => {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: orderId,
    };
    instance.orders.create(options, (err, order) => {
      if (err) reject(err);
      resolve(order);
    });
  });
}

function verifyPayment(responseRZ) {
  return new Promise((resolve) => {
    const body =
      responseRZ.razorpay_order_id + "|" + responseRZ.razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");
    let response = { signatureIsValid: "false" };
    if (expectedSignature === responseRZ.razorpay_signature) {
      response = { signatureIsValid: "true" };
    }
    resolve(response);
  });
}

module.exports = { createOrderRz, verifyPayment };
