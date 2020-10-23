const products = []

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
    products.push({ title: request.body.title })
    response.redirect('/')
  }

  exports.getProducts = (request, response, next) => {
    response.render('shop', { 
      prods: products, 
      pageTitle: 'Shop', 
      path: '/', 
      hasProducts: products.length > 0,
      activeShop: true,
      productCss: true})
  }