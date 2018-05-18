const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CommentSchema = new Schema({
  author: { type: ObjectId, ref: "User" },
  text: String,
  postId: { type: ObjectId, ref: "Post" },
  createTime: { type: Date, default: Date.now },
  updateTime: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

CommentSchema.statics.getLastcomments = function() {
  return this.find({})
    .sort({ createTime: -1 })
    .skip(0)
    .limit(5)
    .populate({
      path: "author",
      select: "_id username nickname",
    });
};

module.exports = mongoose.model("Comment", CommentSchema);
