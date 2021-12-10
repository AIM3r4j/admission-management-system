const confirmAdmission = (req, res) => {
  try {
    if (req.session.role === "student") {
      const student = {
        username: "student1",
        name: "Student1",
        email: "student1@gmail.com",
      }
      const preferredSubject = req.body.preferredSubject
      const newAdmission = {
        username: student.username,
        name: student.name,
        email: student.email,
        program: preferredSubject.toUpperCase(),
        studentID: 5000,
      }
      return newAdmission
    } else {
      res.redirect("/")
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = {
  confirmAdmission,
}
