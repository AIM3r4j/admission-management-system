const router = require("express").Router()
const applicationController = require("../MVC Structure/controllers/applicationController")

router.get("/", applicationController.checkEligibility)
router.post("/", applicationController.registerApplication)

module.exports = router
