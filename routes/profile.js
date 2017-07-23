var express = require("express");
var router = express.Router();
let passport = require('passport');
var csrf = require("csurf");
let User = require("../model/userModel");

router.get("/:nickname", function(req, res, next){
    User.findOne({nickname: req.params.nickname}, function(err, user){
        if(err) return next(err);
        if(!user) return next();        
        res.render("profile", user); 
    });
});

router.get("/:nickname/posts", function(req, res, next){
    const nickname = req.params.nickname; 
    res.send( "all posts of "+ nickname);
});


module.exports = router;    

// function isLoggedIn(req, res, next){
//     let user = req.session.user;
//     if (req.isAuthenticated()) return next();
//     res.redirect("/");
// }