const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const LikeSchema = new Schema({
  user: { type: ObjectId, ref: "User" },
  post: { type: ObjectId, ref: "Post" },
});

module.exports = mongoose.model("Like", LikeSchema);
