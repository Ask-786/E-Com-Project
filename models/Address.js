const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addresSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  buildingName: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  PIN: {
    type: Number,
    required: true,
  },
});

const userAddresSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  Addressess: [addresSchema],
});

const Address = mongoose.model("Address", userAddresSchema);

module.exports = Address;
