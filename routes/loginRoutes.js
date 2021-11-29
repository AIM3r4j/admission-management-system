const router = require('express').Router()
const loginController = require('../controllers/loginController')

router.get('', loginController.loadLoginForm)
router.post('', loginController.loginUser)

module.exports = router