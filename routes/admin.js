const path = require('path')

const express = require('express')

const rootDir = require('../utilities/path')

const router = express.Router()

router.get('/add-product', (request, response, next) => {
  response.sendFile(path.join(rootDir, 'views', 'add-product.html'))
})

router.post('/add-product', (request, response, next) => {
  console.log(request.body)
  response.redirect('/')
})

module.exports = router