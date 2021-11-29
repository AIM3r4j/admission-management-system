const scheduler = require("node-schedule")
const startEvaluation = require("../lib/evaluation")
const ExamInfo = require("../models/examInfo")

const loadExamInfo = (req, res) => {
  if (req.session.role === "student") {
    ExamInfo.findOne()
      .then((result) => {
        res.render("examInfo", { details: result })
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
    res.redirect("/")
  }
}

const setExamInfo = (req, res) => {
  if (req.session.role === "admin") {
    let endSchedule = new Date(req.body.schedule)
    let minutes = endSchedule.getMinutes()
    const addMinutes = parseInt(req.body.duration)
    minutes = minutes + addMinutes
    endSchedule.setMinutes(minutes)
    const examInfo = new ExamInfo({
      name: req.body.name,
      schedule: req.body.schedule,
      endSchedule: endSchedule,
      durationInMinute: req.body.duration,
      requirements: { gpa: req.body.gpa },
    })
    examInfo
      .save()
      .then(() => {
        req.flash("success", "Exam details saved!")
        res.redirect("exam-settings")
      })
      .then(() => {
        const name = req.body.name
        const schedule = new Date(req.body.schedule)
        console.log("Exam start scheduled at", schedule.toString())
        scheduler.scheduleJob(schedule, () => {
          ExamInfo.updateOne(
            {
              name: name,
            },
            {
              $set: {
                status: "started",
              },
            }
          ).then(() => {
            console.log("Exam started at", new Date().toString())
          })
        })
      })
      .then(() => {
        const name = req.body.name
        console.log("Exam end scheduled at", endSchedule.toString())
        const job2 = scheduler.scheduleJob(endSchedule, () => {
          ExamInfo.updateOne(
            {
              name: name,
            },
            {
              $set: {
                status: "ended",
              },
            }
          )
            .then(() => {
              console.log("Exam ended at", new Date().toString())
            })
            .then(async () => {
              console.log("Evaluation started at", new Date().toString())
              startEvaluation()
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

const deleteExamInfo = (req, res) => {
  if (req.session.role === "admin") {
    ExamInfo.deleteOne({
      _id: req.params.id,
    })
      .then((result) => {
        req.flash("message", "Exam deleted successfully")
        res.redirect("/exam-settings")
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
    res.redirect("/")
  }
}

module.exports = {
  loadExamInfo,
  setExamInfo,
  deleteExamInfo,
}
