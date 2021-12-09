const scheduler = require("node-schedule")
const startEvaluation = require("../lib/evaluation")
const ExamInfo = require("../models/examInfo")

const loadExamInfo = async (req, res) => {
  try {
    if (req.session.role === "student") {
      const info = await ExamInfo.findOne()
      res.render("examInfo", { details: info })
    } else {
      res.redirect("/")
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

const setExamInfo = async (req, res) => {
  try {
    if (req.session.role === "admin") {
      const startSchedule = new Date(req.body.schedule + "Z")

      let endSchedule = new Date(startSchedule)
      let minutes = startSchedule.getMinutes()
      const addMinutes = parseInt(req.body.duration)
      minutes = minutes + addMinutes
      endSchedule.setMinutes(minutes)

      let dateOptions = {
        timeZone: "Asia/Dhaka",
        dateStyle: "full",
        timeStyle: "full",
      }

      const examInfo = new ExamInfo({
        name: req.body.name,
        schedule: startSchedule,
        endSchedule: endSchedule,
        durationInMinute: req.body.duration,
        requirements: { gpa: req.body.gpa },
      })
      await examInfo.save()
      req.flash("success", "Exam details saved!")
      res.redirect("exam-settings")
      console.log(
        "Exam start scheduled at",
        startSchedule.toLocaleString("en-US", dateOptions)
      )
      scheduler.scheduleJob(startSchedule, async () => {
        await ExamInfo.updateOne(
          {
            name: req.body.name,
          },
          {
            $set: {
              status: "started",
            },
          }
        )
        console.log(
          "Exam started at",
          new Date().toLocaleString("en-US", dateOptions)
        )
      })
      console.log(
        "Exam end scheduled at",
        endSchedule.toLocaleString("en-US", dateOptions)
      )
      scheduler.scheduleJob(endSchedule, async () => {
        await ExamInfo.updateOne(
          {
            name: req.body.name,
          },
          {
            $set: {
              status: "ended",
            },
          }
        )
        console.log(
          "Exam ended at",
          new Date().toLocaleString("en-US", dateOptions)
        )
        console.log(
          "Evaluation started at",
          new Date().toLocaleString("en-US", dateOptions)
        )
        startEvaluation()
      })
    } else {
      res.redirect("/")
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

const deleteExamInfo = (req, res) => {
  try {
    if (req.session.role === "admin") {
      ExamInfo.deleteOne({
        _id: req.params.id,
      })
        .then((result) => {
          req.flash("message", "Exam deleted successfully")
          res.redirect("/exam-settings")
        })
        .catch((err) => {
          console.error(err)
        })
    } else {
      res.redirect("/")
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = {
  loadExamInfo,
  setExamInfo,
  deleteExamInfo,
}
