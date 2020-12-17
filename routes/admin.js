const path = require('path')

const express = require('express')
const { body } = require('express-validator/check')

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.get('/add-product', isAuth, adminController.getAddProduct)

router.get('/products', isAuth, adminController.getProducts)

router.post('/add-product', 
body('title')
  .isString()
  .isLength({ min: 3 })
  .trim()
  .withMessage('Please enter a title minimum 3 characters'),
// body('image')
//   .withMessage('Please enter a valid URL'),
body('price')
  .isFloat()
  .withMessage('Please use appropriate format. Ex: 12.99'),
body('description')
  .isLength({ min: 5, max: 400 })
  .trim()
  .withMessage('Minimum characters needed: 5, maximum characters allowed: 400'),
isAuth, 
adminController.postAddProduct)

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

router.post('/edit-product', 
body('title')
  .isString()
  .isLength({ min: 3 })
  .trim()
  .withMessage('Please enter a title minimum 3 characters'),
body('price')
  .isFloat()
  .withMessage('Please use appropriate format. Ex: 12.99'),
body('description')
  .isLength({ min: 5, max: 400 })
  .trim()
  .withMessage('Minimum characters needed: 5, maximum characters allowed: 400'),
isAuth, adminController.postEditProduct)

router.delete('/product/:productId', isAuth, adminController.deleteProduct)

module.exports = router