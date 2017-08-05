const Comment = require("../model/commentModel");
const Post = require("../model/postModel");

const commentController = {};

commentController.sendComment = (req, res, next) => {
  const author = req.body.author;
  const postId = req.params.id;
  const newComment = new Comment();
  newComment.author = author;
  newComment.postId = postId;
  newComment.text = req.body.comment;

  newComment.save()
    .then(() => Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } }))
    .then(() => res.redirect("/profile/" + req.params.nickname + "/post/" + postId))
    .catch(err => next(err));
};

commentController.updateComment = (req, res, next) => {
  const id = req.params.replyId;
  const text = req.body.text;

  Comment.findByIdAndUpdate({ _id: id }, { $set: { text, updateTime: Date.now() } }).exec();
};

commentController.deleteComment = (req, res, next) => {
  const replyId = req.params.replyId;
  const postId = req.params.id;

  Comment.findByIdAndRemove({ _id: replyId }).exec()
    .then(() => {
      Post.findByIdAndUpdate({ _id: postId }, { $pull: { comments: replyId } }).exec();
      res.send("delete");
    });
};

module.exports = commentController;

