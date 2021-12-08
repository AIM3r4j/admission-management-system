const bcrypt = require("bcrypt")

const Credential = require("../models/credential")
const ExamInfo = require("../models/examInfo")

const getExamSettings = async (req, res) => {
  if (req.session.role === "admin") {
    const examinfo = await ExamInfo.findOne()
    if (examinfo == {}) {
      const examiners = await Credential.find({ role: "examiner" })
      res.render("examSettings", {
        examInfo: null,
        examiners: examiners,
        feedback: req.flash("success"),
      })
    } else {
      const examiners = await Credential.find({ role: "examiner" })
      res.render("examSettings", {
        examInfo: examinfo,
        examiners: examiners,
        feedback: req.flash("success"),
      })
    }
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
    await examiner.save()
    req.flash("success", "Examiner Assigned Successfully!")
    res.redirect("/exam-settings")
  } else {
    res.redirect("/")
  }
}

const deleteExaminer = async (req, res) => {
  if (req.session.role === "admin") {
    await Credential.deleteOne({
      username: req.params.username,
    })
    req.flash("message", "Examiner removed successfully")
    res.redirect("/exam-settings")
  } else {
    res.redirect("/")
  }
}

module.exports = {
  getExamSettings,
  assignExaminer,
  deleteExaminer,
}
