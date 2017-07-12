let express = require("express");
let path = require("path");
let bodyParser = require("body-parser");
let hbs = require("express-handlebars");

// var index = require("./routes/index");
let taskRoutes = require("./routes/tasksRoutes");
let app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');
app.engine('hbs',hbs({extname:'hbs'}));

app.set('port', (process.env.PORT || 5000));

app.get("/",(req,res)=>{
    res.render('index',{msg:"hello world!"});
});

app.use(taskRoutes);

app.listen(app.get('port'),()=> console.log("server is started"));