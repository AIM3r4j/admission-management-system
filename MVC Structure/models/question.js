const mongoose = require("mongoose")
const Schema = mongoose.Schema

const questionSchema = new Schema({
  quesNo: {
    type: Number,
    required: true,
    unique: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  option1: {
    type: String,
    required: true,
  },
  option2: {
    type: String,
    required: true,
  },
  option3: {
    type: String,
    required: true,
  },
  option4: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  mark: {
    type: Number,
    required: true,
  },
})

const Question = mongoose.model("question", questionSchema)
module.exports = Question
