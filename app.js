const path = require('path')
require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')

const app = express()

const sequelize = require('./util/database')

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)


app.use(errorController.get404Page)

// sync takes the models and create tables out of them
sequelize.sync().then(result => {
  // console.log(result)
})
.catch(error => {
  console.log(error)
})

app.listen(3000)