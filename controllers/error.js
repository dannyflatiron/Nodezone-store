exports.get404Page = (request, response, next) => {
    response.status(404).render('404', 
    { pageTitle: 'Page Not Found', path: '/404',
    isAuthenticated: request.session.isLoggedIn })
  }

  exports.get500Page = (request, response, next) => {
    response.status(500).render('500', 
    { pageTitle: 'Error', path: '/500',
    isAuthenticated: request.session.isLoggedIn })
  }