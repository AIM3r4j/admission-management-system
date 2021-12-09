const mongoose = require("mongoose")
const Schema = mongoose.Schema

const admittedStudentSchema = new Schema({
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
  program: {
    type: String,
    required: true,
  },
  cgpa: {
    type: Number,
    required: true,
    default: 0,
  },
  studentID: {
    type: Number,
    required: true,
  },
})

const AdmittedStudent = mongoose.model(
  "admittedStudents",
  admittedStudentSchema
)
module.exports = AdmittedStudent
