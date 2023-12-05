const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  rollNo: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    minLength: [4, "Minimum name length is 4 characters."],
  },
  dob: {
    type: Date,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const studentDb = mongoose.model("studentDb", schema);
module.exports = studentDb;
