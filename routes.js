const fs = require('fs')


const requestHandler = (request, response) => {
const url = request.url
const method = request.method
if (url === '/') {
  response.write('<html>')
  response.write('<head><title>My First Page</title><head>')
  response.write('<body><form action="/message" method="POST"><input name="message" type="text"><button type="submit">Send</button></input></form></body>')
  response.write('</html>')
  return response.end()
}

// how to redirect
if (url === '/message' && method === 'POST') {
  const body = []
  // how to parse data
  request.on('data', (chunk) => {
    console.log(chunk)
    body.push(chunk)
  })
  return request.on('end', () => {
    const parsedBody = Buffer.concat(body).toString()
    const message = parsedBody.split('=')[1]
    // creates a file called message.txt that has the contents of message
    fs.writeFile('message.txt', message, (err) => {
      response.statusCode = 302
      response.setHeader('Location', '/')
      return response.end()
    })
  })
}
response.setHeader('Content-Type', 'text/html')
response.write('<html>')
response.write('<head><title>My First Page</title><head>')
response.write('<body><h1>Hello from my Node.js Server!</h1></body>')
response.write('</html>')
response.end()
}

module.exports = {
  handler: requestHandler,
  someText: 'Some hard coded text'
}