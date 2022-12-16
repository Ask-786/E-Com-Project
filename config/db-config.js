const mongoose = require("mongoose");
require("dotenv").config();

const localDb = process.env.DB_LOCAL;
const DB = process.env.DB;

async function runConnection() {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DBConnection successful");
  } catch (e) {
    console.log(e.message);
  }
}

module.exports = runConnection;
