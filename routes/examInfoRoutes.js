const router = require("express").Router()
const examInfoController = require("../controllers/examInfoController")

router.get("/", examInfoController.loadExamInfo)
router.post("/", examInfoController.setExamInfo)
router.get("/delete/:id", examInfoController.deleteExamInfo)

module.exports = router
