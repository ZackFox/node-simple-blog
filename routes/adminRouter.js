var express = require("express");
var router = express.Router();

// var mongo = require('mongojs');
// var db = mongo("mongodb://mdbadmin:mdbpass@ds155132.mlab.com:55132/mongobase",['tasks']);

router.route("/")
    .get(function(req,res){
        res.send("admin panel")
    });

module.exports = router;