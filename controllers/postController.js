const mongoose = require("mongoose");
const User = require("../model/user");
const Post = require("../model/post");
const Like = require("../model/like");
const Comment = require("../model/comment");
const config = require("../config/conf");

const postController = {};

/**
 *
 * route handler for index route /
 * get all posts
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
 * route handler for /profile/:nickname/post
 * post request to create new post
 * POST method
 */
postController.create = (req, res, next) => {
  const { userId, title, text, preview } = req.body;

  const newPost = new Post();
  newPost.author = mongoose.Types.ObjectId(userId);
  newPost.title = title;
  newPost.text = text;
  newPost.preview = preview;

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
 * route handler for /profile/:nickname/post/:id
 * get one post by id
 * GET method
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
        token: req.csrfToken(),
        post: data[0],
        isLiked,
        comments: data[1],
        url: req.url,
      });
    })
    .catch(err => next(err));
};

/**
 *
 * route handler for
 * get all posts by user nickname
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
 * route handler for /profile/:nickname/post/:id
 * delete post by id
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
 * route handler for /profile/:nickname/post/:id/:like
 * to like a post
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
      res.json({ msg: "like done" });
    })
    .catch(err => next(err));
};

/**
 *
 * route handler for /profile/:nickname/post/:id:/dislike
 * to unlike a post
 * DElETE method
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
      res.json({ msg: "like delete" });
    })
    .catch(err => next(err));
};

module.exports = postController;
