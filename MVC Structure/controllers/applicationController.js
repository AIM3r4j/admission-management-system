const Student = require("../models/student")
const ExamInfo = require("../models/examInfo")

const checkEligibility = async (req, res) => {
  try {
    if (req.session.role === "student") {
      const username = req.session.username
      const info = await ExamInfo.findOne()
      if (info == null) {
        res.render("application", { feedback: "noExamYet" })
      } else if (new Date() < info.schedule) {
        const minGPA = info.requirements.gpa
        const student = await Student.findOne({ username: username })
        if (student.applied === false) {
          if (student.gpa >= minGPA) {
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
      } else {
        res.render("application", { feedback: "timesUp" })
      }
    } else {
      res.redirect("/")
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

const registerApplication = async (req, res) => {
  try {
    await Student.updateOne(
      { username: req.session.username },
      {
        $set: {
          applied: true,
        },
      }
    )
    res.redirect("/application")
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = {
  checkEligibility,
  registerApplication,
}
