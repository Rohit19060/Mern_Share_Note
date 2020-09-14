let mongoose = require("mongoose");

var currentdate = new Date();
var datetime =
  currentdate.getDate() +
  "-" +
  (currentdate.getMonth() + 1) +
  "-" +
  currentdate.getFullYear() +
  " " +
  currentdate.getHours() +
  ":" +
  currentdate.getMinutes() +
  ":" +
  currentdate.getSeconds();

let PostSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    default: datetime,
  },
  content: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
  },
});

module.exports = mongoose.model("Post", PostSchema, "post");
