const Submission = require("../models/submission")
const Question = require("../models/question")

const startEvaluation = () => {
  let answers = {}
  let marks = {}
  Question.find()
    .then((questions) => {
      questions.forEach((question) => {
        const answer = "answer" + question.quesNo.toString()
        answers[answer] = question.correctAnswer
        marks[answer] = question.mark
      })
    })
    .then(() => {
      Submission.find().then((submissions) => {
        submissions.forEach(async (submission) => {
          let obtainedMarks = 0
          const submittedAnswers = submission.answers
          Object.keys(submittedAnswers).forEach((key) => {
            if (submittedAnswers[key] === answers[key]) {
              obtainedMarks += marks[key]
            }
          })
          await Submission.updateOne(
            { username: submission.username },
            { marks: obtainedMarks }
          )
        })
      })
    })
    .catch((err) => {
      console.log(err)
    })
  console.log("Evaluation ended at", new Date().toString())
}

module.exports = startEvaluation
