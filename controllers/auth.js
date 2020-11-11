const bcrypt = require('bcryptjs')
const User = require('../models/user')

exports.getLogin = (request, response, next) => {
  let message = request.flash('error')
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  response.render('auth/login', {
    path: '/login',
    pageTitle: "Login",
    errorMessage: message
  })
}

exports.getSignup = (request, response, next) => {
  let message = request.flash('error')
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }

  response.render('auth/signup', {
    path: '/signup',
    pageTitle: "Signup",
    errorMessage: message
  })
}

exports.postLogin = (request, response, next) => {
  // redirects resets the request object therefore isLoggedIn is inherently undefined when it reaches the view
  const email = request.body.email
  const password = request.body.password
    User.findOne({email: email})
    .then(user => {
      if (!user) {
        request.flash('error', 'Invalid email or password')
        return response.redirect('/login')
      }
      bcrypt.compare(password, user.password)
      .then(passwordsDoMatch => {
        if (passwordsDoMatch) {
          request.session.isLoggedIn = true
          request.session.user = user
          return request.session.save(error => {
            console.log(error)
            response.redirect('/')
          })
        }
        request.flash('error', 'Invalid email or password')
        response.redirect('/login')
      })
      .catch(error => {
        console.log(error)
        response.redirect('/login')
      })

    })
    .catch(error => console.log(error))
  // response.setHeader('Set-Cookie', 'loggedIn=true')
}

exports.postSignup = (request, response, next) => {
  const email = request.body.email
  const password = request.body.password
  const confirmPassword = request.body.confirmPassword
  User.findOne({email: email})
  .then(userDoc => {
    if (userDoc) {
      request.flash('error', 'Email already taken. Please pick a different one')
      return response.redirect('/signup')
    }
    return bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] }
        })
        return user.save()
      })
      .then(result => {
        response.redirect('/login')
      })
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