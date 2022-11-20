const mongoose = require("mongoose");
const {
  SchemaVersionContext,
} = require("twilio/lib/rest/events/v1/schema/version");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
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
    images: {
      type: [String],
      validate: (v) => Array.isArray(v) && v.length > 0 && v.length < 5,
    },
  },
  {
    timestamps: true,
  }
);

const Products = new mongoose.model("Products", productSchema);
module.exports = Products;
