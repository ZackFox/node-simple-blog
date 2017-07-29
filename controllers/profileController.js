const passport = require('passport');
const User = require("../model/userModel");
const Post = require("../model/postModel");

const profileController = {};

profileController.getProfilePage = (req, res, next) =>{
    User.findOne({nickname: req.params.nickname})
        .then((user) => {
            if(!user) return next();
            else {
                console.log(user);
                if(req.session.user && req.session.user.nickname == req.params.nickname )
                  res.locals.isOwn = true;
                res.render("profile", { user: user, token: req.csrfToken()}); 
            }
        }).catch((err) => next(err));
};

profileController.getPostPage = (req, res, next) => { 
    res.render("createpost",{token:req.csrfToken()});
};

module.exports = profileController;    

