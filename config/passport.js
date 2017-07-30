const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../model/userModel");

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use("signin", new LocalStrategy({
  usernameField: 'nickname',
  passwordField: 'password',
  passReqToCallback: true
}, (req, nickname, password, done) => {
  User.findOne({ 'nickname': nickname }, function(err, user) {
    if (err) return done(err);
    if (user) {
      if (user.password !== password) {
        return done(null, false, { success: false, message: "Пароль не совпадает"});
      }
      return done(null, user, { success: true, message: "" });
    }
    return done(null, false, { success: false, message: "Такого пользователя не существует" });
  });
}));

module.exports = passport;
