let passport = require('passport');
let LocalStrategy = require("passport-local").Strategy;
let User = require("../model/userModel");

passport.serializeUser(function(user,done){
    return done(null, user._id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err,user){
        done(err,user);
    });
});

passport.use("signin", new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password', 
        passReqToCallback:true
    }, 
    function(req, login, password, done){        
        User.findOne({$and:[{'login':login}, {'password':password}]}, function(err, user){    
            if(err) return done(err);            
            if(!user){                
                return done(null,false,{message:"данные не верны"}); 
            }
            return done(null,user);
        });  
    }
));

module.exports = passport;