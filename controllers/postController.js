const mongoose = require("mongoose");
const User = require("../model/userModel");
const Post = require("../model/postModel");
const Comment = require("../model/commentModel");
const config = require("../config/conf");


const postController = {};

postController.getAllPosts = (req, res, next) => {
  let { page } = req.query;
  let pageNumber = page ? parseInt(page, 10) : 1;
  if (pageNumber < 1) {
    pageNumber = 1;
  }

  Post.find({})
    .count()
    .then(count => {
      const limit = config.postsLimit;
      const skip = limit * pageNumber - limit;
      const pages = Math.ceil(count / limit);

      if (pageNumber > pages) {
        page = pages;
      }

      Post.find({})
        .sort({ createTime: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "author",
          select: "_id username nickname avatar",
        })
        .then(posts => {
          res.render("index", {
            token: req.csrfToken(),
            posts,
            pages,
            pageNumber,
          });
        });
    })
    .catch(err => next(err));
};

postController.create = (req, res, next) => {
  const newPost = new Post();
  newPost.author = mongoose.Types.ObjectId(req.body.userId);
  newPost.title = req.body.title;
  newPost.text = req.body.text;
  newPost.preview = req.body.text.substring(0, 400).concat("...");

  newPost
    .save()
    .then((post) => {
      User.findOneAndUpdate({ _id: req.body.userId }, { $inc: { postsCount: 1 } }).exec();
    })
    .then(() => res.json({ id: newPost._id }))
    .catch(err => next(err));
};

postController.getOnePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .populate({ path: "author", select: "_id username nickname avatar" })
    .then(post => {
      Comment.find({ postId: post._id })
        .populate({
          path: "author",
          select: "username nickname avatar",
        })
        .then((comments) => {
          res.render("pages/postPage", { token: req.csrfToken(), post, comments, url: req.url });
        });
    })
    .catch(err => next(err));
};

postController.getAllPostsByUser = (req, res, next) => {
  const nickname = req.params.nickname;
  Post.find({ author: nickname })
    .then(posts => res.json({ posts }))
    .catch(err => next(err));
};

postController.delete = (req, res, next) => {
  const id = req.params.id;
  const nickname = req.params.nickname;

  User.findOneAndUpdate({ nickname }, { $inc: { postsCount: -1 } })
    .then((user) => {
      Promise.all([Post.remove({ _id: id }).exec(),
        Comment.remove({ postId: id }).exec()]);
    })
    .then(() => res.send("delete"))
    .catch(err => next(err));
};

module.exports = postController;
