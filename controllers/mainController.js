// const User = require("../model/userModel");
const Post = require("../model/postModel");

const mainController = {};

mainController.welcome = (req, res, next) => {
  let page = req.query.page ? req.query.page - 1 : 0;
  const limit = 4;

  Post.find({}).count().then((postsQuantity) => {
    Post.find({})
      .skip(limit * page)
      .limit(limit)
      .sort({ createTime: "desc" })
      .then((posts) => {
        res.render("index", { token: req.csrfToken(), posts, limit, page, pages: Math.ceil(postsQuantity / limit) });
      });
  }).catch(err => next(err));
};

module.exports = mainController;

