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

commentController.updateComment = (req, res) => {
  // const author = req.body.author;
  // const postId = req.params.id;

  // let newComment = new Comment();
  // newComment.author = author;
  // newComment.postId = postId;
  // newComment.text = req.body.comment;

  // newComment.save().then(comment => {    
  // res.redirect("/profile/"+req.params.nickname+"/post/"+postId) 
  // })
  // .catch(err => next(err));
  res.send("update");
};

commentController.deleteComment = (req, res) => {
  // const author = req.body.author;
  // const postId = req.params.id;

  // newComment.save().then(comment => {
  // })
  // .catch(err => next(err));
  res.send("delete");
};

module.exports = commentController;

