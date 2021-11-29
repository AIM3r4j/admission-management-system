const bcrypt = require("bcrypt")

const Credential = require("../models/credential")
const ExamInfo = require("../models/examInfo")

const getExamSettings = (req, res) => {
  if (req.session.role === "admin") {
    ExamInfo.findOne().then((examinfo) => {
      if (examinfo == {}) {
        Credential.find({ role: "examiner" }).then((examiners) => {
          res.render("examSettings", {
            examInfo: null,
            examiners: examiners,
            feedback: req.flash("success"),
          })
        })
      } else {
        Credential.find({ role: "examiner" }).then((examiners) => {
          res.render("examSettings", {
            examInfo: examinfo,
            examiners: examiners,
            feedback: req.flash("success"),
          })
        })
      }
    })
  } else {
    res.redirect("/")
  }
}

const assignExaminer = async (req, res) => {
  if (req.session.role === "admin") {
    const { username, email, password } = req.body
    const hashed = await bcrypt.hash(password, 10)
    const examiner = new Credential({
      username: username,
      email: email,
      password: hashed,
      role: "examiner",
    })
    examiner
      .save()
      .then(() => {
        req.flash("success", "Examiner Assigned Successfully!")
        res.redirect("/exam-settings")
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
    res.redirect("/")
  }
}

const deleteExaminer = (req, res) => {
  if (req.session.role === "admin") {
    Credential.deleteOne({
      username: req.params.username,
    })
      .then((result) => {
        req.flash("message", "Examiner removed successfully")
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
  getExamSettings,
  assignExaminer,
  deleteExaminer,
}
