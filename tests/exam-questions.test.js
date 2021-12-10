const examQuestionsController = require("../MVC Structure/controllers/examQuestionsController")

jest.mock("../MVC Structure/controllers/examQuestionsController")

describe("Exam Questions Controller Test Suite", () => {
  describe("Set Exam Question", () => {
    it("should return the newly added question", () => {
      req = {
        session: {
          role: "examiner",
        },
        body: {
          quesNo: 1,
          questionText: "Question Text?",
          option1: "Option 1",
          option2: "Option 2",
          option3: "Option 3",
          option4: "Option 4",
          correctOption: "4",
          mark: 5,
        },
      }
      res = {}
      const expectedQuestion = {
        quesNo: 1,
        questionText: "Question Text?",
        option1: "Option 1",
        option2: "Option 2",
        option3: "Option 3",
        option4: "Option 4",
        correctAnswer: "Option 4",
        mark: 5,
      }

      const returnedQuestion = examQuestionsController.setQuestions(req, res)
      expect(returnedQuestion).toEqual(expectedQuestion)
    })
  })
})
