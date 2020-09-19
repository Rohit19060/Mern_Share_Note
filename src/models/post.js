let mongoose = require("mongoose");

// Post schema for all the posts
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
    type: Number,
  },
});

module.exports = mongoose.model("Post", PostSchema, "post");
