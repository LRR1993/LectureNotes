# `node-postgres` & `supertest`

## Prior knowledge

- understanding of the MVC pattern
- creating an express server with sub routers
- basic SQL statements and queries
- understanding of how JavaScript promises work
- able to access the results of promises with .then() and .catch() methods

## Learning Objectives

- ability to use basic query methods from the [node-postrgres](https://node-postgres.com/features/queries) library to query an sql database using an express server.
- Understand how to use [supertest](https://www.npmjs.com/package/supertest) to test end-points

## 1. node-postgres

> "node-postgres is a collection of node.js modules for interfacing with your PostgreSQL database."

[@briancarlson, node-postgres creator](https://twitter.com/briancarlson)

## 2. Connection setup

Run `npm install pg` to install `node-postgres`

The `node-postrgres` connection can be configured within a `db` directory, along side the sql seeding script for the database that is to be connected to.

```
 └── node_modules/
 └── db/
 │  ├──── index.js <-- node-postrgres connection setup
 │  ├──── config.js <-- database info (port/host/database name/username/password)
 │  └──── seed.sql
 ├── .gitignore
 ├── package-lock.json
 └── package.json
```

### Connecting with a single Client

A connection to a psql database is made by creating a new instance of the node-postgres `Client` class with the `host`, `database` and `port` to connect to.

The config object should be stored in a separate file and git-ignored, as if not using MacOS a `username` and `password` for PostrgreSQL will also be required.

```js
// db/config.js
const dbConfig = {
  host: 'localhost',
  database: 'database_name',
  port: 5432
  // username: SECRET_PSQL_USERNAME
  // password: SECRET_PSQL_PASSWORD
};

// db/index.js
const { Client } = require('pg');
const dbConfig = require('./config.js');

const client = new Client(dbConfig);

client
  .connect()
  .then(() =>
    console.log(`connected to ${dbConfig.database} on PORT ${dbConfig.port}`)
  )
  .catch(err => console.log('connection error:', err));

module.exports = client;
```

### Queries

The api for executing queries supports both callbacks and promises.

Below is an example using promises:

```js
client
  .query('SELECT * FROM table_name;')
  .then(result => console.log(result))
  .catch(err => console.log(err));
```

The [results object](https://node-postgres.com/api/result) that is returned by `node-postgres` for a successful query has a key of `rows` which is an array of the records that have been returned by the query in the form of a json-like object for each row.

### Connection Pooling

Connecting a new client to a PostgreSQL server can take 20-30 milliseconds. During this time passwords are negotiated, SSL may be established, and configuration information is shared between the client and the server. Incurring this cost every time an application wants to execute a query would substantially slow it down.

When working with web applications, or other software that makes frequent queries to a database, connection pools can be used.

A client pool allows the app to have a reusable pool of clients that can be checked-out, used, and returned. Generally an app will want a limited number of these (usually just 1), as creating an unbounded number of pools defeats the purpose of pooling at all.

[Connection pooling](https://node-postgres.com/api/pool) with `node-postgres` follows a similar syntax to connecting with a single client, and uses the same queries api, but has some additional [config options and methods](https://node-postgres.com/api/pool).

When there is only a single query that needs to be run on the database, the pool has a method to run a query on the first available idle client and return its result using [pool.query()](https://node-postgres.com/api/pool#pool-query-gt-promise-pg-result-).

## 3. Using `node-postgres` with `express` example

### GET example

#### Express app setup

Install `express`.

Setup `app.js`, and `api.js` and `houses.js` routers, and `houses.js` controllers:

```js
// app.js
const express = require('express');
const app = express();
const apiRouter = require('./routes/api.js');

app.use('/api', apiRouter);

module.exports = app;

// routes/api.js
const apiRouter = require('express').Router();
const housesRouter = require('./houses.js');

apiRouter.use('/houses', housesRouter);

module.exports = apiRouter;

// routes/houses.js
const housesRouter = require('express').Router();
const { sendHouses } = require('../controllers/houses.js');

housesRouter.route('/').get(sendHouses);

module.exports = housesRouter;

// controllers/houses.js
exports.sendHouses = (req, res, next) => {
  res.status(200).send('GET all houses route OK.');
};
```

#### Accessing and sending data from the database

Each controller should be responsible for invoking a model that will provide data in the format that is to be sent to the client.

As such, it is the model function that will need to use the `client` that is exported from `db/index.js` to query the database.

```js
// models/houses.js
const db = require('../db/index.js');

exports.selectHouses = () => {
  return db.query('SELECT * FROM houses;').then(result => result.rows);
};
```

The model function must `return` the query so that the result can be accessed in the `.then()` block when the model is invoked in the controller function.

By returning `result.rows` from the query, the data is sent to the controller function as an array, ready to be sent to the client. Making the controller function extremely succinct.

```js
// controllers/houses.js
const { selectHouses } = require('../models/houses.js');

exports.sendHouses = (req, res, next) => {
  selectHouses()
    .then(houses => res.status(200).send({ houses }))
    .catch(next);
};
```

```
 ├─── node_modules/
 ├─── controllers/
 │  └──── houses.js
 ├─── db/
 │  ├──── index.js <-- node-postrgres connection configuration
 │  ├──── config.js <-- database info (port/host/database name/username/password)
 │  └──── seed.sql
 ├── models/
 ├── routes/
 │  └──── api.js
 │  └──── houses.js
 ├── app.js
 ├── index.js
 ├── .gitignore
 ├── package-lock.json
 └── package.json
```

#### Testing endpoints using `supertest`

> **"Tests must ALWAYS be written first"** - _most good back-end developers, ever_

`supertest` should be installed as a _dev-dependency_ (`npm i -D supertest`), as it is only used for testing, and will not be required for production code - i.e. when the api server is hosted.

`supertest` should be required in at the top of the relevant `spec` file as `request`, along with the express `app` that is being tested.

To make a test request to the app, the `request` variable (supertest) is passed the `app` as an argument within the mocha `it` block - if the server is not already listening for connections then it is bound to a temporary port, so there is no need to keep track of ports.

The HTTP method is then chained on to `request` and invoked with the relevant `path`. E.g:

```js
request(app).get('/api/houses');
```

`supertest` then has some built in assertions than can be chained on to the request to check the response's HTTP `status` code, as well as any header `field`s and `value`s. E.g:

```js
request(app)
  .get('/api/houses')
  .expect(200)
  .expect('Content-Type', 'application/json');
```

The above returns a promise, which allows the chaining of `.then()` to access the response from the server. And within this `.then()` block, additional assertions can be made using `chai` as to what we `expect` the body of the response to contain:

```js
request(app)
  .get('/api/houses')
  .expect(200)
  .then(res => {
    expect(res.body.houses).to.have.length(4);
  });
```

**The request must be returned** inside the `it` block's callback function in order for the assertions to be run and the mocha tests to correctly pass/fail.

Without returning the request, the mocha test would **always** appear to pass.

```js
// spec/app.spec.js
const { expect } = require('chai');
const request = require('supertest');
const app = require('../app');

describe('/api', () => {
  describe('/houses', () => {
    it('GET returns status 200 & houses object containing an array of the houses', () => {
      return request(app)
        .get('/api/houses')
        .expect(200)
        .then(({ body: { houses } }) => {
          expect(houses).to.have.length(4);
          expect(houses[0]).to.eql({
            house_id: 1,
            house_name: 'Gryffindor',
            founder: 'Godric Gryffindor',
            animal: 'Lion'
          });
        });
    });
  });
});
```

## 4. `node-postgres` parameterized query examples

### GET by ID example

For a request to `GET` a specific house from the database, the test and endpoint could be set up as follows:

#### Test, Route and Controller Setup

```js
// spec/app.spec.js
// ...
describe('/api/houses/:house_id', () => {
  it('GET returns status 200 and requested house object', () => {
    return request(app)
      .get('/api/houses/1')
      .expect(200)
      .then(({ body: { house } }) => {
        expect(house).to.eql({
          house_id: 1,
          house_name: 'Gryffindor',
          founder: 'Godric Gryffindor',
          animal: 'Lion'
        });
      });
  });
});
// ...

// routes/houses.js
housesRouter.route('/:house_id').get(sendHouseById);

// controllers/houses.js
exports.sendHouseById = (req, res, next) => {
  const { house_id } = req.params;
  selectHouseById(house_id)
    .then(house => res.status(200).send({ house }))
    .catch(next);
};
```

#### Model Setup

For an endpoint that uses values from the request object, such as `params`, `query` or `body`, **string concatenation and string template literals should NOT be used.**

This can (and often does) lead to _**sql injection**_ vulnerabilities. This means that external code, written by the client, could be run on the database server, potentially giving access to read, write and modify sensitive data (e.g. passwords, email addresses, personal data, etc.)

The model function in this case would then need to use the `house_id` parameter in the SQL query,.

Without having to use a template literal, or string concatenation, the query method accepts a second argument of an array of values.

The indexes of the array can then be accessed in the raw sql query by using `$1`, `$2`, `$3`, etc... depending on the variables position in the array.

```js
// models/houses.js
exports.selectHouseById = house_id => {
  return db
    .query('SELECT * FROM houses WHERE house_id = $1;', [house_id])
    .then(({ rows: [house] }) => house);
};
```

The above query returns an array containing a single object for the returned row.

The resulting row should be destructured before being returned to the controller. This is because the model in the MVC framework should be responsible for both fetching and formatting the data ready for the controller to send to the client.

### POST example

For a request to `POST` a new house to the database, the test and endpoint could be set up as follows.

#### Test Setup

_**Note that `.send()` is chained onto the test request and invoked with the body to be sent**_

```js
// spec/app.spec.js
// ...
it('POST returns a status 201 and a house object containing the new house', () => {
  return request(app)
    .post('/api/houses')
    .send({
      house_name: 'House of Mitch',
      founder: 'Mitch',
      animal: 'Squirrel'
    })
    .expect(201)
    .then(res => {
      expect(res.body.house).to.eql({
        house_id: 5,
        house_name: 'House of Mitch',
        founder: 'Mitch',
        animal: 'Squirrel'
      });
    });
});
// ...
```

#### Route Setup

`.route()` can be used to chain the `.post()` method onto the existing route for `/api/houses`

```js
// routes/houses.js
housesRouter
  .route('/')
  .get(sendHouses)
  .post(addHouse);
```

#### Controller Setup

The controller is then responsible for passing the request body to the model, and sending the newly inserted house to the client.

```js
// controllers/houses.js
exports.addHouse = (req, res, next) => {
  insertHouse(req.body)
    .then(house => res.status(201).send({ house }))
    .catch(next);
};
```

#### Model Setup

Within the model, the key values for the data that is being inserted can be destructured from the body that has been sent, and passed into the array that `.query()` accepts as its second argument.

`"...RETURNING *;"` must be added to the end of the `"INSERT INTO..."` SQL statement in order for the newly inserted row to be returned by the query.

```js
// model/houses.js
exports.insertHouse = newHouse => {
  const { house_name, founder, animal } = newHouse;
  return db
    .query(
      'INSERT INTO houses (house_name, founder, animal) VALUES ($1, $2, $3) RETURNING *;',
      [house_name, founder, animal]
    )
    .then(({ rows: [house] }) => house);
};
```

_**Test inconsistencies**_

If the tests include any requests to delete, modify or create new records in the database, the next time the tests are run, they may incorrectly fail.

Therefore, it is necessary to have a separate `test` database that is re-seeded before the tests are run each time.

## 5. Separate Test Database Configuration

A test database should use the exact same schema as the development or production database, but will usually have less data. This helps with writing tests, the time that it takes to run the tests and preventing any changes from using a tool like Insomnia in development, or production changes from affecting the test results.

In order to use a separate database for testing, firstly the seed file must be created, with a different database name (`database_name_test`) and filename (`see.test.sql`).

```
 ├─── node_modules/
 ├─── controllers/
 │  └──── houses.js
 ├─── db/
 │  ├──── index.js <-- node-postrgres connection configuration
 │  ├──── config.js <-- database info (port/host/database name/username/password)
 │  └──── seed.sql
 │  └──── seed.test.sql
 ├── models/
 ├── routes/
 │  └──── api.js
 │  └──── houses.js
 ├── app.js
 ├── index.js
 ├── .gitignore
 ├── package-lock.json
 └── package.json
```

The global `process` object can then be used to tell the app which environment is being used.

Within the `process` object there is an `env` object - `process.env` - containing our environment variables, this is where the `NODE_ENV` is set to determine the environment that is being used.

`process.env.NODE_ENV` should always be set to a string of either `'test'`, `'development'` or `'production'`.

The `NODE_ENV` should be set to 'test' when the tests are run, by adding the following to the top of the `app.spec.js` file:

```js
process.env.NODE_ENV = 'test';
```

This needs to be at the top of the `spec` file so that once the other files in the app are read, they are able to reference the global `process` object to check which environment is being used.

The database `config.js` file must be refactored to connect to a different database based on the `NODE_ENV` that has been set, and to default to `'development'` if no environment has been specified.

```js
// db/config.js
const ENV = process.env.NODE_ENV || 'development';

const development = {
  host: 'localhost',
  database: 'harry_potter',
  port: 5432
};
const test = {
  host: 'localhost',
  database: 'harry_potter_test',
  port: 5432
};

const dbConfig = { development, test };

module.exports = dbConfig[ENV];
```

In order for the tests to not have to change after a `POST`, `PATCH` or `DELETE` request, the test database will also need to be reseeded each time the tests are run.

## 6. Re-seeding before the tests are run

In order for the test database to be re-seeded each time the tests are run, the test script can be updated to do this first:

```json
// package.json
{
  // ...
  "scripts": {
    "test": "npm run seed:test && mocha ./spec/*.spec.js",
    "seed:dev": "psql -f db/seed.dev.sql",
    "seed:test": "psql -f db/seed.test.sql",
    "dev": "nodemon index.js"
  }
  // ...
}
```

## Related Resources

- [SQL injection attack YouTube video](https://www.youtube.com/watch?v=ciNHn38EyRc)
