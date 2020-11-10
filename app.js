const path = require('path')
require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')

const errorController = require('./controllers/error')


const User = require('./models/user')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({secret: `${process.env.SESSION}`, resave: false, saveUninitialized: false}))

app.use((request, response, next) => {
  User.findById("5fa9e0a49214c4d76e7cf96d")
  .then(user => {
    request.user = user
    next()
  })
  .catch(error => console.log(error))
})

app.use('/admin', adminRoutes) // leading fitler
app.use(shopRoutes)
app.use(authRoutes)

app.use(errorController.get404Page)


mongoose.connect(`mongodb+srv://dannyreina:${process.env.PASSWORD}@cluster0.vnxsz.mongodb.net/shop?retryWrites=true&w=majority`)
.then(result => {
  User.findOne().then(user => {
    if (!user) {
      const user = new User({
        name: 'Danny',
        email: "danny@test.com",
        cart: {
          items: []
        }
      })
      user.save()
    }
  })
  app.listen(3000)
})
.catch(error => {
  console.log(error)
})