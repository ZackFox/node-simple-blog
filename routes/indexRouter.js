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

//----  check user credentials
router.post("/login", function(req,res){
    console.log(req.body);
    res.status(200).send(req.body);
}); 

//---- registration 
router.get("/reg",function(req,res){
    let message = req.flash("error");
    res.render("regpage",{token: req.csrfToken(), message: message});
})

router.post('/reg', passport.authenticate('local',
    {failureRedirect: "/reg", successRedirect: "/task", failureFlash: true}
));

module.exports = router;