const Student = require("../models/student")
const Submission = require("../models/submission")
const ExamInfo = require("../models/examInfo")

const loadResult = async (req, res) => {
  try {
    if (req.session.role === "admin") {
      const exam = await ExamInfo.findOne()
      if (
        exam != null &&
        exam.endSchedule < Date.now() &&
        exam.status == "resultGenerated"
      ) {
        const passed = await Student.find({ result: true })
        res.render("result", {
          role: req.session.role,
          result: "generated",
          results: passed,
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
    } else if (req.session.role === "student") {
      const exam = await ExamInfo.findOne()
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
        const student = await Student.findOne({
          username: req.session.username,
        })
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
      } else {
        res.render("result", {
          role: req.session.role,
          result: "notYet",
          passed: null,
        })
      }
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

const generateResult = async (req, res) => {
  try {
    const passingMark = parseInt(req.body.passingMark)
    const limit = parseInt(req.body.limit)
    const submission = await Submission.find({
      marks: {
        $gte: passingMark,
      },
      $limit: limit,
    })
    submission.forEach(async (passed) => {
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
    await ExamInfo.updateOne(
      {},
      {
        status: "resultGenerated",
      }
    )
    res.redirect("/result")
  } catch (error) {
    console.log(error)
    return error
  }
}

const publishResult = async (req, res) => {
  try {
    const admissionDeadline = new Date(req.body.admissionDeadline)
    await ExamInfo.updateOne(
      {},
      {
        $set: {
          status: "resultPublished",
          admissionDeadline: admissionDeadline,
        },
      }
    )
    res.redirect("/result")
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = {
  loadResult,
  generateResult,
  publishResult,
}
