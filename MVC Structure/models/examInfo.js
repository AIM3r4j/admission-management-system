const mongoose = require("mongoose")
const Schema = mongoose.Schema

const examInfoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  schedule: {
    type: Date,
    required: true,
  },
  endSchedule: {
    type: Date,
    required: true,
  },
  durationInMinute: {
    type: Number,
    required: true,
  },
  requirements: {
    gpa: {
      type: Number,
      required: true,
    },
  },
  totalMarks: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    required: true,
    default: "unavailable",
  },
  questionsSet: {
    type: Boolean,
    required: true,
    default: false,
  },
  admissionDeadline: {
    type: Date,
  },
})

const ExamInfo = mongoose.model("examInfo", examInfoSchema)
module.exports = ExamInfo
