const path = require('path')
require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')

const app = express()

const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use((request, response, next) => {
  User.findByPk(1)
  .then(user => {
    request.user = user
    next()
  })
  .catch(error => console.log(error))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)


app.use(errorController.get404Page)

// one to many relationship
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' }) // product belongs to user and if a user is deleted all user's products are deleted
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, { through: OrderItem })


// sync takes the models and create tables out of them
sequelize
  .sync({ force: true })
  // .sync()
  .then(result => {
    return User.findByPk(1)
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Danny', email: 'dannyflatiron@gmail.com' })
    }
    return user
  })
  .then(user => {
    return user.createCart()
  })
  .then(cart => {
    app.listen(3000)
  })
  .catch(error => {
    console.log(error)
  })

