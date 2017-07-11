let express = require("express");
let path = require("path");
let bodyParser = require("body-parser");

// var index = require("./routes/index");
let taskRoutes = require("./routes/tasksRoutes");
let app = express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

app.set('port', (process.env.PORT || 5000));

app.get("/",(req,res)=>{
    res.render('index',{title:"welcome", message:"hello world!"});
});

app.use(taskRoutes);

app.listen(app.get('port'),()=> console.log("server is started"));