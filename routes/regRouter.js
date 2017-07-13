var express = require("express");
var router = express.Router();

// var mongo = require('mongojs');
// var db = mongo("mongodb://mdbadmin:mdbpass@ds155132.mlab.com:55132/mongobase",['tasks']);

router.route("/reg")
    .get(function(req,res){
        res.render("regpage");
    })
    .post(function(req,res){
        console.log(req.body);
        res.redirect("/");
});

module.exports = router;