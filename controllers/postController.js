const mongoose = require("mongoose");
const User = require("../model/userModel");
const Post = require("../model/postModel");
const Like = require("../model/likeModel");
const Comment = require("../model/commentModel");
const config = require("../config/conf");

const postController = {};

/**
 *
 * get all post  route handler
 * for index page
 * GET method
 */
postController.getAllPosts = (req, res, next) => {
  let page = +req.query.page;

  if (!page || page < 1) {
    page = 1;
  }

  const limit = config.postsLimit;
  const skip = limit * page - limit;
  const options = { page, limit, skip, pages: 1 };

  Promise.all([Post.getAllPosts(options), Post.getLastPosts()])
    .then(data => {
      res.render("index", {
        token: req.csrfToken(),
        posts: data[0],
        lastPosts: data[1],
        pages: options.pages,
        pageNumber: options.page,
      });
    })
    .catch(err => next(err));
};

/**
 *
 * create new post route handler
 * POST method
 */
postController.create = (req, res, next) => {
  const { userId, title, text } = req.body;

  const newPost = new Post();
  newPost.author = mongoose.Types.ObjectId(userId);
  newPost.title = title;
  newPost.text = text;
  newPost.preview = text.substring(0, 400).concat("...");

  newPost
    .save()
    .then(post => {
      User.findOneAndUpdate(
        { _id: req.body.userId },
        { $inc: { postsCount: 1 } },
      ).exec();
    })
    .then(() => res.json({ id: newPost._id }))
    .catch(err => next(err));
};

/**
 *
 * get one post by id route handler
 * for post page
 * POST method
 */
postController.getOnePost = (req, res, next) => {
  const postId = req.params.id;
  const userId = req.session.user ? req.session.user._id : null;

  Promise.all([
    Post.findOne({ _id: postId }).populate({
      path: "author",
      select: "_id username nickname avatar",
    }),
    Comment.find({ postId }).populate({
      path: "author",
      select: "username nickname avatar",
    }),
    Like.findOne({ $and: [{ user: userId }, { post: postId }] }),
  ])
    .then(data => {
      const isLiked = data[2] ? true : false;
      res.render("pages/postPage", {
        post: data[0],
        isLiked,
        comments: data[1],
        token: req.csrfToken(),
        url: req.url,
      });
    })
    .catch(err => next(err));
};

/**
 *
 * get all posts by user route handler
 * for profile page
 * GET method
 */
postController.getAllPostsByUser = (req, res, next) => {
  const { nickname } = req.params;

  Post.find({ author: nickname })
    .then(posts => res.json({ posts }))
    .catch(err => next(err));
};

/**
 *
 * post delete route handler
 * DELETE method
 */
postController.delete = (req, res, next) => {
  const { id, nickname } = req.params;
  User.findOneAndUpdate({ nickname }, { $inc: { postsCount: -1 } })
    .then(user => {
      Promise.all([
        Post.remove({ _id: id }).exec(),
        Comment.remove({ postId: id }).exec(),
      ]);
    })
    .then(() => res.send("delete"))
    .catch(err => next(err));
};

/**
 *
 * like route handler
 * POST method
 */
postController.like = (req, res, next) => {
  const userId = mongoose.Types.ObjectId(req.session.user._id);
  const postId = mongoose.Types.ObjectId(req.params.id);

  const newLike = new Like({
    user: userId,
    post: postId,
  });

  Promise.all([
    newLike.save(),
    Post.findByIdAndUpdate(
      { _id: req.params.id },
      { $inc: { likesCount: 1 } },
    ).exec(),
  ])
    .then(() => {
      console.log("like create");
      res.json({ msg: "like done" });
    })
    .catch(err => next(err));
};

/**
 *
 * dislike route handler
 * POST method
 */
postController.dislike = (req, res, next) => {
  const userId = req.session.user._id;
  const postId = req.params.id;

  Promise.all([
    Like.findOneAndRemove({
      $and: [{ user: userId }, { post: postId }],
    }).exec(),
    Post.findByIdAndUpdate(
      { _id: req.params.id },
      { $inc: { likesCount: -1 } },
    ).exec(),
  ])
    .then(() => {
      console.log("like deleted");
      res.json({ msg: "like delete" });
    })
    .catch(err => next(err));
};

module.exports = postController;
