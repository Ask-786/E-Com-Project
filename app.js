const { urlencoded } = require("express");
const express = require("express");
const app = express();
const path = require("path");
const logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const dbConn = require("./config/dbConnections");
require("dotenv").config();

dbConn();

app.set("view engine", "ejs");
app.set("layout", "./layouts/user-layout");
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(expressLayouts);

// //user statics :-
app.use("/fonts", express.static(path.join(__dirname, "public/users/fonts")));
app.use("/images", express.static(path.join(__dirname, "public/users/images")));
app.use(
  "/javascript",
  express.static(path.join(__dirname, "public/users/javascript"))
);
app.use(
  "/stylesheet",
  express.static(path.join(__dirname, "public/users/stylesheet"))
);
app.use(
  "/vendors",
  express.static(path.join(__dirname, "public/users/vendors"))
);

//admin statics
app.use("/css", express.static(path.join(__dirname, "public/admin/css")));
app.use("/js", express.static(path.join(__dirname, "public/admin/js")));
app.use("/img", express.static(path.join(__dirname, "public/admin/img")));

const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");

app.use("/", userRouter);
app.use("/admin", adminRouter);

app.listen(process.env.PORT);
