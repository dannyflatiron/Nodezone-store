const product = require('../models/product')
const Product = require('../models/product')

exports.getAddProduct = (request, response, next) => {
    response.render('admin/edit-product', { 
      pageTitle: "Add Product", 
      path: '/admin/add-product',
      editing: false,
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
      if (product.userId.toString() !== request.user._id.toString()) {
        return response.redirect('/')
      }
      product.title = updatedTitle
      product.description = updatedDesc
      product.price = updatedPrice
      product.imageUrl = updatedImgUrl
      return product.save()
      .then(result => {
        console.log('UPDATED PRODUCT', result)
        response.redirect('/admin/products')
  
      })
    })

    .catch(error => {
      console.log(error)
    })
  }

  exports.getProducts = (request, response, next) => {
    // one layer of validation
    // only render products for admin product view that matches current user id
    Product.find({userId: request.user._id})
    .populate('userId')
      .then(products => {
        response.render('admin/products', { 
          prods: products, 
          pageTitle: 'Admin Products', 
          path: '/admin/products', 
            })
      })
      .catch(error => {
        console.log(error)
      })
  }

  exports.postDeleteProduct = (request, response, next) => {
    const prodId = request.body.productId
    // find product where the product id matches and where the user id matches
    Product.deleteOne({ _id: prodId, userId: request.user._id })
    .then(result => {
      response.redirect('/admin/products')
    })
    .catch(error => {
      console.log(error)
    })
  }