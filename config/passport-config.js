const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");

function initialize(passport) {
  const authenticateUser = async (username, password, done) => {
    const user = await User.findOne({ username: username });
    if (user === null) {
      return done(null, false, { message: "No User With That Username" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect Password " });
      }
    } catch (err) {
      return done(err);
    }
  };
  passport.use(
    new localStrategy({ usernameField: "username" }, authenticateUser)
  );
  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      done(null, user);
    });
  });
}

module.exports = initialize;