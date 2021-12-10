const setQuestions = (req, res) => {
  try {
    if (req.session.role === "examiner") {
      const correctOption = req.body.correctOption
      if (correctOption == "1") {
        correctAnswer = req.body.option1
      } else if (correctOption == "2") {
        correctAnswer = req.body.option2
      } else if (correctOption == "3") {
        correctAnswer = req.body.option3
      } else if (correctOption == "4") {
        correctAnswer = req.body.option4
      }
      const question = {
        quesNo: req.body.quesNo,
        questionText: req.body.questionText,
        option1: req.body.option1,
        option2: req.body.option2,
        option3: req.body.option3,
        option4: req.body.option4,
        correctAnswer: correctAnswer,
        mark: req.body.mark,
      }
      return question
    } else {
      res.redirect("/")
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = {
  setQuestions,
}
