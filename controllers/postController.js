const Post = require("../model/postModel");

const postController = {};

postController.getAllPosts = (req, res, next) => {
    Post.find({})
        .then(posts =>res.json(posts))
        .catch(err => next(err));
};

postController.sendPost = (req, res, next) => {
    const newPost = new Post();
    newPost.author = req.body.author;
    newPost.title = req.body.title;
    newPost.text = req.body.text;
    
    // split('\n');


    newPost.save()
        .then((post) => res.redirect("/"))
        .catch(err => {next(err)});
};

postController.getPostById = (req, res, next) => {
    Post.findOne({_id: req.params.id})
        .then(post => {            
            res.render("postPage",{post:post})            
        })
        .catch(err => next(err));
};

postController.getPostsByUser = (req, res, next) => { 
    const nickname = req.params.nickname;    
    Post.find({author: nickname})
        .then(posts => res.json({posts: posts}))
        .catch(err => next(err));
};

module.exports = postController;    

