const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    nickname: {type: String, unique: true },
    email: {type: String, unique: true },
    login: String,
    password: String,
    role: {type: Number, default: 0 },
    avatar: {type: String, default: "avatar.jpg"}
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