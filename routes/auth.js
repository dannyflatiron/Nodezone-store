const express = require('express')
const { check, body } = require('express-validator/check')

const authController = require('../controllers/auth')

const router = express.Router()

router.get('/login', authController.getLogin)

router.get('/signup', authController.getSignup)

router.post('/login', authController.postLogin)

router.post('/signup', 
// check for presence of email
check('email')
.isEmail()
.withMessage('Please enter a valid email'),
// check for password value in the body of the post request
body('password', 'Please enter a password with only numbers and text and at least 5 characters')
.isLength({min: 5})
, authController.postSignup)

router.post('/logout', authController.postLogout)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router