const passport = require('passport');
const User = require("../model/userModel");

const authController = {};

authController.getSignUpPage = (req, res) => {
  res.render("regpage", { token: req.csrfToken() });
};

authController.signUp = (req, res, next) => {
  const newUser = new User();
  newUser.email = req.body.email;
  newUser.nickname = req.body.nickname;
  newUser.password = req.body.password;

  newUser.save()
    .then(() => res.redirect("/"))
    .catch(err => next(err));
};

authController.signIn = (req, res, next) => {
  if (req.body.nickname === "" && req.body.password === "") {
    return res.json({ message: "empty fields" });
  }
  return passport.authenticate("signin", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.json(info);
    return req.logIn(user, (error) => {
      if (error) return next(error);
      req.session.user = user;
      return res.json(info);
    });
  })(req, res, next);
};

authController.signOut = (req, res) => {
  req.logOut();
  req.session.user = null;
  res.redirect("/");
};

authController.checkCredentials = (req, res) => {
  if (req.body.valid === "nickname") {
    User.findOne({ nickname: req.body.nickname }, (err, user) => {
      if (err) return res.status(500).next(err);
      if (user) return res.send("Это имя уже занято");
      return res.send("true");
    });
  } else if (req.body.valid === "email") {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) return res.status(500).next(err);
      if (user) return res.send("Этот email уже используется");
      return res.send("true");
    });
  } else res.sendStatus(404);
};

module.exports = authController;
