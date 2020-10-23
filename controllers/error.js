exports.get404Page = (request, response, next) => {
    response.status(404).render('404', { pageTitle: 'Page Not Found', path: '' })
  }