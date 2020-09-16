let mongoose = require("mongoose");

let PostSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
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
