const express = require('express')
const User = require('../models/user')
const { check, body } = require('express-validator/check')

const authController = require('../controllers/auth')

const router = express.Router()

router.get('/login', authController.getLogin)

router.get('/signup', authController.getSignup)

router.post('/login', 
body('email')
  .isEmail()
  .withMessage('Please enter a valid email')
  .normalizeEmail(),
body('password', 'Incorrect password, please try again or reset your password')
.isLength({ min: 5 })
.trim(),
authController.postLogin)

router.post('/signup', 
// check for presence of email
body('email')
  .isEmail()
  .withMessage('Please enter a valid email')
  .normalizeEmail()
  .custom((value, { req }) => {
  // check if email already exists in database
return User.findOne({email: value})
  .then(userDoc => {
    if (userDoc) {
      return Promise.reject('Email already exists, please pick a different one')
    }
  })
}),
// check for password value in the body of the post request
body('password', 'Please enter a password with at least 5 characters')
  .isLength({min: 5})
  .trim(),
// check if confirmed password field matches password field
body('confirmPassword')
.trim()
.custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Passwords have to match!')
  } 
  return true
})
, authController.postSignup)

router.post('/logout', authController.postLogout)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router