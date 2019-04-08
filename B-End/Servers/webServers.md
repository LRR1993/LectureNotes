# Web Servers

## Prior Knowledge

- The anatomy of a url : protocol, domain, path, queries
- The defintion of a parametric endpoint.
- Some basic status codes. (200 : ok, 201 : created, 404: not found, 500: internal server error)
- The different types of HTTP requests :
  _GET_, _POST_, _PUT/PATCH_ and _DELETE_
- How to make a http request with insomnia / browser.

## Learning Objectives

By the end of the sprint you should:

- Be able to create a server using the http module in node.
- Be able to identify and use the important properties of the request and response object.
- Understand how to assemble a body from packets of data sent over from the client side.
- Be able to identify and understand the different roles of Model and Controllers in the MVC pattern.

## Clients and Servers

A client is an application making a request for external data - typically a browser. A server is any program listening for requests on a computer port, that then processes these requests and sends responses accordingly. For web development purposes, both request and response will usually follow the `http` protocol.

- Any program that processes http requests and sends http responses accordingly.
- Listens for requests on a specified port

## Building a server from scratch

We can use the http library to build a server up from scratch.
Firstly, we need to create the actual server itself :

```js
const server = http.createServer();
```

The `createServer` method takes a single argument which is a request,response handler - a function that gets called everytime the server receives a request.

```js
const server = http.createServer((request, response) => {
  console.log(request);
});
```

At the moment though, our server is looking out for requests from the client side: we need to make ensure that our server is **listening** for requests.

```js
const server = http.createServer((request, response) => {
  console.log(request);
});

server.listen(9090);
```

The `listen` method takes as its argument the PORT number on which the server should be listening for client requests.

Now we can start to build up logic to send out a response

```js
const server = http.createServer((request, response) => {
  response.setHeader('Content-Type', 'application/json');
  response.statusCode = 200;
  response.write(JSON.stringify({ msg: 'hello world' }));
  response.end();
});

server.listen(9090);
```

We need to use `response.end()` otherwise the browser will still be hanging: the request won't have ended!

## REST APIs

- REST (Representational State Transfer) is an architectural style of designing APIs. It focuses on:
  - Correct use of HTTP CRUD methods
  - Being stateless (data not held on the server)
  - URLs clearly representing resources in our server (not actions)
  - Use of parameters
  - Idempotent GET requests: making the same request twice is the same as making it once. That's what enables caching.
  - Responses are Either JSON or XML format

## MVC Pattern

An architectural way of separating the concerns of our applications.

- Model: fundamental behaviour and data
- View: provides the interface of the application (HTML in our case)
- Controller: receives request and makes calls to the model and views to perform appropriate actions

Our server can extract these concerns into seperate controller and model functions based on the requested resource (url) and action (method).

Server

```js
const server = http.createServer((request, response) => {
  const { url, method } = request;

  if (url === '/') {
      // controllerToSendTheHomePage
  }
  if (url === '/api/resource') {
      if (method === 'GET') // controllerToSendTheResource
      if (method === 'POST') // controllerToAddToResource
  }
});
```

Controllers

```js
function sendResource(request, response) {
  modelToGetData((err, data) => {
    // respond with JSON object containing data
  });
}

function addResource(request, response) {
  let body = '';
  request.on('data', packet => {
    body += packet.toString();
  });
  request.on('end', () => {
    const resourceToAdd = JSON.parse(body);

    modelToAddData(resourceToAdd, (err, addedResource) => {
      // respond with JSON containing the created resource and status 201.
    });
  });
}
```

Models

```js
function getData(cb) {
  // interact with data source (async)
  // use cb to pass data back to the controller
}

function writeData(dataToAdd, cb) {
  // interact with data to create dataToAdd.
  // use cb to pass the created data back to the controller
}
```
