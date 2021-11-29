const router = require('express').Router()
const signupController = require('../controllers/signupController')

router.get('', signupController.loadSignupForm)
router.post('', signupController.signupUser)

module.exports = router