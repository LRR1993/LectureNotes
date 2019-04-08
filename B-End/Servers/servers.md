# Servers

Servers are software on the internet
different protocals have a port number - not in use by something else

> REST API - representational state transfer

- use HTTP method, CRUD
- stateless - data is not held on the server
- use URLS to represent the resoruces
  - use of parameters
- repsond with JSON or XML
- idempotent - cache-able

> MVC Pattern - models views and controllers

- client (request from the server) -> server --> controller (interpret the request, and respond) ---> models (interact with data)
- controller (will get data) ---> client (will respond to client)
- controller <-> views (normally templates for the data)

```js
const http = require('http');
const fs = require('fs');

const server = http.createServer((request, reponse) => {
  if (request.url === '/') {
    sendGreeting(request, response);
  }
  if (request.url === '/api/') {
    if (request.method === 'GET') sendCats(request, response);
    if (request.method === 'POST') addCats(request, response);
  }
});

//// controllers //////
function sendGreeting(request, response) {
  resspose.setHeader('Content-Type', 'application/json');
  response.write(JSON.stringify({ msg: 'hi' }));
  respond.end();
}

function SendCats(request, response) {
  getCatData((err, cats) => {
    resspose.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ cats }));
    respond.end();
  });
}
function addCats(request, response) {
  getCatData((err, cats) => {
    let body = '';
    request.on('data', packet => {
      body += packet.toString();
    });
    request.on('end', () => {
      const catToAdd = JSON.parse(body);
      getCatData((err, cats) => {
        cats.push(catToAdd);
        writeCats(cats, err => {
          resspose.setHeader('Content-Type', 'application/json');
          response.write(JSON.stringify({ cats: catToAdd }));
          respond.end();
        });
      });
    });
  });
}

//// models ////
function getCatData(cb) {
  fs.readFile('data/cats.json', (err, fileContents) => {
    const cats = JSON.parse(fileContents);
    cb(null, cats);
  });
}

function writeCats(cats, cb) {
  fs.writefile('data/cats.json', JSON.stringify(cats, null, 2), err => {
    cb(null);
  });
}

server.listen(9090, err => {
  if (err) console.log(err);
  else console.log('server listening on port 9090...');
});
```

# Express

- install and require in, is a normal dependency.

- nodemon(node demon) (DEVdep) - allows server to continually run while making changes
- for post requests install body parser (middleware)

```js
const express = require('express')
const app = express()
//or
const app = require('express')()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.get('/',(req,res)=> {
  res.json({msg: 'Hello World'}) /* more explict (will be json stringify)*/
})

//server
app.get('/api/cats', sendAllCats);
app.get('/api/cats/:cat_id', sendCatById);

module.exports = app;

/// controller
exports.sendAllCats('/api/cats',(req,res)=> {
getCats((err,catData)=> {
  res.status(200).json({catData})
  })
})

exports.sendCatById('/api/cats',(req,res)=> {
  res.status(200).json({msg: `CatId:${req.paramas.cat_id}`}})

})
//models

exports.addNewCat = (req,res)=> {
  let newCat = JSON.stringfy(req.body)
  writeCats(newCat, (err,updatedCats)=>{
    if err console.log err
    else res.status(201).json({updatedCats}}
  })
}
//listen (separate file)
app.listen(9090, err => {
  if (err) console.log(err);
  else console.log('server listening on port 9090...');
});
```
