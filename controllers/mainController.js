// const User = require("../model/userModel");
const Post = require("../model/postModel");
const config = require("../config/conf");

const mainController = {};

mainController.welcome = (req, res, next) => {
  let page = req.query.page ? parseInt(req.query.page, 10) : 1;
  if (page < 1) page = 1;

  Post.find({}).count().then((postsQuantity) => {
    const limit = config.postsLimit;
    const pages = Math.ceil(postsQuantity / limit);
    if (page > pages) page = pages;

    Post.find({})
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({ createTime: "desc" })
      .then((posts) => {
        res.render("index", {
          token: req.csrfToken(),
          posts,
          page,
          pages,
          paginationLimit: config.paginationLimit });
      });
  }).catch(err => next(err));
};

module.exports = mainController;

