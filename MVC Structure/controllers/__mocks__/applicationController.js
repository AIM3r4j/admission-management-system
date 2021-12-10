const registerApplication = (req, res) => {
  try {
    if (req.session.role === "student") {
      const applied = true
      return applied
    } else {
      res.redirect("/")
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = {
  registerApplication,
}
