const scheduler = require("node-schedule")

const Question = require("../models/question")
const ExamInfo = require("../models/examInfo")
const Submission = require("../models/submission")

const loadExam = (req, res) => {
  if (req.session.role === "student") {
    ExamInfo.findOne().then((exam) => {
      if (exam == null) {
        res.render("exam", {
          questions: "noExamYet",
          message: req.flash("message"),
        })
      } else if (exam.status === "started") {
        Submission.findOne({
          username: req.session.username,
        }).then((submission) => {
          if (submission != null && submission.examStarted === true) {
            Question.find().then((questions) => {
              res.render("exam", {
                questions: questions,
                message: req.flash("message"),
              })
            })
          } else if (submission != null && submission.examEnded === true) {
            res.render("examEnded")
          } else {
            res.render("confirmStart", {
              message: null,
            })
          }
        })
      } else if (exam.status === "unavailable") {
        res.render("confirmStart", {
          message: exam.schedule.toLocaleString("en-AU", {
            dateStyle: "long",
            timeStyle: "long",
          }),
        })
      } else {
        res.render("examEnded")
      }
    })
  }
}

const startExam = (req, res) => {
  if (req.session.role === "student") {
    if (req.body.startConfirmed === "yes") {
      const submission = new Submission({
        username: req.session.username,
        examStarted: true,
      })
      submission
        .save()
        .then(() => {
          //start timer
          //schedule exam end redirect

          res.redirect("/exam")
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      res.redirect("/")
    }
  } else {
    res.redirect("/")
  }
}

const confirmEnd = (req, res) => {
  if (req.session.role === "student") {
    res.render("confirmEnd")
  }
}

const endExam = (req, res) => {
  if (req.session.role === "student") {
    if (req.body.endConfirmed === "yes") {
      Submission.updateOne(
        { username: req.session.username },
        {
          $set: {
            examStarted: false,
            examEnded: true,
          },
        }
      )
        .then(() => {
          res.redirect("/exam")
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      res.redirect("/exam")
    }
  } else {
    res.redirect("/")
  }
}

const submitAnswer = (req, res) => {
  if (req.session.role === "student") {
    const key = Object.keys(req.body)[0]
    const value = Object.values(req.body)[0]
    Submission.updateOne(
      { username: req.session.username },
      {
        $set: {
          ["answers." + key]: value,
        },
      }
    )
      .then(() => {
        req.flash("message", "Answer submitted")
        res.redirect("/exam")
      })
      .catch((err) => {
        console.log(err)
        req.flash("message", err)
        res.redirect("/exam")
      })
  }
}

module.exports = {
  loadExam,
  startExam,
  confirmEnd,
  endExam,
  submitAnswer,
}
