const User = require('../models/user')

exports.getLogin = (request, response, next) => {
  response.render('auth/login', {
    path: '/login',
    pageTitle: "Login",
    isAuthenticated: false
  })
}

exports.getSignup = (request, response, next) => {
  response.render('auth/signup', {
    path: '/signup',
    pageTitle: "Signup",
    isAuthenticated: false
  })
}

exports.postLogin = (request, response, next) => {
  // redirects resets the request object therefore isLoggedIn is inherently undefined when it reaches the view
    User.findById("5fa9e0a49214c4d76e7cf96d")
    .then(user => {
      request.session.isLoggedIn = true
      request.session.user = user
      request.session.save(error => {
        console.log(error)
        response.redirect('/')
      })
    })
    .catch(error => console.log(error))
  // response.setHeader('Set-Cookie', 'loggedIn=true')
}

exports.postSignup = (requset, response, next) => {

}

exports.postLogout = (request, response, next) => {
  request.session.destroy(error => {
    console.log(error)
    response.redirect('/')
  })
}