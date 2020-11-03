const path = require('path')
require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')

const mongoConnect = require('./util/database').mongoConnect

const User = require('./models/user')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use((request, response, next) => {
  User.findById("5f9e4f090a68196662973ad8")
  .then(user => {
    request.user = new User(user.name, user.email, user.cart, user._id)
    next()
  })
  .catch(error => console.log(error))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)


app.use(errorController.get404Page)


mongoConnect(() => {
  
  app.listen(3000)
})