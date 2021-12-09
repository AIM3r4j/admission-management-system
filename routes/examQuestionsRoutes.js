const router = require("express").Router()
const examQuestionsController = require("../MVC Structure/controllers/examQuestionsController")

router.get("", examQuestionsController.getQuestionsForm)
router.post("", examQuestionsController.setQuestions)
router.get("/finish", examQuestionsController.finishQuestionSetting)
router.get("/delete/:quesNo", examQuestionsController.deleteQuestion)

module.exports = router
