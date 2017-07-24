const express = require("express");
const router = express.Router();
const passport = require('passport');
const csrf = require("csurf");
const User = require("../model/userModel");

router.get("/:nickname", function(req, res, next){
    User.findOne({nickname: req.params.nickname}, function(err, userProfile){
        if(err) return next(err);
        if(!userProfile) return next();

        else {
            if(req.session.user && req.session.user.nickname == req.params.nickname )
                res.locals.isOwn = true;
            res.render("profile", { user: userProfile, token: req.csrfToken()}); 
        }
    });
});

router.get("/:nickname/post", isLoggedIn, function(req, res, next){
    const nickname = req.params.nickname; 
    res.send( "write post "+ nickname);
});


module.exports = router;    

function isLoggedIn(req, res, next){
    if (req.session.user && req.session.user.nickname == req.params.nickname)
        return next();
    res.redirect("/");
}
