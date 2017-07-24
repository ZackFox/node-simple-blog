const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const PostSchema = new Schema({
    _author: {type: ObjectId, ref: "User" },
    title: {type: String, required:true},
    text:String,
    createTime: {type: Date, default: Date.now()},
    updateTime: {type: Date, default: Date.now()}
});

// PostSchema.pre('save', function (next) {
// 	if (this.isNew) {
// 		this.createTime = this.updateDate = Date.now();
// 	} else {
// 		this.meta, updateTime = Date.now()
// 	}    
// 	next();
// })

module.exports = mongoose.model("Post", PostSchema);