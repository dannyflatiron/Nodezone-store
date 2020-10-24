const Product = require('../models/product')


exports.getProducts = (request, response, next) => {
  Product.fetchAll(products => {
      response.render('shop/product-list', { 
        prods: products, 
        pageTitle: 'All Products', 
        path: '/products', 
      })
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