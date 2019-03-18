# How the internet works

DNS - routers - packets

- domain names .org,.com,.net,.co.uk - owned and controlled by bigger oganisatons (google etc), rent from companies to get one.

- CRUD (create, read, update, delete) - most used
  - Create : post request
  - Read: get request
  - Update: put/patch data
  - Delete: delete

Insomnia - app that does CRUD

API - application programming interface (normally in package JSON (dataType))

Errors - status

- 1xx (Informational): The request was received, continuing process
- 2xx (Successful): The request was successfully received, understood, and accepted
- 3xx (Redirection): Further action needs to be taken in order to complete the request
- 4xx (Client Error): The request contains bad syntax or cannot be fulfilled
- 5xx (Server Error): The server failed to fulfill an apparently valid request

```js
//http request

function getTracks(){

const options = {
  hostname: itunes.apple.com
  path: '/search?term=beyonce&limit=1'
  method: 'GET'
}

const request = http.request(options, reponse => {
  let body = '';

  response.on('data', packet => {
    body += packet.toString();
  });

response.on('end', () => {
  const parsedBody = JSON.parse(body);
});

request.on('error', err => {
  console.error(`problem with request: ${e.request}`);
});

request.end()
});
}
```
