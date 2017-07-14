var express = require("express");
var router = express.Router();
var csrf = require("csurf");

let csrfProtect = csrf();
router.use(csrfProtect);
// var mongo = require('mongojs');
// var db = mongo("mongodb://mdbadmin:mdbpass@ds155132.mlab.com:55132/mongobase",['tasks']);

router.get("/",function(req,res){
    res.render("index",{token: req.csrfToken()});        
});

router.post("/login", function(req,res){
    console.log(req.body);
    res.status(200).send(req.body);
});

router.route("/reg")
    .get(function(req,res){
        res.render("regpage");
    })
    .post(function(req,res){
        console.log(req.body);
        res.redirect("/");
});


module.exports = router;