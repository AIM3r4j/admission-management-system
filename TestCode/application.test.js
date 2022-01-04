const applicationController = require("../MVC Structure/controllers/applicationController")

jest.mock("../MVC Structure/controllers/applicationController")

describe("Application Controller Test Suite", () => {
  describe("Application Registration", () => {
    it("should return the applied status as true", () => {
      req = {
        session: {
          role: "student",
          username: "student1",
        },
      }
      res = {}
      const expectedAppliedStatus = true

      const returnedAppliedStatus = applicationController.registerApplication(
        req,
        res
      )
      expect(returnedAppliedStatus).toEqual(expectedAppliedStatus)
    })
  })
})
