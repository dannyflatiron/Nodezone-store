const Product = require('../models/product')
// const Cart = require('../models/cart')

exports.getProducts = (request, response, next) => {
  Product.fetchAll()
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
  Product.fetchAll()
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
  request.user.getCart()
  .then(products => {
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
  request.user.getCart()
  .then(cart => {
    return cart.getProducts({ where: { id: prodId } })
  })
  .then(products => {
    const product = products[0]
    return product.cartItem.destroy()
  })
  .then(result => {
    response.redirect('/cart')
  })
  .catch(error => console.log(error))
}

// removed getCheckout()

exports.postOrder = (request, response, next) => {
  let fetchedCart
  request.user.getCart()
  .then(cart => {
    fetchedCart = cart
    return cart.getProducts()
  })
  .then(products => {
    return request.user.createOrder()
    .then(order => {
      return order.addProducts(
        products.map(product => {
          product.orderItem = { quantity: product.cartItem.quantity }
          return product
        })
      )
    })
    .catch(error => console.log(error))
  })
  .then(result => {
    return fetchedCart.setProducts(null)
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
  request.user.getOrders({include: ['products']})
  .then(orders => {
    response.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    })
  })
  .catch(errors => console.log(error))
}
