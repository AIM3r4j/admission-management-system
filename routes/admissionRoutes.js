const router = require("express").Router()
const admissionController = require("../MVC Structure/controllers/admissionController")

router.get("", admissionController.loadAdmissionForm)
router.post("", admissionController.confirmAdmission)

module.exports = router
