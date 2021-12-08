const Question = require("../models/question")
const ExamInfo = require("../models/examInfo")

const getQuestionsForm = async (req, res) => {
  if (req.session.role === "examiner") {
    const exam = await ExamInfo.findOne()
    if (exam != null && exam.questionsSet === false) {
      const questions = await Question.find()
      res.render("examQuestions", {
        questions: questions,
        message: req.flash("message"),
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
  } else {
    res.redirect("/")
  }
}

const setQuestions = async (req, res) => {
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
    await question.save()
    req.flash("message", "Question added successfully")
    res.redirect("exam-question")
  } else {
    res.redirect("/")
  }
}

const finishQuestionSetting = async (req, res) => {
  if (req.session.role === "examiner") {
    let exam
    const info = await ExamInfo.findOne()
    exam = info
    await ExamInfo.updateOne(
      { _id: exam._id },
      {
        $set: {
          questionsSet: true,
        },
      }
    )
    res.redirect("/exam-question")
    let total = 0
    const questions = await Question.find()
    questions.forEach((question) => {
      total += parseInt(question.mark)
    })
    await ExamInfo.updateOne(
      { _id: exam._id },
      {
        $set: {
          totalMarks: total,
        },
      }
    )
  } else {
    res.redirect("/")
  }
}

const deleteQuestion = async (req, res) => {
  if (req.session.role === "examiner") {
    const quesNo = parseInt(req.params.quesNo)
    await Question.deleteOne({ quesNo: quesNo })
    req.flash("message", "Question deleted successfully")
    res.redirect("/exam-question")
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
