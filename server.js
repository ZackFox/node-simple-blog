var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

// var index = require("./routes/index");
// var task = require("./routers/task");

var app = express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

app.get("/",(req,res)=>{
    res.render('index',{title:"welcome", message:"hello world!"});
});

app.listen(3000,()=> console.log("server is started"));