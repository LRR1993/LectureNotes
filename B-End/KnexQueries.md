# Knex Queries

## Prior Knowledge

- How to configure a knex project
- How to seed a database using knex

## Learning Objectives

- Learn how to structure models, controllers and tests when building endpoints with knex
- Learn how to use more complex queries when designing the models
- Learn about additional SQL clauses like ORDER BY, LIMIT, etc...

## connection.js

The seed function in a knex project can be run by using the knex command line interface. When this happens, knex will invoke the seed with a `connection` object - using the configuration exported from the `knexfile`.

However, to query the database directly (e.g. in a model), we will have to create this connection object ourselves.

To do so, invoke knex with the correct database configuration information (exported from the `knexfile`).

```js
// ./db/connection.js
const knex = require('knex');
const dbConfig = require('../knexfile.js');
const connection = knex(dbConfig);
module.exports = connection;
```

- require in the knex module
- access the config for the database
- invoke knex with the config object - this will create an object containing a bunch of functions for querying the database
- make the connection available in other files by exporting it

### Integration Tests

It is imperative that we write tests first if we are correctly adhering to the TDD cycle. Each test should inform which piece of functionality we are about to implement.

```js
// ./spec/app.spec.js
process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');
describe('/api', () => {
  describe('/films', () => {
    it('responds with an array of film objects, each film having the right properties', () => {
      return request.get('/api/films').expect(200);
    });
  });
});
```

- At the top of the test file, set the `process.env.NODE_ENV` to 'test' - which ensures the correct configuration object will be exported from the `knexfile.js`, thereby connecting to the test database when running these tests.
- All the test does at the moment is check for status 200. In other words, all that is needed to pass this test is a route and a controller that will respond with the correct status code.

_Note what happens when we write the test and we omit the return statement when calling `request.get()`_

### Building Endpoints

Set up the appropriate routes then attach a controller:

```js
// ./controllers/films.js
exports.sendFilms = (req, res, next) => {
  res.status(200).send({ message: 'some films here' });
};
```

- This should pass the test as the endpoint now responds with the correct status code! At this point, make the test a little more ambitious - check that it responds with an array of appropriate objects.

```js
describe('/api/films', () => {
  it('responds with an array of film objects, each film having the right properties',() => {
    return request.get('/api/films')
      .expect(200);
      .then(res => {
        expect(res.body.films).to.be.an('array');
        expect(res.body.films[0]).to.contain.keys('film_id','title','year_of_release','rating','box_office','duration','plot');
      });
  });
});
```

_Note_: this test is purposefully quite generic. This is to allow further functionality to be added, without breaking this test (such as the sorting order / number of items returned by default etc.).

Now the controller will have to invoke some other **model** function. The model function will directly interface with the db. In other words, the model will query the database and retrieve some data for us. Once it has done so, the controller can then send this information to the client.

```js
// ./models/films.js
const connection = require('../db/connection');
exports.fetchFilms = () => {
  return connection.select('*').from('films');
};
// ./controllers/films.js
const { fetchFilms } = require('../models/films.js');
exports.sendFilms = (req, res, next) => {
  fetchFilms().then(films => {
    res.status(200).send({ films });
  });
};
```

This will pass the test at the moment as we are just responding with 200 and an array of all the films from our DB. Each row in the postgres database will be turned into an object by `knex`.
