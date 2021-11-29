const Question = require("../models/question")
const ExamInfo = require("../models/examInfo")

const getQuestionsForm = (req, res) => {
  if (req.session.role === "examiner") {
    ExamInfo.findOne().then((exam) => {
      if (exam != null && exam.questionsSet === false) {
        Question.find().then((questions) => {
          res.render("examQuestions", {
            questions: questions,
            message: req.flash("message"),
          })
        })
      } else if (exam != null && exam.questionsSet === true) {
        res.render("examQuestions", {
          questions: "none",
          message: req.flash("message"),
        })
      } else {
        res.render("examQuestions", {
          questions: null,
          message: req.flash("message"),
        })
      }
    })
  } else {
    res.redirect("/")
  }
}

const setQuestions = (req, res) => {
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
    const question = new Question({
      quesNo: req.body.quesNo,
      questionText: req.body.questionText,
      option1: req.body.option1,
      option2: req.body.option2,
      option3: req.body.option3,
      option4: req.body.option4,
      correctAnswer: correctAnswer,
      mark: req.body.mark,
    })
    question
      .save()
      .then((result) => {
        if (result) {
          req.flash("message", "Question added successfully")
          res.redirect("exam-question")
        }
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
    res.redirect("/")
  }
}

const finishQuestionSetting = (req, res) => {
  if (req.session.role === "examiner") {
    let exam
    ExamInfo.findOne()
      .then((result) => {
        exam = result
        ExamInfo.updateOne(
          { _id: exam._id },
          {
            $set: {
              questionsSet: true,
            },
          }
        ).then(() => {
          res.redirect("/exam-question")
          let total = 0
          Question.find()
            .then((questions) => {
              questions.forEach((question) => {
                total += parseInt(question.mark)
              })
            })
            .then(() => {
              ExamInfo.updateOne(
                { _id: exam._id },
                {
                  $set: {
                    totalMarks: total,
                  },
                }
              ).catch((err) => {
                console.log(err)
              })
            })
        })
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
    res.redirect("/")
  }
}

const deleteQuestion = (req, res) => {
  if (req.session.role === "examiner") {
    const quesNo = parseInt(req.params.quesNo)
    Question.deleteOne({ quesNo: quesNo })
      .then((result) => {
        if (result) {
          req.flash("message", "Question deleted successfully")
          res.redirect("/exam-question")
        }
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
    res.redirect("/")
  }
}

module.exports = {
  getQuestionsForm,
  setQuestions,
  finishQuestionSetting,
  deleteQuestion,
}
