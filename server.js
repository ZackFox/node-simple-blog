let express = require("express");
let path = require("path");
let bodyParser = require("body-parser");
let mongoose = require('mongoose');

let regRouter = require("./routes/regRouter");
let taskRoutes = require("./routes/tasksRoutes");
let adminRouter = require("./routes/adminRouter");
let loginRouter = require("./routes/loginRouter");

let app = express();

const uri = "mongodb://mdbadmin:mdbpass@ds155132.mlab.com:55132/mongobase";

mongoose.Promise = global.Promise; 
mongoose.connect(uri,{useMongoClient: true, poolSize: 4});
mongoose.connection.on('error', error => console.log("error !"+ error));
mongoose.connection.on('connected',() => console.log("connection success!"));

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname+"/resources"));


app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/", (req,res) => res.render('index',{msg:"hello world!"}))
app.use("/login", loginRouter);
app.use("/reg", regRouter);
app.use("/task", taskRoutes);
app.use("/admin", adminRouter);

app.listen(app.get('port'), () => console.log("server is started"));