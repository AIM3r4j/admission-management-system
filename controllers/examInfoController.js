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
    examInfo
      .save()
      .then(() => {
        req.flash("success", "Exam details saved!")
        res.redirect("exam-settings")
      })
      .then(() => {
        console.log(
          "Exam start scheduled at",
          startSchedule.toLocaleString("en-US", dateOptions)
        )
        scheduler.scheduleJob(startSchedule, () => {
          ExamInfo.updateOne(
            {
              name: req.body.name,
            },
            {
              $set: {
                status: "started",
              },
            }
          ).then(() => {
            console.log(
              "Exam started at",
              new Date().toLocaleString("en-US", dateOptions)
            )
          })
        })
      })
      .then(() => {
        console.log(
          "Exam end scheduled at",
          endSchedule.toLocaleString("en-US", dateOptions)
        )
        const job2 = scheduler.scheduleJob(endSchedule, () => {
          ExamInfo.updateOne(
            {
              name: req.body.name,
            },
            {
              $set: {
                status: "ended",
              },
            }
          )
            .then(() => {
              console.log(
                "Exam ended at",
                new Date().toLocaleString("en-US", dateOptions)
              )
            })
            .then(async () => {
              console.log(
                "Evaluation started at",
                new Date().toLocaleString("en-US", dateOptions)
              )
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
