exports.getLogin = (request, response, next) => {
  response.render('auth/login', {
    path: '/login',
    pageTitle: "Login",
    isAuthenticated: request.isLoggedIn
  })
}

exports.postLogin = (request, response, next) => {
  request.isLoggedIn = true
  response.redirect('/')
}