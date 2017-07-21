let express      = require("express");
let path         = require("path");
let bodyParser   = require("body-parser");    
let cookieParser = require('cookie-parser');
let session      = require("express-session");
let mongoose     = require('mongoose');
let passport     = require('./config/passport');
let flash        = require('connect-flash');
let validator    = require("express-validator");

let config       = require("./config/conf");
let indexRouter  = require("./routes/indexRouter");
let adminRouter  = require("./routes/adminRouter");
let taskRoutes   = require("./routes/tasksRoutes");

let app = express();

//use models for mongodb database
mongoose.Promise = global.Promise;  
mongoose.connect(config.mongoUri,{useMongoClient: true, poolSize: 4});
mongoose.connection.on('error', error => console.log("error !"+ error));
mongoose.connection.on('connected',() => console.log("connection success!"));

// set server port 
app.set('port', (process.env.PORT || 5000));

app.set('view engine','pug');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(__dirname+"/resources"));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(validator());
app.use(cookieParser());
app.use(session({secret:"spiderman", resave:false, saveUninitialized: false}))
app.use(passport.initialize());
app.use(passport.session());
// app.use(flash());

app.use("/task", taskRoutes);
app.use("/admin", adminRouter);
app.use("/", indexRouter)

app.listen(app.get('port'), () => console.log("server is started"));