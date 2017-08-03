// const passport = require('passport');
// const Post = require('../model/postModel');
const User = require("../model/userModel");

const profileController = {};
profileController.getProfilePage = (req, res, next) => {
  User.findOne({ nickname: req.params.nickname })
    .populate({ path: "posts", select: "author title comments createTime preview" })
    .then((user) => {
      if (!user) return next();
      if (req.session.user && req.session.user.nickname === req.params.nickname) {
        res.locals.isOwn = true;
      }
      return res.render("profile", { user, token: req.csrfToken() });
    }).catch(err => next(err));
};
profileController.getPostPage = (req, res, next) => {
  res.render("createpost", { token: req.csrfToken() });
};
module.exports = profileController;
