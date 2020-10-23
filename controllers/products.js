const Product = require('../models/product')

exports.getAddProduct = (request, response, next) => {
    response.render('add-product', 
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
    const products = Product.fetchAll()
    response.render('shop', { 
      prods: products, 
      pageTitle: 'Shop', 
      path: '/', 
      hasProducts: products.length > 0,
      activeShop: true,
      productCss: true})
  }