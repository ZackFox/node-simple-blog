const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const PostSchema = new Schema({
    author: {type:String},
    title: {type: String, required:true},
    preview: String,
    text:String,
    comments: [{type:ObjectId, ref:"Comment"}],
    createTime: {type: Date, default: Date.now()},
    updateTime: {type: Date, default: Date.now()}
});

// PostSchema.pre('findOne', (next) => {
// 	this.populate({
//         path: "comments",
//         select: "author createtime -_id"
//     });
// 	next();
// });

module.exports = mongoose.model("Post", PostSchema);