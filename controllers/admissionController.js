const Student = require("../models/student")
const AdmittedStudent = require("../models/admittedStudent")

const loadAdmissionForm = (req, res) => {
  if (req.session.role === "student") {
    Student.findOne({
      username: req.session.username,
    }).then((student) => {
      if (student.result == true && student.admitted == true) {
        AdmittedStudent.findOne({
          username: student.username,
        }).then((admittedStudent) => {
          res.render("admission", { admitted: true, profile: admittedStudent })
        })
      } else if (student.result == true && student.admitted == false) {
        res.render("admission", { admitted: false })
      } else {
        res.render("unauthorized")
      }
    })
  } else {
    res.redirect("/")
  }
}
const confirmAdmission = (req, res) => {
  if (req.session.role === "student") {
    Student.findOne({
      username: req.session.username,
    })
      .then((student) => {
        const preferredSubject = req.body.preferredSubject
        const newAdmission = new AdmittedStudent({
          username: student.username,
          name: student.name,
          email: student.email,
          program: preferredSubject.toUpperCase(),
          studentID: Date.now(),
        })
        newAdmission.save()
      })
      .then(() => {
        Student.updateOne(
          {
            username: req.session.username,
          },
          {
            $set: {
              admitted: true,
            },
          }
        ).then(() => {
          res.redirect("/admission")
        })
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
    res.redirect("/")
  }
}

module.exports = {
  loadAdmissionForm,
  confirmAdmission,
}
