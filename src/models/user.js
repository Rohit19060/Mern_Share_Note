let mongoose = require("mongoose");

// user schema for user collections
let UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  follows: {
    type: Array,
  },
});

module.exports = mongoose.model("User", UserSchema, "user");
