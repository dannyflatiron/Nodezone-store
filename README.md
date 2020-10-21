# starting-NodeJS-server

10/21/20

-NodeJS is a javascript runtime. It is mostly used to create a server but it can also be used as a separate javascript "engine"

-NodeJS server runs as an event loop meaning it runs forever

-how to handle requests from the server and read data from the requests through available methods and variables such as 'request.url', 'request.headers' etc

-learned how to set response headers with 'response.setHeader(). An error will show up if 'response.write()' is used after 'response.end()'

-how to setup a route with 'const url = request.url