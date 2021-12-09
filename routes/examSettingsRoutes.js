const router = require("express").Router()
const examSettingsController = require("../MVC Structure/controllers/examSettingsController")

router.get("", examSettingsController.getExamSettings)
router.post("", examSettingsController.assignExaminer)
router.get("/delete/:username", examSettingsController.deleteExaminer)

module.exports = router
