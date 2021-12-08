const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err)
    } else {
      res.redirect("/login")
    }
  })
}

module.exports = {
  logoutUser,
}
