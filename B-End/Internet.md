# How the Internet Works

## Prior Knowledge

- Network requests are a source of asynchronicity.
- We can wait for asynchronous processes to complete by passing a callback function.

## Learning Objectives

- Sending data over the internet has a client server relationship.
- This takes the form of a request and response.
- Requests are made to a url using a CRUD method.
- Requests and responses can have a body that contains information to send. This is a string that is sent in packets.
- Javascript values must be stringified to be sent and parsed once received.

## Background

The **internet** is a network of computers connected by wires and routers. The **World Wide Web** is the collection of documents available, and served by the internet.

Every connection to the internet has its own IP address which allows it to be located in the same way a postal address does for a house. Most computers have a program called `ping` available in the terminal that send a message to an IP address and informs the user when it receives a response:

```bash
ping 216.58.206.100
```

IP addresses can also be used in browsers to _request_ data from the same connected computer. However, IP addresses aren't very memorable or human friendly, so in place of these strings of numbers, servers use the **DNS**, or **D**omain **N**ame **S**ystem. This manages the assignment of more familiar web addresses to IP addresses. This code is effectively equivalent to the ping above:

```bash
ping www.google.com
```

Your computer/device also has a MAC address. This is a unique identified for the device, which is important because a single IP address can be shared by multiple devices on the same network.

### Requests and Responses

In the above example, we are the _client_ making a request for data; Google is the _server_ responding with the data.
There are different **protocols** for requesting or sharing information across the internet. Web developers primarily deal with `HTTP` (_hypertext transfer protocol_) and their more _secure_ counterpart, `HTTPS`. These protocols are concerned with the transfer of text, characterised as a request and response, which is suitable for transferring most types of information across the internet.

Requests are often separated into four different types, often given the name **CRUD operations**:

- **C**reate a resource
- **R**ead a resource
- **U**pdate a resource
- **D**elete a resource
  These are generic names, but `HTTP` formalises these approaches as **methods**:

- `GET` - used when asking for something back
- `POST` - used for adding something to a database. These requests have **bodies** which hold the bulk of the request and the text that we want to send
- `PATCH` / `PUT` - used to partially update something in a database
- `DELETE` - used to remove a resource

By default, when entering a url, a browser will make a `GET` request.

However, all information over the internet is transmitted in plain text. So what is happening here? We're receiving a plaintext website, with HTML, CSS and JS, and our browser is building it into something useful.

Using a tool called **INSOMNIA** - which we're going to need to make all manner of requests - we can have a look at this plaintext how it is transmitted.

### APIs

Websites will often create an **API**, or Application Programming Interface, to allow them to populate their pages with data by making `HTTP` requests. Many organisations make their APIs freely, publicly available. This may be to encourage people to interact with their data and build services around it.

As the data sent by these APIs is essentially text, there are conventions for formatting the string so they can be easily interpreted by clients. Probably the most popular one currently is `JSON`, or **J**ava**S**cript **O**bject **N**otation. `JSON` is a string representation of a javascript value.
JavaScript provides a `JSON.stringify` function that turns a JavaScript object into a correctly formatted `JSON` object, and a `JSON.parse` function that interprets a JSON string and creates a new JavaScript object from the data:

```js
const me = { name: 'paul' };
const stringifiedMe = JSON.stringify(me); // '{"name":"paul"}' (String)
const objectMe = JSON.parse(stringifiedMe); // { name : 'paul' } (Object)
```

Most other programming languages have similar functions to parse and construct JSON - the format is 'inspired' by JavaScript, but otherwise isn't tied to a particular language - it's just a string.

### URLs

**URLs**, or **u**niform **r**esource **l**ocators, combine the DNS-provided web addressed with other information that the server and browser use to determine what should be requested, responded with, and displayed on the page. Using `https://api.github.com/search/repos?page=2` as an example:
| **Element** | **Details** |
| --- | --- |
| `https://` | protocol - how the data should be requested and responded to |
| `api` | conventionally informs user of the type of server, but nothing formal about this |
| `github` | DNS provided address name, usually identifying the owner of the data |
| `.com` | the top level domain, in this case owned by the DNS. Countries have their own extension (i.e. `.co.uk`) |
| `/search/repos` | the _path_, or route used by the server to get the precise document or information requested - also known as an _endpoint_ |
| `?page=2` | a _query_ (see below) |

#### Queries

Any information following a `?` in the url will be treated as a query. Multiple queries are seperated by the `&` symbol:

`https://itunes.apple.com/search?term=beyonce&limit=5`

Queries are added on to the end of an existing route. They do not change the path, just add additional conditions. They providing actions (such as filtering and ordering) that the server should conduct on the data before responding with it. Invalid queries are generally ignored (unlike invalid _paths_, which will return an error).

### Status Codes

All HTTP responses are transmitted with status codes.

There are the following ranges:

- 100s - these are informational
- 200s - these are STATUS OKAY
- 300s - these are redirects
- 400s - these are client errors - the user has attempted to interact with the server incorrectly
- 500s - these are server errors - the server is down, or it might indicate a failing in the server code.

### HTTPS in Node

Node has in-built `http` and `https` modules - there is no need to install these independently.

```js
const https = require('https');
function getTracks() {
  const options = {
    hostname: 'itunes.apple.com',
    path: '/search?term=beyonce&limit=5',
    method: 'GET'
  };
  // setup a new request object with the options above
  const request = https.request(options, response => {
    // callback invoked with a response object
  });
  // call the end method to actually send the request once setup
  request.end();
}
getTracks();
```

Information transmitted in request or response bodies (such as `JSON`) does not arrive already constructed, but in small **packets** of data, a few bytes each. In the above example, as the client, the packets need reconstructing into the response body before it can be worked with. Node's `request` triggers a `data` event whenever a new packet is received, which we can define a callback function for:

```js
function getTracks() {
  const options = {
    hostname: 'itunes.apple.com',
    path: '/search?term=beyonce&limit=5',
    method: 'GET'
  };
  const request = https.request(options, response => {
    console.log(`response status:`, response.statusCode);
    // declare a body variable to build the response from the packets
    let body = '';
    // use response's on method to run a callback every time a packet is received
    response.on('data', packet => {
      body += packet.toString();
    });
  });
  request.end();
}
getTracks();
```

Once we have all the packets the on method can be used to run a callback by passing 'end' as our event:

```js
function getTracks() {
  const options = {
    hostname: 'itunes.apple.com',
    path: '/search?term=beyonce&limit=5',
    method: 'GET'
  };
  const request = https.request(options, response => {
    console.log(`response status:`, response.statusCode);
    let body = '';
    response.on('data', packet => {
      body += packet.toString();
    });
    response.on('end', () => {
      // parse the JSON string back into an object, ready to be used..
      const parsedBody = JSON.parse(body);
      // do something with the body of the response
    });
  });
  request.end();
}
getTracks();
```

## Resources

- more information on how the internet works: https://www.youtube.com/watch?v=Dxcc6ycZ73M&list=PLzdnOPI1iJNfMRZm5DDxco3UdsFegvuB7
