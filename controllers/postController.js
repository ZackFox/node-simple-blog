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
      User.findOneAndUpdate({ _id: req.body.userId }, { $push: { posts: newPost._id } });
    })
    .then(() => res.json({ id: newPost._id }))
    .catch(err => {
      next(err);
    });
};

postController.getOnePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .populate({ path: "author", select: "_id username nickname avatar" })
    .populate({
      path: "comments",
      select: "author createTime text _id",
      populate: {
        path: "author",
        select: "username nickname avatar",
      },
    })
    .then(post => {
      console.log(post);
      res.render("pages/postPage", { token: req.csrfToken(), post, url: req.url });
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
  Promise.all([Post.remove({ _id: id }), Comment.remove({ postId: id })])
    .then(() => res.send("delete"))
    .catch(err => next(err));
};

module.exports = postController;
