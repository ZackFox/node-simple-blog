const User = require("../model/userModel");
const Post = require("../model/postModel");

const mainController  = {};

mainController.welcome = (req, res, next) => {
    Post.find({}).then(posts =>{
        let postsList = [];
        if(posts) postsList = posts;
        res.render("index", {token: req.csrfToken(), posts:postsList});
    }).catch(err => next(err));
}

module.exports = mainController;

