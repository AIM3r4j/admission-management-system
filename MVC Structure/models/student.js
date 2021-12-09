const mongoose = require("mongoose")
const Schema = mongoose.Schema

const studentSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gpa: {
    type: Number,
    required: true,
  },
  applied: {
    type: Boolean,
    required: true,
    default: false,
  },
  result: {
    type: Boolean,
    required: true,
    default: false,
  },
  admitted: {
    type: Boolean,
    required: true,
    default: false,
  },
})

const Student = mongoose.model("students", studentSchema)
module.exports = Student
