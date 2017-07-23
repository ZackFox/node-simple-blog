var express = require("express");
var router = express.Router();
let User = require("../model/userModel");

router.get('/',function(req,res,next){
    User.find({}).exec(function(error,users){
        if(error) res.send(error);
        res.json(users);
    });
});

module.exports = router;