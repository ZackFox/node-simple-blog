let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserShema = new Schema({
    nickName: {type: String, unique: true},
    email: {type: String, unique: true},
    login: String,
    password: String,
});

module.exports = mongoose.model('User',UserShema);