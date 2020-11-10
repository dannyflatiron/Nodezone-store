const Product = require('../models/product')
const Order = require('../models/order')

exports.getProducts = (request, response, next) => {
  Product.find()
  .then(products => {
    response.render('shop/product-list', { 
      prods: products, 
      pageTitle: 'All Products', 
      path: '/products', 
    })
  })
  .catch(error => {
    console.log('error in shop controller getProducts', error)
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
  .catch(error => {
    console.log('error in shop controller getProduct', error)
  })
}

exports.getIndex = (request, response, next) => {
  Product.find()
  .then(products => {
    response.render('shop/index', { 
      prods: products, 
      pageTitle: 'Shop', 
      path: '/', 
    })
  })
  .catch(error => {
    console.log('error in shop controller getIndex', error)
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
  .catch(error => console.log(error))
  
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
  .catch(error => {
    console.log(error)
  })
  // let fetchedCart
  // let newQuantitty = 1
  // request.user.getCart()
  // .then(cart => {
  //   fetchedCart = cart
  //   return cart.getProducts({ where: { id: prodId }})
  // })
  // // updates quantity of product in cart if product already exists in cart
  // .then(products => {
  //   let product
  //   if (products.length > 0) {
  //     product = products[0]
  //   }
    
  //   if (product) {
  //     const oldQuantity = product.cartItem.quantity
  //     newQuantitty = oldQuantity + 1
  //     return product
  //   }
  //   return Product.findByPk(prodId)
  // })
  // // adds a new product to cart 
  // .then(product => {
  //   return fetchedCart.addProduct(product, 
  //     { through: { quantity: newQuantitty } })
  // })
  // .catch(error => console.log(error))
  // .then(() => {
  //   response.redirect('/cart')
  // })
  // .catch(error => console.log(error))
}

exports.postCartDeleteProduct = (request, response, next) => {
  const prodId = request.body.productId
  request.user.removeFromCart(prodId)
  .then(result => {
    response.redirect('/cart')
  })
  .catch(error => console.log(error))
}

// removed getCheckout()

exports.postOrder = (request, response, next) => {
  request.user.populate('cart.items.productId').execPopulate()
  .then(user => {
    const products = user.cart.items.map(i => {
      // mongoose provides _doc to grab all the meta data from an object
      return {quantity: i.quantity, product: { ...i.productId._doc }}
    })
    const order = new Order({
      user: {
        name: request.user.name,
        userId: request.user
      },
      products: products
    })
    return order.save()
  })
  .then(result => {
    response.redirect('/orders')
  })
  .catch(error => console.log(error))
}

exports.getOrders = (request, response, next) => {
  // eager loading
  // fetch all orders and fetch all products per order
  // each order will now have a products array
  // request.user.getOrders()
  // .then(orders => {
  //   response.render('shop/orders', {
  //     path: '/orders',
  //     pageTitle: 'Your Orders',
  //     orders: orders
  //   })
  // })
  // .catch(errors => console.log(error))
}
