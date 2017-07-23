let express      = require("express");
let path         = require("path");
let bodyParser   = require("body-parser");    
let cookieParser = require('cookie-parser');
let session      = require("express-session");
let mongoose     = require('mongoose');
let mongoStore   = require('connect-mongo')(session);
let passport     = require('./config/passport');
let validator    = require("express-validator");

let config       = require("./config/conf");
let indexRouter  = require("./routes/index");
let userRouter   = require("./routes/profile");
let usersRouter  = require("./routes/users");

let app = express();

//use models for mongodb database
mongoose.set("debug",true);
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri,{useMongoClient: true, poolSize: 4});
mongoose.connection.on('connected',() => console.log("connection success!"));


// set server port 
app.set('port', (process.env.PORT || 5000));

app.set('view engine','pug');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(__dirname+"/resources"));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(validator());
app.use(session({
    secret:"spiderman",
    resave:false, 
    saveUninitialized: false,
    store: new mongoStore(({ mongooseConnection: mongoose.connection})),
    cookie: {maxAge:180 * 60 * 1000}
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

app.use("/userslist", usersRouter);
app.use("/profile", userRouter);
app.use("/", indexRouter)

// app.use(function(req, res, next) {
//     let error = new Error('Not Found')
//     error.status = 404;
//     next(error);
// });

// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.next(err);
//   });
// }

// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: err
//     });
// });

app.listen(app.get('port'), () => console.log("server is started"));