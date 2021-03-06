const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
  username: { type: String },
  nickname: { type: String, unique: true },
  email: { type: String, unique: true },
  hash: String,
  password: String,
  role: { type: Number, default: 0 },
  postsCount: { type: Number, default: 0 },
  subsCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  avatar: { type: String, default: "avatar.jpg" },
});

UserSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

UserSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10, null));
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
