let mongoose = require('mongoose');
let bcrypt = require("bcrypt-nodejs");
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    nickname: String,
    email:String,
    login: String,
    password: String
    // hash:String,
    // salt:String
});

UserSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5),null);
};


UserSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5),null);
};


UserSchema.methods.validatePassword = function(password){
    return  bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);