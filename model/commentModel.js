const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CommentSchema = new Schema({
  author: String,
  text: String,
  postId: { type: ObjectId, ref: "Post" },
  createTime: { type: Date, default: Date.now() },
  updateTime: { type: Date, default: Date.now() },
  isDeleted: { type: Boolean, default: false }
});

// PostSchema.pre('save', function (next) {
// 	if (this.isNew) {
// 		this.createTime = this.updateDate = Date.now();
// 	} else {
// 		this.meta, updateTime = Date.now()
// 	}    
// 	next();
// })

module.exports = mongoose.model("Comment", CommentSchema);