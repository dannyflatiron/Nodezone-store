const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

const ObjectId = mongodb.ObjectId

class User {
  constructor(username, email, cart, id) {
    this.name = username
    this.email = email
    this.cart = cart
    this._id = id
  }

  save() {
    const db = getDb()
    let dbOp
    return db.collection('users').insertOne(this)
    .then(result => {
      console.log(result)
    })
    .catch(error => {
      console.log(error)
    })
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      // both values are originally objects since ids are stored in BSON object format in mongodb
      // needs to be converted to string values
      return cp.productId.toString() === product._id.toString()
    })
    let newQuantity = 1
    const updatedCartItems = [...this.cart.items]
    // if product in cart already exists then update quantity
    // else if product doesn't exist in cart then add product to cart items array
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1
      updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
      updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity })
    }

    const updatedCart = { items: updatedCartItems }
    const db = getDb()
    return db.collection('users').updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: updatedCart } }
    )
  }

  static findById(userId) {
    const db = getDb()
    return db.collection('users')
    .findOne({ _id: new ObjectId(userId) })
    .then(user => {
      return user
    })
    .catch(error => {
      console.log(error)
    })
  }
}

module.exports = User