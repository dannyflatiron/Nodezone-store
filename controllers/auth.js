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
  const email = requset.body.email
  const password = requset.body.password
  const confirmPassword = requset.body.confirmPassword
  User.findOne({email: email})
  .then(userDoc => {
    if (userDoc) {
      return response.redireect('/signup')
    }
    const user = new User({
      email: email,
      password: password,
      cart: { items: [] }
    })
    return user.save()
  })
  .then(result => {
    response.redirect('/login')
  })
  .catch(error => {
    console.log(error)
  })
}

exports.postLogout = (request, response, next) => {
  request.session.destroy(error => {
    console.log(error)
    response.redirect('/')
  })
}