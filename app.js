const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))

app.use('/add-product', (request, response, next) => {
  response.send('<h1>The "Add Product" Page</h1><form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>')
})

app.post('/product', (request, response, next) => {
  console.log(request.body)
  response.redirect('/')
})

app.use('/', (request, response, next) => {
  response.send('<h1>Hello from Express!</h1>')
})


app.listen(3000)