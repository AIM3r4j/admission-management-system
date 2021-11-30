const Student = require("../models/student")
const Submission = require("../models/submission")
const ExamInfo = require("../models/examInfo")

const loadResult = (req, res) => {
  if (req.session.role === "admin") {
    ExamInfo.findOne().then((exam) => {
      if (
        exam != null &&
        exam.endSchedule < Date.now() &&
        exam.status == "resultGenerated"
      ) {
        Student.find({ result: true })
          .then((passed) => {
            res.render("result", {
              role: req.session.role,
              result: "generated",
              results: passed,
            })
          })
          .catch((err) => {
            console.log(err)
          })
      } else if (
        exam != null &&
        exam.endSchedule < Date.now() &&
        exam.status == "resultPublished"
      ) {
        res.render("result", { role: req.session.role, result: "published" })
      } else if (
        exam != null &&
        exam.endSchedule < Date.now() &&
        exam.status == "ended"
      ) {
        res.render("result", { role: req.session.role, result: "notGenerated" })
      } else {
        res.render("result", { role: req.session.role, result: null })
      }
    })
  } else if (req.session.role === "student") {
    ExamInfo.findOne().then((exam) => {
      if (exam == null) {
        res.render("result", { role: req.session.role, result: "noExamYet" })
      } else if (
        exam != null &&
        new Date() > exam.endSchedule &&
        exam.status != "resultPublished"
      ) {
        res.render("result", { role: req.session.role, result: "notPublished" })
      } else if (
        exam != null &&
        new Date() > exam.endSchedule &&
        exam.status == "resultPublished"
      ) {
        Student.findOne({ username: req.session.username })
          .then((student) => {
            if (student.applied == true && student.result == true) {
              if (new Date() <= exam.admissionDeadline) {
                res.render("result", {
                  role: req.session.role,
                  result: "published",
                  passed: student.result,
                  deadline: exam.admissionDeadline,
                  timesUp: false,
                })
              } else {
                res.render("result", {
                  role: req.session.role,
                  result: "published",
                  passed: student.result,
                  deadline: exam.admissionDeadline.toLocaleString("en-US", {
                    timeZone: "Asia/Dhaka",
                    dateStyle: "full",
                    timeStyle: "full",
                  }),
                  timesUp: true,
                })
              }
            } else if (student.applied == true && student.result == false) {
              res.render("result", {
                role: req.session.role,
                result: "published",
                passed: student.result,
              })
            } else {
              res.render("result", {
                role: req.session.role,
                result: "published",
                passed: null,
              })
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        res.render("result", {
          role: req.session.role,
          result: "notYet",
          passed: null,
        })
      }
    })
  }
}

const generateResult = (req, res) => {
  const passingMark = parseInt(req.body.passingMark)
  const limit = parseInt(req.body.limit)
  Submission.find({
    marks: {
      $gte: passingMark,
    },
    $limit: limit,
  })
    .then((result) => {
      result.forEach(async (passed) => {
        await Student.updateOne(
          {
            username: passed.username,
          },
          {
            $set: {
              result: true,
            },
          }
        )
      })
    })
    .then(() => {
      ExamInfo.updateOne(
        {},
        {
          status: "resultGenerated",
        }
      ).then(() => {
        res.redirect("/result")
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

const publishResult = (req, res) => {
  const admissionDeadline = new Date(req.body.admissionDeadline)
  ExamInfo.updateOne(
    {},
    {
      $set: {
        status: "resultPublished",
        admissionDeadline: admissionDeadline,
      },
    }
  )
    .then(() => {
      res.redirect("/result")
    })
    .catch((err) => {
      console.log(err)
    })
}

module.exports = {
  loadResult,
  generateResult,
  publishResult,
}
