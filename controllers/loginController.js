const bcrypt = require("bcrypt")
const Credential = require("../models/credential")

const loadLoginForm = (req, res) => {
  if (req.session.authenticated === true) {
    res.redirect("/")
  } else {
    res.render("login", { message: req.flash("message") })
  }
}
const loginUser = async (req, res) => {
  try {
    const uname_email = req.body.uname_email
    const password = req.body.password
    const user = await Credential.findOne({
      $or: [{ username: uname_email }, { email: uname_email }],
    })
    if (!user) {
      req.flash("message", ["error", "Invalid User"])
      res.render("login", { message: req.flash("message") })
    } else {
      const matched = await bcrypt.compare(password, user.password)
      if (matched) {
        req.session.authenticated = true
        req.session.username = user.username
        req.session.role = user.role
        res.redirect("/dashboard")
        console.log(
          "\nUser Login: Logged in as " +
            user.username +
            " at " +
            new Date() +
            "\n"
        )
      } else {
        req.flash("message", ["error", "Incorrect Password"])
        res.render("login", { message: req.flash("message") })
      }
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = {
  loadLoginForm,
  loginUser,
}
