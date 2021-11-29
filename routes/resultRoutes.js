const router = require("express").Router()
const resultController = require("../controllers/resultController")

router.get("", resultController.loadResult)
router.post("/generate", resultController.generateResult)
router.post("/publish", resultController.publishResult)

module.exports = router
