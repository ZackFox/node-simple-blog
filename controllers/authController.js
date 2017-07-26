const passport = require('passport');
const User = require("../model/userModel");

const authController = {};

authController.getSignUpPage = (req,res) => {
    res.render("regpage", { token: req.csrfToken()});
};

authController.signUp = (req, res, next) => {
        let newUser = new User();
        newUser.email = req.body.email;
        newUser.nickname = req.body.nickname;
        newUser.password = req.body.password;

        newUser.save()
            .then(() => res.redirect("/"))
            .catch( err => next(err));  
};

authController.signIn = (req,res,next) => {
    if(req.body.nickname === "" && req.body.password === "")
        return res.json({message:"empty fiels"});
    
    passport.authenticate("signin", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.json(info);        
        req.logIn(user, (err) => {
            if (err) return next(err); 
            req.session.user = user
            res.json(info);
        });
  })(req, res, next);
}


authController.signOut = (req, res, next) => {
    req.logOut();
    req.session.user = null;
    res.redirect("/");
};


authController.checkCredentials = (req, res, next) => {
    if(req.body.valid === "nickname"){
        User.findOne({'nickname': req.body.nickname} , function(err, user){    
            if(err) return res.status(500).next(err);            
            if(user) return res.send("Это имя уже занято");
            res.send("true");
        })
    }
    else if(req.body.valid === "email"){
        User.findOne({'email': req.body.email} , function(err, user){    
            if(err) return res.status(500).next(err);            
            if(user) return res.send("Этот email уже используется");
            res.send("true");
        })        
    }
    else res.sendStatus(404);
}

module.exports = authController;
