const passport = require('passport');
const User = require("../model/userModel");

const profileController = {};

profileController.getProfilePage = (req, res, next) =>{
    User.findOne({nickname: req.params.nickname}, function(err, userProfile){
        if(err) return next(err);
        if(!userProfile) return next();

        else {
            if(req.session.user && req.session.user.nickname == req.params.nickname )
                res.locals.isOwn = true;
            res.render("profile", { user: userProfile, token: req.csrfToken()}); 
        }
    });
};


profileController.getPostPage = (req, res, next)=> {
    const nickname = req.params.nickname; 
    res.send( "write post "+ nickname);
};


module.exports = profileController;    

