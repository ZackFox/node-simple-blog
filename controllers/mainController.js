// const User = require("../model/userModel");
const Post = require("../model/postModel");

const mainController = {};

mainController.welcome = (req, res, next) => {
  let page = req.query.page ? parseInt(req.query.page, 10) : 1;
  if (page < 1) page = 1;

  const limit = 4;

  Post.find({}).count().then((postsQuantity) => {
    const pages = Math.ceil(postsQuantity / limit);
    // if (page > pages) page = pages;

    Post.find({})
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({ createTime: "desc" })
      .then((posts) => {
        res.render("index", { token: req.csrfToken(), posts, limit, page, pages });
      });
  }).catch(err => next(err));
};

module.exports = mainController;

