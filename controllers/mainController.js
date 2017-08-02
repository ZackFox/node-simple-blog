// const User = require("../model/userModel");
const Post = require("../model/postModel");

const mainController = {};

mainController.welcome = (req, res, next) => {
  Post.find({}).then((posts) => {
    res.locals.dateFormat = new Intl.DateTimeFormat("ru", { year: "2-digit", month: "numeric", day: "numeric" });
    res.render("index", { token: req.csrfToken(), posts });
  }).catch(err => next(err));
};
module.exports = mainController;
