const User = require("../model/userModel");
const Post = require("../model/postModel");
const Comment = require("../model/commentModel");
const config = require("../config/conf");

const postController = {};

postController.getAllPosts = (req, res, next) => {
  let pageNumber = req.query.page ? Number.parseInt(req.query.page, 10) : 1;
  if (pageNumber < 1) pageNumber = 1;

  Post.find({})
    .count()
    .then(count => {
      const limit = config.postsLimit;
      const pages = Math.ceil(0 / limit);
      if (pageNumber > pages) {
        page = pages;
      }

      // console.log("current page " + pageNumber);
      // console.log("count pages " + pages);
      // console.log("skip " + limit * pageNumber);

      Post.find({})
        .skip(limit * (pageNumber - 1))
        .limit(limit)
        .sort({ createTime: "desc" })
        .then(posts => {
          res.render("index", {
            token: req.csrfToken(),
            posts,
            pages,
            pageNumber,
            paginationLimit: config.paginationLimit,
          });
        });
    })
    .catch(err => next(err));
};

postController.create = (req, res, next) => {
  const newPost = new Post();
  newPost.author = req.body.author;
  newPost.title = req.body.title;
  newPost.text = req.body.text;
  newPost.preview = req.body.text.substring(0, 400).concat("...");

  newPost
    .save()
    .then(() =>
      User.findOneAndUpdate(
        { nickname: req.body.author },
        { $push: { posts: newPost._id } },
      ),
    )
    .then(() => res.json({ id: newPost._id }))
    .catch(err => {
      next(err);
    });
};

postController.getPostById = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .populate({ path: "comments", select: "author createTime text _id" })
    .then(post => {
      res.render("postPage", { token: req.csrfToken(), post, url: req.url });
    })
    .catch(err => next(err));
};

postController.getPostsByUser = (req, res, next) => {
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
