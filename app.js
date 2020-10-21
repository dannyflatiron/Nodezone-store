const http = require('http')
// file system core module
const fs = require('fs')

const server = http.createServer((request, response) => {
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
    fs.writeFileSync('message.txt', 'DUMMY')
    response.statusCode = 302
    response.setHeader('Location', '/')
    return response.end()
  }
  response.setHeader('Content-Type', 'text/html')
  response.write('<html>')
  response.write('<head><title>My First Page</title><head>')
  response.write('<body><h1>Hello from my Node.js Server!</h1></body>')
  response.write('</html>')
  response.end()
})

server.listen(3000)