const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getAdminByUsername, getAdminById) {
  const authenticateUser = async (username, password, done) => {
    const admin = await getAdminByUsername(username);
    if (admin === null) {
      return done(null, false, { message: "No Admin With That Username" });
    }
    try {
      if (await bcrypt.compare(password, admin.password)) {
        return done(null, admin);
      } else {
        return done(null, false, { message: "Incorrect Password " });
      }
    } catch (err) {
      return done(err);
    }
  };
  passport.use(
    "admin",
    new localStrategy({ usernameField: "username" }, authenticateUser)
  );
  passport.serializeUser((admin, done) => {
    return done(null, admin._id);
  });
  passport.deserializeUser((id, done) => {
    return done(null, getAdminById(id));
  });
}

module.exports = initialize;
