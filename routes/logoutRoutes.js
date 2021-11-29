const router = require("express").Router()
const logoutController = require("../controllers/logoutController")

router.post("", logoutController.logoutUser)

module.exports = router
