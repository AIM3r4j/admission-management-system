const scheduler = require("node-schedule")

const Question = require("../models/question")
const ExamInfo = require("../models/examInfo")
const Submission = require("../models/submission")

const loadExam = async (req, res) => {
  try {
    if (req.session.role === "student") {
      const exam = await ExamInfo.findOne()
      if (exam == null) {
        res.render("exam", {
          questions: "noExamYet",
          message: req.flash("message"),
        })
      } else if (exam.status === "started") {
        const submission = await Submission.findOne({
          username: req.session.username,
        })
        if (submission != null && submission.examStarted === true) {
          const questions = await Question.find()
          res.render("exam", {
            questions: questions,
            message: req.flash("message"),
          })
        } else if (submission != null && submission.examEnded === true) {
          res.render("examEnded")
        } else {
          res.render("confirmStart", {
            message: null,
          })
        }
      } else if (exam.status === "unavailable") {
        res.render("confirmStart", {
          message: exam.schedule.toLocaleString("en-US", {
            timeZone: "Asia/Dhaka",
            dateStyle: "full",
            timeStyle: "full",
          }),
        })
      } else {
        res.render("examEnded")
      }
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

const startExam = async (req, res) => {
  try {
    if (req.session.role === "student") {
      if (req.body.startConfirmed === "yes") {
        const submission = new Submission({
          username: req.session.username,
          examStarted: true,
        })
        await submission.save()
        res.redirect("/exam")
      } else {
        res.redirect("/")
      }
    } else {
      res.redirect("/")
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

const confirmEnd = (req, res) => {
  if (req.session.role === "student") {
    res.render("confirmEnd")
  }
}

const endExam = async (req, res) => {
  try {
    if (req.session.role === "student") {
      if (req.body.endConfirmed === "yes") {
        await Submission.updateOne(
          { username: req.session.username },
          {
            $set: {
              examStarted: false,
              examEnded: true,
            },
          }
        )
        res.redirect("/exam")
      } else {
        res.redirect("/exam")
      }
    } else {
      res.redirect("/")
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

const submitAnswer = async (req, res) => {
  try {
    if (req.session.role === "student") {
      const key = Object.keys(req.body)[0]
      const value = Object.values(req.body)[0]
      await Submission.updateOne(
        { username: req.session.username },
        {
          $set: {
            ["answers." + key]: value,
          },
        }
      )
      req.flash("message", "Answer submitted")
      res.redirect("/exam")
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = {
  loadExam,
  startExam,
  confirmEnd,
  endExam,
  submitAnswer,
}
