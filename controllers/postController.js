const User = require("../model/userModel");
const Post = require("../model/postModel");
const Comment = require("../model/commentModel");

const postController = {};

postController.getAllPosts = (req, res, next) => {
  Post.find({})
    .then(posts => res.json(posts))
    .catch(err => next(err));
};

postController.create = (req, res, next) => {
  const newPost = new Post();
  newPost.author = req.body.author;
  newPost.title = req.body.title;
  newPost.text = req.body.text;
  newPost.preview = req.body.text.substring(0, 400).concat("...");

  newPost.save()
    .then(() => User.findOneAndUpdate({ nickname: req.body.author },
      { $push: { posts: newPost._id } }))
    .then(() => res.json({ id: newPost._id }))
    .catch((err) => { next(err); });
};

postController.getPostById = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .populate({ path: "comments", select: "author createTime text _id" })
    .then((post) => {
      res.render("postPage", { token: req.csrfToken(), post, url: req.url });
    }).catch(err => next(err));
};

postController.getPostsByUser = (req, res, next) => {
  const nickname = req.params.nickname;
  Post.find({ author: nickname })
    .then(posts => res.json({ posts }))
    .catch(err => next(err));
};

postController.delete = (req, res, next) => {
  const id = req.params.id;
  Promise.all([
    Post.remove({ _id: id }),
    Comment.remove({ postId: id }),
  ]).then(() => res.send("delete"))
    .catch(err => next(err));
};

module.exports = postController;
