const { request, response } = require("express");

module.exports = (request, response, next) => {
  if (!request.session.isLoggedIn) {
    return response.redirect('/login')
  }
  next()
}