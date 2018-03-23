// const passport = require('passport');
const User = require("../model/userModel");
const Post = require('../model/postModel');

const profileController = {};
profileController.getProfilePage = (req, res, next) => {
  User.findOne({ nickname: req.params.nickname })
    .populate({ path: "posts", select: "author title comments createTime preview" })
    .then((user) => {
      if (!user) return next();
      if (req.session.user && req.session.user.nickname === req.params.nickname) {
        res.locals.isOwn = true;
      }

      Post.find({ author: user._id })
        .populate({
          path: "author",
          select: "username nickname avatar",
        })
        .then((posts) => {
          console.log(posts);
          res.render("pages/profile", { user, posts, token: req.csrfToken(), isOwn : res.locals.isOwn });
        });
    }).catch(err => next(err));
};

profileController.getPostPage = (req, res, next) => {
  res.render("pages/createpost", { token: req.csrfToken() });
};
module.exports = profileController;
