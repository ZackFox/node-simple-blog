var express = require("express");
var router = express.Router();

router.route("/")
    .get(function(req,res){
        res.render("regpage");
    })
    .post(function(req,res){
        console.log(req.body);
        res.redirect("/");
});

module.exports = router;