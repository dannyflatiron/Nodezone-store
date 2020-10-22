const express = require('express')

const router = express.Router()

router.get('/add-product', (request, response, next) => {
  response.send('<h1>The "Add Product" Page</h1><form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>')
})

router.post('/add-product', (request, response, next) => {
  console.log(request.body)
  response.redirect('/')
})

module.exports = router

// app.use('/add-product', (request, response, next) => {
//   response.send('<h1>The "Add Product" Page</h1><form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>')
// })

// app.post('/product', (request, response, next) => {
//   console.log(request.body)
//   response.redirect('/')
// })