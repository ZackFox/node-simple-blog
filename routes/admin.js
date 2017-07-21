var express = require("express");
var router = express.Router();
let passport = require('passport');
var csrf = require("csurf");
let User = require("../model/user");

router.get("/", isLoggedIn, function(req, res, next){
    res.send("admin panel")
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) return next();
    res.redirect("/");
}

module.exports = router;    