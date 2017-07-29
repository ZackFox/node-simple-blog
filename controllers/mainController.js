// const User = require("../model/userModel");
const Post = require("../model/postModel");

const mainController = {};

mainController.welcome = (req, res, next) => {
  Post.find({}).then((posts) => {
    // posts.map((p) => {
    //     let date = new Date(p.createTime)
    //     console.log(date.toDateString())
    //     p.createTime = date; 

    //     console.log(p.createTime)   
    // });
    res.render("index", { token: req.csrfToken(), posts: posts });
  }).catch(err => next(err));
};
module.exports = mainController;
