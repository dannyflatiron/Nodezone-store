const path = require('path')

const express = require('express')

const rootDir = require('../utilities/path')

const router = express.Router()

const products = []

router.get('/add-product', (request, response, next) => {
  response.sendFile(path.join(rootDir, 'views', 'add-product.html'))
})

router.post('/add-product', (request, response, next) => {
  products.push({ title: request.body.title })
  response.redirect('/')
})

exports.routes = router
exports.products = products