const http = require('http')

const express = require('express')

const app = express()

app.use((request, response, next) => {
  next()
})

app.use((request, response, next) => {
  response.send('')
})

app.listen(3000)