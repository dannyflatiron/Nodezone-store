const fs = require('fs')
const path = require('path')
const p = path.join(
  path.dirname(require.main.filename), 
  'data', 
  'cart.json'
  )

module.exports = class Cart {
  // Fetch the previous cart
  static addProduct(id, productPrice) {
    fs.readFile(p, (error, fileContent) => {
      let cart = { products: [], totalPrice: 0 }
      if (!error) {
        cart = JSON.parse(fileContent)
      }
      console.log(cart)
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id )
      const existingProduct = cart.products[existingProductIndex]
      let updatedProduct
      // Add new product / increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct }
        updatedProduct.qty = updatedProduct.qty +1
        cart.products = [...cart.products]
        cart.products[existingProductIndex] = updatedProduct
      } else {
        updatedProduct = { id: id, qty: 1 }
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice = cart.totalPrice + +productPrice
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err)
      })
    })
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (error, fileContent) => {
      if (error) {
        return
      }
      const updatedCart = { ...JSON.parse(fileContent) }
      const product = updatedCart.products.find(product => product.id ===id)
      if (!product) {
        return
      }
      const productQty = product.qty
      updatedCart.products = updatedCart.products.filter( product => product.id !== product)
      console.log("before product deleted", updatedCart.totalPrice)
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty
      console.log("after product deleted", updatedCart.totalPrice)
      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
      })
    })
  }
}
