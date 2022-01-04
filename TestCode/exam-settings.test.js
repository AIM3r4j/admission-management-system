const examSettingsController = require("../MVC Structure/controllers/examSettingsController")

jest.mock("../MVC Structure/controllers/examSettingsController")

describe("Exam Settings Controller Test Suite", () => {
  describe("Assign Examiner", () => {
    it("should return the newly assigned examiner", () => {
      req = {
        session: {
          role: "admin",
        },
        body: {
          username: "examiner1",
          email: "examiner1@gmail.com",
          password: "examiner1",
        },
      }
      res = {}
      const expectedResult = {
        username: "examiner1",
        email: "examiner1@gmail.com",
        password: "examiner1",
        role: "examiner",
      }

      const returnedResult = examSettingsController.assignExaminer(req, res)
      expect(returnedResult).toEqual(expectedResult)
    })
  })
  describe("Remove Examiner", () => {
    it("should return the removed examiner", () => {
      req = {
        session: {
          role: "admin",
        },
        body: {
          username: "examiner1",
          email: "examiner1@gmail.com",
          password: "examiner1",
        },
      }
      res = {}
      const expectedResult = {
        username: "examiner1",
        email: "examiner1@gmail.com",
        password: "examiner1",
        role: "examiner",
      }

      const returnedResult = examSettingsController.assignExaminer(req, res)
      expect(returnedResult).toEqual(expectedResult)
    })
  })
})
