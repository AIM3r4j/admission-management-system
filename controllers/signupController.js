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
const signupUser = (req, res) => {
  const { name, email, username, gpa, password, confirm_password } = req.body
  if (password === confirm_password) {
    bcrypt
      .hash(password, 10)
      .then((hashed) => {
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
        cred
          .save()
          .then(() => {
            student.save()
          })
          .then(() => {
            req.flash("message", ["success", "Signup Successful"])
            res.redirect("login")
          })
          .catch((err) => {
            console.log(err)
            req.flash("message", ["error", err])
            res.render("signup", { message: req.flash("message") })
          })
      })
      .catch((err) => {
        console.log(err)
        req.flash("message", ["error", err])
        res.render("signup", { message: req.flash("message") })
      })
  } else {
    req.flash("message", ["error", "Password Mismatch"])
    res.render("signup", { message: req.flash("message") })
  }
}

module.exports = {
  loadSignupForm,
  signupUser,
}
