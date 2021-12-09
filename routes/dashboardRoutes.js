const router = require("express").Router()
const dashboardController = require("../MVC Structure/controllers/dashboardController")

router.get("", dashboardController.loadDashboard)

module.exports = router
