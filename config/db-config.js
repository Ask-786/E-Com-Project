const mongoose = require("mongoose");
require("dotenv").config();

const { DB, DB_LOCAL } = process.env;

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
