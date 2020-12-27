const path = require('path')
require('dotenv').config()
const fs = require('fs')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const aws = require('aws-sdk')

const errorController = require('./controllers/error')


const User = require('./models/user')

const MONGODB_URI = `mongodb+srv://dannyreina:${process.env.PASSWORD}@cluster0.vnxsz.mongodb.net/shop?retryWrites=true&w=majority`

const app = express()
app.use(express.static('./public'));
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})
const csrfProtection = csrf({})

const fileStorage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, 'images')
  },
  filename: (request, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname)
  }
})

const fileFilter = (request, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(helmet())

// used to alter headers set by helmet to allow inline scripts
// fixed by adding event listener in admin.js
// app.use(helmet.referrerPolicy({
//   policy: ["origin", "unsafe-url"],
// })
// )

app.use(compression())
app.use(morgan('combined', {stream: accessLogStream}))

// bodyParser encodes all text into urlencoded data for all incoming requests
app.use(bodyParser.urlencoded({extended: false}))
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(session({ secret: `${process.env.SESSION}`, resave: false, saveUninitialized: false, store: store }))
app.use(csrfProtection)
app.use(flash())

app.use((request, response, next) => {
  // locals only exist in views
  response.locals.isAuthenticated = request.session.isLoggedIn
  response.locals.csrfToken = request.csrfToken()
  next()
})

app.use((request, response, next) => {
  if (!request.session.user) {
    return next()
  }
  User.findById(request.session.user._id)
  .then(user => {
    if (!user) {
      return next()
    }
    request.user = user
    next()
  })
  .catch(error => {
    // next has to be used in order to send the error to the error middleware
    next(new Error(error)) 
  })
})



app.use('/admin', adminRoutes) // leading fitler
app.use(shopRoutes)
app.use(authRoutes)

app.get('/500', errorController.get500Page)

// app.use(errorController.get404Page)

// error middleware
app.use((error, request, response, next) => {
  response.status(500).render('500', { 
    pageTitle: 'Error', 
    path: '/500',
    isAuthenticated: request.session.isLoggedIn 
  })
})
const S3_BUCKET = process.env.S3_BUCKET
aws.config.region = 'us-east-1'

mongoose.connect(MONGODB_URI)
.then(result => {
  
  app.listen(process.env.PORT || 3000)
})
.catch(error => {
  console.log(error)
})