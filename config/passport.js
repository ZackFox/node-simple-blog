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

passport.use("signup", new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password', 
        passReqToCallback:true
    }, 
    function(req, login, password, done){        
        User.findOne({$or:[{'login':login}, {'password':password}]}, function(err, user){    
            if(err) done(err);
            
            if(user){
                let message = {login:"Такой логин уже есть", password:"Такой пароль уже есть"};                
                
                if(user.login === login && user.password !== password ){
                    message.password = "";
                }
                else if (user.login !== login && user.password === password ) {
                    message.login = "";
                }

                return done(null,false, message);
            }
            
            return done(null,newUser,{message:"свободен"}); 
        });  
    }
));

module.exports = passport;