const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Product', productSchema)


// const mongodb = require('mongodb')
// const getDb = require('../util/database').getDb

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     console.log("new product", userId)
//     this.title = title
//     this.price = price
//     this.description = description
//     this.imageUrl = imageUrl
//     this._id = id ? new mongodb.ObjectId(id) : null,
//     this.userId = userId
//   }

//   save() {
//     const db = getDb()
//     let dbOp
//     if (this._id) {
//       // update just one record
//       dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this})
//       // how to update specific fields
//       // dbOp = db.collection('products').updateOne({_id: new mongodb.ObjectId(this.id)}, {$set: {title: this.title, price: this.price }})
//     } else {
//       dbOp = db.collection('products').insertOne(this)
//     }
//     return dbOp
//     .then(result => {
//       console.log(result)
//     })
//     .catch(error => {
//       console.log(error)
//     })
//   }

//   static fetchAll() {
//     const db = getDb()
//     return db.collection('products')
//     .find()
//     .toArray()
//     .then(products => {
//       return products
//     })
//     .catch(error => {
//       console.log(error)
//     })
//   }

//   static findById(prodId) {
//     const db = getDb()
//     return db.collection('products')
//     // mongdo stores id in ObjectId types
//     .find({_id: new mongodb.ObjectId(prodId)})
//     .next()
//     .then(product => {
//       return product
//     })
//     .catch(error => {
//       console.log(error)
//     })
//   }

//   static deleteById(prodId) {
//     const db = getDb()
//     return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)})
//     .then(result => {
//       console.log("Deleted")
//     })
//     .catch(error => {
//       console.log(error)
//     })
//   }


// }

// module.exports = Product
