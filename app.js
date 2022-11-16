const { urlencoded } = require("express");
const express = require("express");
const app = express();
const path = require("path");
const logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const dbConn = require("./config/db-config");
require("dotenv").config();

dbConn();

app.set("view engine", "ejs");
app.set("layout", "./layouts/user-layout");
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use((req, res, next) => {
  res.set(
    "Cache-control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(expressLayouts);

//user statics :-
app.use("/fonts", express.static(path.join(__dirname, "./public/users/fonts")));
app.use(
  "/images",
  express.static(path.join(__dirname, "./public/users/images"))
);
app.use(
  "/javascript",
  express.static(path.join(__dirname, "./public/users/javascript"))
);
app.use(
  "/stylesheet",
  express.static(path.join(__dirname, "./public/users/stylesheet"))
);
app.use(
  "/vendors",
  express.static(path.join(__dirname, "./public/users/vendors"))
);

//admin statics
app.use("/css", express.static(path.join(__dirname, "./public/admin/css")));
app.use("/js", express.static(path.join(__dirname, "./public/admin/js")));
app.use("/img", express.static(path.join(__dirname, "./public/admin/img")));

const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");

app.use("/", userRouter);
app.use("/admin", adminRouter);

app.listen(process.env.PORT);
