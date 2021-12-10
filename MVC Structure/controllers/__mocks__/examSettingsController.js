const assignExaminer = (req, res) => {
  try {
    if (req.session.role === "admin") {
      const { username, email, password } = req.body
      const examiner = {
        username: username,
        email: email,
        password: password,
        role: "examiner",
      }
      return examiner
    } else {
      res.redirect("/")
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

const deleteExaminer = async (req, res) => {
  try {
    if (req.session.role === "admin") {
      const deletedExaminer = {
        username: "examiner1",
        email: "examiner1@gmail.com",
        password: "examiner1",
        role: "examiner",
      }
      return deletedExaminer
    } else {
      res.redirect("/")
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = {
  assignExaminer,
  deleteExaminer,
}
