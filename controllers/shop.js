const Product = require('../models/product')
const Cart = require('../models/cart')


exports.getProducts = (request, response, next) => {
  Product.fetchAll(products => {
      response.render('shop/product-list', { 
        prods: products, 
        pageTitle: 'All Products', 
        path: '/products', 
      })
    })
}

exports.getProduct = (request, response, next) => {
  const prodId = request.params.productId
  Product.findById(prodId, product => {
    response.render('shop/product-detail', { product: product, pageTitle: product.title, path: '/products' })
  })
}

exports.getIndex = (request, response, next) => {
  Product.fetchAll(products => {
    response.render('shop/index', { 
      prods: products, 
      pageTitle: 'Shop', 
      path: '/', 
      hasProducts: products.length > 0,
      activeShop: true,
      productCss: true})
  })
}

exports.getCart = (request, response, next) => {
  response.render('shop/cart', {
    path: '/cart',
    pageTitle: "Your Cart"
  })
}

exports.postCart = (request, response, next) => {
  const prodId = request.body.productId
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price)
  })
  response.redirect('/cart')
}

exports.getCheckout = (request, response, next) => {
  response.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  })
}

exports.getOrders = (request, response, next) => {
  response.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  })
}
