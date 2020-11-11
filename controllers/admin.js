const product = require('../models/product')
const Product = require('../models/product')

exports.getAddProduct = (request, response, next) => {
    response.render('admin/edit-product', { 
      pageTitle: "Add Product", 
      path: '/admin/add-product',
      editing: false,
      isAuthenticated: request.session.isLoggedIn
    })
  }

  exports.postAddProduct = (request, response, next) => {
    const title = request.body.title
    const imageUrl = request.body.imageUrl
    const price = request.body.price
    const description = request.body.description
    const product = new Product({ 
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: request.user
    })
    // save method is coming from mongoose 
    // it does not need to be created
    // mongoose is an Object Relational Document framework just as ActiveRecord
    product.save()
    .then(result => {
      response.redirect('/admin/products')
    })
    .catch(error => {
      console.log(error)
    })
  }

  exports.getEditProduct = (request, response, next) => {
    const editMode = request.query.edit
    if(!editMode) {
      return response.redirect('/')
    }
    const prodId = request.params.productId
    Product.findById(prodId)
    .then(product => {
      if(!product) {
        return response.redirect('/')
      }
      response.render('admin/edit-product', { 
        pageTitle: "Edit Product", 
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        isAuthenticated: request.session.isLoggedIn
      })
    })
    .catch(error => {
      console.log(error)
    })
  }

  exports.postEditProduct = (request, response, next) => {
    const prodId = request.body.productId
    const updatedTitle = request.body.title
    const updatedPrice = request.body.price
    const updatedDesc = request.body.description
    const updatedImgUrl = request.body.imageUrl
    Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle
      product.description = updatedDesc
      product.price = updatedPrice
      product.imageUrl = updatedImgUrl
      return product.save()
    })
    .then(result => {
      console.log('UPDATED PRODUCT', result)
      response.redirect('/admin/products')

    })
    .catch(error => {
      console.log(error)
    })
  }

  exports.getProducts = (request, response, next) => {
    Product.find()
    // 
    .populate('userId')
      .then(products => {
        response.render('admin/products', { 
          prods: products, 
          pageTitle: 'Admin Products', 
          path: '/admin/products', 
          isAuthenticated: request.session.isLoggedIn
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  exports.postDeleteProduct = (request, response, next) => {
    const prodId = request.body.productId
    Product.findByIdAndRemove(prodId)
    .then(result => {
      response.redirect('/admin/products')
    })
    .catch(error => {
      console.log(error)
    })
  }