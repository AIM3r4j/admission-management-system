const router = require("express").Router()
const examController = require("../controllers/examController")

router.get("", examController.loadExam)
router.get("/end", examController.confirmEnd)
router.post("/end", examController.endExam)
router.post("/start", examController.startExam)
router.post("/submit", examController.submitAnswer)

module.exports = router
