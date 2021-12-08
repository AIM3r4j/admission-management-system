const bcrypt = require("bcrypt")
const Credential = require("../models/credential")
const Student = require("../models/student")

const loadSignupForm = (req, res) => {
  if (req.session.authenticated === true) {
    res.redirect("/")
  } else {
    res.render("signup", { message: req.flash("message") })
  }
}
const signupUser = async (req, res) => {
  const { name, email, username, gpa, password, confirm_password } = req.body
  if (password === confirm_password) {
    const hashed = await bcrypt.hash(password, 10)
    const cred = new Credential({
      username: username,
      email: email,
      password: hashed,
    })
    const student = new Student({
      username: username,
      name: name,
      email: email,
      gpa: gpa,
    })
    await cred.save()
    await student.save()
    req.flash("message", ["success", "Signup Successful"])
    res.redirect("login")
  } else {
    req.flash("message", ["error", "Password Mismatch"])
    res.render("signup", { message: req.flash("message") })
  }
}

module.exports = {
  loadSignupForm,
  signupUser,
}
