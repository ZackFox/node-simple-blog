const mongoose = require("mongoose");
const config = require("../config/conf");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const PostSchema = new Schema({
  author: { type: ObjectId, ref: "User" },
  title: { type: String, required: true },
  preview: String,
  text: String,
  commentsCount: { type: Number, default: 0 },
  likesCount: { type: Number, default: 0 },
  createTime: { type: Date, default: Date.now },
  updateTime: { type: Date, default: Date.now },
});

PostSchema.statics.getAllPosts = function(options) {
  return this.count().then(count => {
    options.pages = Math.ceil(count / options.limit);

    if (options.page > options.pages) {
      options.page = options.pages;
    }

    return this.find({})
      .sort({ createTime: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .populate({
        path: "author",
        select: "_id username nickname avatar",
      });
  });
};

PostSchema.statics.getLastPosts = function() {
  return this.find({})
    .sort({ createTime: -1 })
    .skip(0)
    .limit(5)
    .populate({
      path: "author",
      select: "_id username nickname",
    });
};

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
