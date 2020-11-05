const Product = require('../models/product')

exports.getAddProduct = (request, response, next) => {
    response.render('admin/edit-product', { 
      pageTitle: "Add Product", 
      path: '/admin/add-product',
      editing: false
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
      imageUrl: imageUrl
    })
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
        product: product
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
    const product = new Product(
      updatedTitle,  
      updatedPrice, 
      updatedDesc, 
      updatedImgUrl, 
      prodId)
    product.save()
    .then(result => {
      console.log('UPDATED PRODUCT', result)
      response.redirect('/admin/products')

    })
    .catch(error => {
      console.log(error)
    })
  }

  exports.getProducts = (request, response, next) => {
    Product.fetchAll()
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
    Product.deleteById(prodId)
    .then(result => {
      response.redirect('/admin/products')
    })
    .catch(error => {
      console.log(error)
    })
  }