const Student = require("../models/student")
const AdmittedStudent = require("../models/admittedStudent")

const loadAdmissionForm = async (req, res) => {
  if (req.session.role === "student") {
    const student = await Student.findOne({
      username: req.session.username,
    })
    if (student.result == true && student.admitted == true) {
      const admittedStudent = await AdmittedStudent.findOne({
        username: student.username,
      })
      res.render("admission", { admitted: true, profile: admittedStudent })
    } else if (student.result == true && student.admitted == false) {
      res.render("admission", { admitted: false })
    } else {
      res.render("unauthorized")
    }
  } else {
    res.redirect("/")
  }
}
const confirmAdmission = async (req, res) => {
  if (req.session.role === "student") {
    const student = await Student.findOne({
      username: req.session.username,
    })
    const preferredSubject = req.body.preferredSubject
    const newAdmission = new AdmittedStudent({
      username: student.username,
      name: student.name,
      email: student.email,
      program: preferredSubject.toUpperCase(),
      studentID: Math.random() * 10000,
    })
    await newAdmission.save()
    await Student.updateOne(
      {
        username: req.session.username,
      },
      {
        $set: {
          admitted: true,
        },
      }
    )
    res.redirect("/admission")
  } else {
    res.redirect("/")
  }
}

module.exports = {
  loadAdmissionForm,
  confirmAdmission,
}
