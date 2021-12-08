const Submission = require("../models/submission")
const Question = require("../models/question")

const startEvaluation = async () => {
  let answers = {}
  let marks = {}
  const questions = await Question.find()
  questions.forEach((question) => {
    const answer = "answer" + question.quesNo.toString()
    answers[answer] = question.correctAnswer
    marks[answer] = question.mark
  })
  const submissions = await Submission.find()
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
  console.log("Evaluation ended at", new Date().toString())
}

module.exports = startEvaluation
