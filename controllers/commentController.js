const Comment = require("../model/commentModel");
const Post = require("../model/postModel");

const commentController  = {};

commentController.sendComment = (req, res, next) => {
    const author = req.body.author;
    const postId = req.params.id;

    let newComment = new Comment();
    newComment.author = author;
    newComment.postId = postId;
    newComment.text = req.body.comment;

    newComment.save().then(comment => {
        Post.findByIdAndUpdate(postId,{$push: {"comments" : newComment._id}})
        .then(() => { 
            res.redirect("/profile/"+req.params.nickname+"/post/"+postId) 
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
};

module.exports = commentController;

