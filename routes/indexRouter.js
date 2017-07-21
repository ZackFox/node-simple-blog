var express = require("express");
let passport = require('passport');
var csrf = require("csurf");
let User = require("../model/user");
var router = express.Router();

let csrfProtect = csrf();
router.use(csrfProtect);

//----- registration page and sign Up
router.route("/signup")
    .get(function(req,res){
        res.render("regpage", { token: req.csrfToken()});
    })
    .post(function(req, res, next) {
        let newUser = new User();
        newUser.email = req.body.email;
        newUser.nickname = req.body.nickname;
        newUser.login = req.body.login;
        newUser.password = req.body.password;

        newUser.save(function (err,result){
            if(err) next(err);
            res.redirect("/");
    });  
});

//------------ sign In
router.post("/signin", passport.authenticate("signin", { successRedirect:'admin'}));

//----------- sign Out
router.get("/signout",function(req,res, next){
    req.logOut();
    res.redirect("/");             
});

//----- credential validate 
router.post('/validate', function(req, res, next) {
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
});

router.get("/",function(req, res, next){
    res.render("index",{token: req.csrfToken()});        
}); 





// req.checkBody("nickname").notEmpty();
//     req.checkBody("email").notEmpty();
//     req.checkBody("login").notEmpty();
//     req.checkBody("password").notEmpty().isLength({min:3});                
    
//     req.getValidationResult().then(function(result){
//         if(!result.isEmpty()){ 
//            return res.status(401).send("not valid credentials");
//         }
//     });

module.exports = router;