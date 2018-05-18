const mongoose = require("mongoose");
const Comment = require("../model/commentModel");
const Post = require("../model/postModel");

const commentController = {};

commentController.create = (req, res, next) => {
  const userId = req.body.userId;
  const postId = req.params.id;

  const newComment = new Comment();
  newComment.author = mongoose.Types.ObjectId(userId);
  newComment.postId = postId;
  newComment.text = req.body.text;

  newComment.save()
    .then(() => {
      Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } }).exec();
    })
    .then(() => res.json({ status: "success", comment: newComment }))
    .catch(err => next(err));
};


commentController.update = (req, res, next) => {
  const id = req.params.replyId;
  const text = req.body.text;

  Comment.findByIdAndUpdate({ _id: id }, { $set: { text, updateTime: Date.now } }).exec();
};

commentController.delete = (req, res, next) => {
  const replyId = req.params.replyId;
  const postId = req.params.id;

  Comment.findByIdAndRemove({ _id: replyId }).then(() => {
    Post.findByIdAndUpdate({ _id: postId }, { $inc: { commentsCount: -1 } }).exec();
  }).then(() => res.send("delete"))
    .catch(err => next(err));
};

module.exports = commentController;

