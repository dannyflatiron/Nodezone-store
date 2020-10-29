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

    const product = new Product(null, title, imageUrl, description, price)
    product.save()
    .then(() => {
      response.redirect('/')
    })
    .catch(error => console.log('error in creating a product', error))
  }

  exports.getEditProduct = (request, response, next) => {
    const editMode = request.query.edit
    if(!editMode) {
      return response.redirect('/')
    }
    const prodId = request.params.productId
    Product.findById(prodId, product => {
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
  }

  exports.postEditProduct = (request, response, next) => {
    const prodId = request.body.productId
    const updatedTitle = request.body.title
    const updatedPrice = request.body.price
    const updatedDesc = request.body.description
    const updatedImgUrl = request.body.imageUrl
    updatedProduct = new Product(prodId, updatedTitle, updatedImgUrl, updatedDesc, updatedPrice)
    updatedProduct.save()
    response.redirect('/admin/products')
  }

  exports.getProducts = (request, response, next) => {
    Product.fetchAll(products => {
        response.render('admin/products', { 
          prods: products, 
          pageTitle: 'Admin Products', 
          path: '/admin/products', 
        })
      })
  }

  exports.postDeleteProduct = (request, response, next) => {
    const prodId = request.body.productId
    Product.deleteById(prodId)
    response.redirect('/admin/products')
  }