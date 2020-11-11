const path = require('path')
require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')

const errorController = require('./controllers/error')


const User = require('./models/user')

const MONGODB_URI = `mongodb+srv://dannyreina:${process.env.PASSWORD}@cluster0.vnxsz.mongodb.net/shop?retryWrites=true&w=majority`

const app = express()
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})
const csrfProtection = csrf({})

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({ secret: `${process.env.SESSION}`, resave: false, saveUninitialized: false, store: store }))
app.use(csrfProtection)

app.use((request, response, next) => {
  if (!request.session.user) {
    return next()
  }
  User.findById(request.session.user._id)
  .then(user => {
    request.user = user
    next()
  })
  .catch(error => console.log(error))
})

app.use((request, response, next) => {
  // locals only exist in views
  response.locals.isAuthenticated = request.session.isLoggedIn
  response.locals.csrfToken = request.csrfToken()
  next()
})

app.use('/admin', adminRoutes) // leading fitler
app.use(shopRoutes)
app.use(authRoutes)

app.use(errorController.get404Page)


mongoose.connect(MONGODB_URI)
.then(result => {
  
  app.listen(3000)
})
.catch(error => {
  console.log(error)
})