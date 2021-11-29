const mongoose = require("mongoose")
const Schema = mongoose.Schema

const submissionSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  examStarted: {
    type: Boolean,
    required: true,
    default: false,
  },
  examEnded: {
    type: Boolean,
    required: true,
    default: false,
  },
  answers: {
    type: Object,
    default: Object,
  },
  marks: {
    type: Number,
    default: 0,
  },
})

const Submission = mongoose.model("submission", submissionSchema)
module.exports = Submission
