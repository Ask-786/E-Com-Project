const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: "Description",
  },
  size: {
    type: String,
    enum: ["small", "medium", "large"],
  },
  stock: {
    type: Number,
    reqruied: true,
    min: 0,
  },
});

const Products = new mongoose.model("Products", productSchema);
module.exports = Products;
