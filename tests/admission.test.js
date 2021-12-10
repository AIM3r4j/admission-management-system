const admissionController = require("../MVC Structure/controllers/admissionController")

jest.mock("../MVC Structure/controllers/admissionController")

describe("Admission Controller Test Suite", () => {
  describe("Admission Confirmation", () => {
    it("should return the newly admitted student", () => {
      req = {
        session: {
          role: "student",
          username: "student1",
        },
        body: {
          preferredSubject: "cse",
        },
      }
      res = {}
      const expectedAdmission = {
        username: "student1",
        name: "Student1",
        email: "student1@gmail.com",
        program: "CSE",
        studentID: 5000,
      }

      const newAdmission = admissionController.confirmAdmission(req, res)
      expect(newAdmission).toEqual(expectedAdmission)
    })
  })
})
