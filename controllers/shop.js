const fs = require('fs')
const path = require('path')
const Product = require('../models/product')
const Order = require('../models/order')
const PDFDocument = require('pdfkit')
const product = require('../models/product')
const ITEMS_PER_PAGE = 1


exports.getProducts = (request, response, next) => {
  const page = +request.query.page || 1
  let totalItems

  Product.find().countDocuments().then(numProducts => {
    totalItems = numProducts
    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)  
    .limit(ITEMS_PER_PAGE)
  })
  .then(products => {
    response.render('shop/product-list', { 
      prods: products, 
      pageTitle: 'Products', 
      path: '/products',
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    })
  })
  .catch(err => {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
}

exports.getProduct = (request, response, next) => {
  const prodId = request.params.productId
  Product.findById(prodId)
  .then(product => {
    response.render('shop/product-detail', { 
      product: product, 
      pageTitle: product.title, 
      path: '/products'
    })
  })
  .catch(err => {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
}

exports.getIndex = (request, response, next) => {
  const page = +request.query.page || 1
  let totalItems

  Product.find().countDocuments().then(numProducts => {
    totalItems = numProducts
    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)  
    .limit(ITEMS_PER_PAGE)
  })
  .then(products => {
    response.render('shop/index', { 
      prods: products, 
      pageTitle: 'Shop', 
      path: '/',
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    })
  })
  .catch(err => {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
}

exports.getCart = (request, response, next) => {
  request.user.populate('cart.items.productId').execPopulate()
  .then(user => {
    const products = user.cart.items
    response.render('shop/cart', {
      path: '/cart',
      pageTitle: "Your Cart",
      products: products
    })
  })
  .catch(err => {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
  
}

exports.postCart = (request, response, next) => {
  const prodId = request.body.productId
  Product.findById(prodId)
  .then(product => {
    return request.user.addToCart(product)
  })
  .then(result => {
    console.log(result)
    response.redirect('/cart')
  })
  .catch(err => {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
}

exports.postCartDeleteProduct = (request, response, next) => {
  const prodId = request.body.productId
  request.user.removeFromCart(prodId)
  .then(result => {
    response.redirect('/cart')
  })
  .catch(err => {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
}

// removed getCheckout()

exports.getCheckout = (request, response, next) => {
  request.user.populate('cart.items.productId').execPopulate()
  .then(user => {
    const products = user.cart.items
    let productPrice
    let productQuantity
    products.forEach(p => {
      console.log("quantity", p.quantity)
      productPrice = p.productId.price
      productQuantity = p.quantity
    })
    
    response.render('shop/checkout', {
      path: '/checkout',
      pageTitle: "Checkout",
      products: products,
      totalSum: productPrice * productQuantity,
    })
  })
  .catch(err => {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
}

exports.postOrder = (request, response, next) => {
  request.user.populate('cart.items.productId').execPopulate()
  .then(user => {
    const products = user.cart.items.map(i => {
      // mongoose provides _doc to grab all the meta data from an object
      return {quantity: i.quantity, product: { ...i.productId._doc }}
    })
    const order = new Order({
      user: {
        email: request.user.email,
        userId: request.user
      },
      products: products
    })
    return order.save()
  })
  .then(result => {
    return request.user.clearCart()
  })
  .then(result => {
    response.redirect('/orders')
  })
  .catch(err => {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
}

exports.getOrders = (request, response, next) => {
  Order.find({ 'user.userId': request.user._id })
  .then(orders => {
    response.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    })
  })
  .catch(err => {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
}

exports.getInvoice = (request, response, next) => {
  const orderId = request.params.orderId
  Order.findById(orderId).then(order => {
    if (!order) {
      return next(new Error('No order found.'))
    }
    if (order.user.userId.toString() !== request.user._id.toString()) {
      return next(new Error('Unauthorized'))
    }
  const invoiceName = 'invoice-' + orderId + '.pdf'
  const invoicePath = path.join('data', 'invoices', invoiceName)

  const pdfDoc = new PDFDocument()
  response.setHeader('Content-Type', 'application/pdf')
  response.setHeader('Content-Dsiposition', 'inline; filename="' + invoiceName + '"')
  pdfDoc.pipe(fs.createWriteStream(invoicePath))
  pdfDoc.pipe(response)

  pdfDoc.fontSize(26).text('Invoice', {
    underline: true
  })
  pdfDoc.text('-----------------------')
  let totalPrice = 0
  order.products.forEach(prod => {
    totalPrice += prod.quantity * prod.product.price
    pdfDoc.fontSize(14).text(prod.product.title + ' - ' + prod.quantity + ' x ' + '$' + prod.product.price)
  })
  pdfDoc.text('-----------------------')
  pdfDoc.fontSize(20).text('Total Price: $' + totalPrice)

  pdfDoc.end()

  }).catch(err => next(err))
}