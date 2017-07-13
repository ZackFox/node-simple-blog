let express = require("express");
let path = require("path");
let bodyParser = require("body-parser");

let app = express();
app.set('port', (process.env.PORT || 5000));
app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');

app.use(express.static(__dirname+"/resources"));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.get("/", (req,res) => res.render('index',{msg:"hello world!"}))

let regRouter = require("./routes/regRouter");
let taskRoutes = require("./routes/tasksRoutes");
let adminRouter = require("./routes/adminRouter");

app.use(regRouter);
app.use("/task", taskRoutes);
app.use("/admin", adminRouter);

app.listen(app.get('port'), () => console.log("server is started"));