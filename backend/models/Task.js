const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: String,
  title: String,
  category: String,

  date: {
    type: Date,
    required: true
  },

  completed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Task", taskSchema);