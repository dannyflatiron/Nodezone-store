exports.getLogin = (request, response, next) => {
  response.render('auth/login', {
    path: '/login',
    pageTitle: "Login",
  })
}

exports.postLogin = (request, response, next) => {
  request.isLoggedIn = true
  response.redirect('/')
}