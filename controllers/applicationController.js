const Student = require("../models/student")
const ExamInfo = require("../models/examInfo")

const checkEligibility = (req, res) => {
  if (req.session.role === "student") {
    const username = req.session.username
    ExamInfo.findOne().then((info) => {
      if (info == null) {
        res.render("application", { feedback: "noExamYet" })
      } else if (new Date() < info.schedule) {
        const minGPA = info.requirements.gpa
        Student.findOne({ username: username }).then((result) => {
          if (result.applied === false) {
            if (result.gpa >= minGPA) {
              res.render("application", {
                feedback: "applicable",
                username: username,
                deadline: info.schedule.toLocaleString("en-US", {
                  timeZone: "Asia/Dhaka",
                  dateStyle: "full",
                  timeStyle: "full",
                }),
                requirements: minGPA,
              })
            } else {
              res.render("application", {
                feedback: "non-applicable",
                requirements: minGPA,
              })
            }
          } else {
            res.render("application", { feedback: "applied" })
          }
        })
      } else {
        res.render("application", { feedback: "timesUp" })
      }
    })
  } else {
    res.redirect("/")
  }
}

const registerApplication = (req, res) => {
  const username = req.session.username
  Student.updateOne(
    { username: username },
    {
      $set: {
        applied: true,
      },
    }
  ).then((result) => {
    res.redirect("/application")
  })
}

module.exports = {
  checkEligibility,
  registerApplication,
}
