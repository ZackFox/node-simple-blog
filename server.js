const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const passport = require("./config/passport");
const validator = require("express-validator");

const csrf = require("csurf");
const moment = require("./config/moment");

const config = require("./config/conf");
const routes = require("./routes/routes");

const app = express();

// mongoose.set("debug", true);
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri, { useMongoClient: true, poolSize: 4 }, () =>
  console.log("connection success!"),
);

// set server port
app.set("port", process.env.PORT || 5000);

// app.set("view engine", "pug");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "/public")));

app.use(bodyParser.urlencoded({ extended: true, limit: "20mb" }));
app.use(bodyParser.json());
app.use(validator());
app.use(
  session({
    secret: "spiderman",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 },
  }),
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf());

app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  res.locals.moment = moment;
  res.locals.session = req.session;
  next();
});

// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.next(err);
//   });
// }

// app.use(function(req, res, next) {
//     let error = new Error('Not Found')
//     error.status = 404;
//     next(error);
// });

app.use("/", routes);

app.listen(app.get("port"), () => console.log("server is started"));
