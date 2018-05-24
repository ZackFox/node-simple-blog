const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const SubscriberSchema = new Schema({
  author: { type: ObjectId, ref: "User" },
  subscriber: { type: ObjectId, ref: "User" },
});

module.exports = mongoose.model("Subscriber", SubscriberSchema);
