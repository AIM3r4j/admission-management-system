const loadDashboard = (req, res) => {
  res.render("dashboard", { role: req.session.role })
}

module.exports = {
  loadDashboard,
}
