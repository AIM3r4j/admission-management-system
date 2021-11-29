const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect("/login")
    }
  })
}

module.exports = {
  logoutUser,
}
