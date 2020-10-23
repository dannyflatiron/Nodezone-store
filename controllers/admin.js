const Product = require('../models/product')

exports.getAddProduct = (request, response, next) => {
    response.render('admin/add-product', 
    { 
      pageTitle: "Add Product", 
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true
    })
  }

  exports.postAddProduct = (request, response, next) => {
    const product = new Product(request.body.title)
    product.save()
    response.redirect('/')
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