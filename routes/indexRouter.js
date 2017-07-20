var express = require("express");
let passport = require('passport');
var csrf = require("csurf");
let User = require("../model/user");
var router = express.Router();

let csrfProtect = csrf();
router.use(csrfProtect);

router.get("/",function(req,res){
    res.render("index",{token: req.csrfToken()});        
});

//---- registration 
router.get("/signup",function(req,res){
    res.render("regpage", { token: req.csrfToken()});
})

router.post("/signup", function(req, res, next) {
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

router.post('/validate/nickname', function(req, res, next) {
    User.findOne({'login': req.body.login} , function(err, user){    
        if(err) return res.status(500).next(err);            
        if(user) return res.send("Это имя уже занято");
        res.send("true");
    })
});

router.post('/validate/email', function(req, res, next) {
    User.findOne({'password': req.body.password} , function(err, user){    
        if(err) return res.status(500).next(err);            
        if(user) return res.send("Этот email уже используется");
        res.send("true");
    })
});

//----  check user credentials
router.post("/login", function(req,res){
    console.log(req.body);
    res.status(200).send(req.body);
}); 

// req.checkBody("nickname").notEmpty();
//     req.checkBody("email").notEmpty();
//     req.checkBody("login").notEmpty();
//     req.checkBody("password").notEmpty().isLength({min:3});                
    
//     req.getValidationResult().then(function(result){
//         if(!result.isEmpty()){ 
//            return res.status(401).send("not valid credentials");
//         }

//         passport.authenticate("signup", function(error, notExist, info) {
//             if(error) return res.status(500).send("error");    
//             if(!notExist) return res.status(401).json(info);                           
//             res.status(200).redirect("/");             
//         })(req, res, next); 
//     });

module.exports = router;