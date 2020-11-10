const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [ { productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, quantity: { type: Number, required: true } } ]
  }
})

userSchema.methods.addToCart = function(product) {
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
      updatedCartItems.push({ productId: product._id, quantity: newQuantity })
    }

    const updatedCart = { items: updatedCartItems }
    this.cart = updatedCart
    return this.save()
}

userSchema.methods.removeFromCart = function(productId) {
      const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString()
    })
    this.cart.items = updatedCartItems
    return this.save()
}

module.exports = mongoose.model('User', userSchema)


// const mongodb = require('mongodb')
// const getDb = require('../util/database').getDb

// const ObjectId = mongodb.ObjectId

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username
//     this.email = email
//     this.cart = cart
//     this._id = id
//   }

//   save() {
//     const db = getDb()
//     let dbOp
//     return db.collection('users').insertOne(this)
//     .then(result => {
//       console.log(result)
//     })
//     .catch(error => {
//       console.log(error)
//     })
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       // both values are originally objects since ids are stored in BSON object format in mongodb
//       // needs to be converted to string values
//       return cp.productId.toString() === product._id.toString()
//     })
//     let newQuantity = 1
//     const updatedCartItems = [...this.cart.items]
//     // if product in cart already exists then update quantity
//     // else if product doesn't exist in cart then add product to cart items array
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1
//       updatedCartItems[cartProductIndex].quantity = newQuantity
//     } else {
//       updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity })
//     }

//     const updatedCart = { items: updatedCartItems }
//     const db = getDb()
//     return db.collection('users').updateOne(
//       { _id: new ObjectId(this._id) },
//       { $set: { cart: updatedCart } }
//     )
//   }

//   getCart() {
//     // add logic to check if product that exists in cart was deleted from products collection
//     // possible approaches would be to check if product exists if not then clear cart of that product or just clear cart entirely
//     const db = getDb()
//     const productIds = this.cart.items.map(i => {
//       return i.productId
//     })
//     return db.collection('products')
//     // find all product ids
//     .find({ _id: {$in: productIds} })
//     .toArray()
//     .then(products => {
//       return products.map(p => {
//         // have to get quantity of product in cart
//         // copy all products 
//         // return product quantity
//         return {...p, quantity: this.cart.items.find(i => {
//           return i.productId.toString() === p._id.toString()
//         }).quantity}
//       })
//     })
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== productId.toString()
//     })
//     const db = getDb()
//     return db.collection('users').updateOne(
//       { _id: new ObjectId(this._id) },
//       { $set: { cart: {items: updatedCartItems} } }
//     )
//   }

//   addOrder() {
//     const db = getDb()
//     return this.getCart()
//     .then(products => {
//       // create order
//       const order = {
//         items: this.cart.items,
//         // add user to order
//         user: {
//           _id: new ObjectId(this._id),
//           name: this.name,
//         }
//       }
//       return db.collection('orders')
//       // create order in orders collection in db
//       .insertOne(order)
//     })
//     .then(result => {
//       // if creating order succeeds, empty cart
//       this.cart = { items: [] }
//       return db.collection('users')
//       .updateOne(
//         // empty cart items after order is created
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: {items: [] } } }
//       )
//     })
//   }

//   getOrders() {
//     const db = getDb()
//     return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray()
//   }

//   static findById(userId) {
//     const db = getDb()
//     return db.collection('users')
//     .findOne({ _id: new ObjectId(userId) })
//     .then(user => {
//       return user
//     })
//     .catch(error => {
//       console.log(error)
//     })
//   }
// }

// module.exports = User