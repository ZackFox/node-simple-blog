var express = require("express");
var router = express.Router();

var mongo = require('mongojs');
var db = mongo("mongodb://mdbadmin:mdbpass@ds155132.mlab.com:55132/mongobase",['tasks']);

router.get('/',function(req,res,next){
    db.tasks.find(function(error,tasks){
        if(error) res.send(error);
        res.json(tasks);
    });
});

module.exports = router;