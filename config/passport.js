let passport = require('passport');
let LocalStrategy = require("passport-local").Strategy;
let User = require("../model/user");

passport.serializeUser(function(user,done){
    return done(null, user._id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err,user){
        done(err,user);
    });
});

passport.use("local", new LocalStrategy(
    {usernameField: 'login',passwordField: 'password', passReqToCallback:true},
    function(req, login, password, done){
        User.findOne({login:login}, function(err, user){    
            if(err) done(err);
            
            if(user) return done(null,false, {message: "Такой уже есть"});
            
            let newUser = new User();
            newUser.login = login;
            newUser.password = password;
    
            newUser.save(function (err,result){
                if(err) done(err);
                return done(null,newUser);
            });
    });  
}));

module.exports = passport;