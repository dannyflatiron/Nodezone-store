const bcrypt = require('bcryptjs')
const User = require('../models/user')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')
const { validationResult } = require('express-validator/check')
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: `${process.env.SENDGRIDAPIKEY}`
  }
}))

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
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
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
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  })
}

exports.postLogin = (request, response, next) => {
  // redirects resets the request object therefore isLoggedIn is inherently undefined when it reaches the view
  const email = request.body.email
  const password = request.body.password
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    return response.status(422).render('auth/login', {
      path: '/login',
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: { 
        email: email, 
        password: password, 
      },
      validationErrors: errors.array()
    })
  }
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
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    return response.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: { 
        email: email, 
        password: password, 
        confirmPassword: confirmPassword 
      },
      validationErrors: errors.array()
    })
  }

     bcrypt
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
        return transporter.sendMail({
          to: email,
          from: 'takeheeddesigns@gmail.com',
          subject: 'Account Successfully Created!',
          html: '<h1>Your account has been successfully created!</h1>'
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

exports.getReset = (request, response, next) => {
  let message = request.flash('error')
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  response.render('auth/reset', {
    path: '/reset',
    pageTitle: "Reset Password",
    errorMessage: message
  })
}

exports.postReset = (request, response, next) => {
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      console.log(error)
      return response.redirect('/reset')
    }
    const token = buffer.toString('hex')
    User.findOne({email: request.body.email})
    .then(user => {
      if (!user) {
        request.flash('error', 'No account with that email found.')
        return response.redirect('/reset')
      }
      user.resetToken = token
      user.resetTokenExpiration = Date.now() + 3600000
      return user.save()
    })
    .then(result => {
      response.redirect('/')
      transporter.sendMail({
        to: request.body.email,
        from: 'takeheeddesigns@gmail.com',
        subject: 'Password Rest',
        html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
        `
      })
    })
    .catch(error => {
      console.log(error)
    })
  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
    });
};
