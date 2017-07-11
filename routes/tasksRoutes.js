var express = require("express");
var router = express.Router();

var mongo = require('mongojs');
var connection = mongo("mongodb://mdbadmin:mdbpass@ds155132.mlab.com:55132/mongobase",['tasks']);

router.get('/task',function(req,res,next){
    connection.tasks.find(function(err,tasks){
        if(err) res.send(err);
        res.json(tasks);
    });
});

module.exports = router;