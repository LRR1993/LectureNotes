# PSQL Error Handling With Express

## Prior Knowledge

- able to use `node-postgres` with an express app to query a psql database
- general understanding of `next` and error handling middleware

## Learning Objectives

- `catch` psql error objects and pass them to `next`
- Send different response status codes and messages based on different errors
- Use `next` to pass errors along multiple error handling middleware functions
- Extract error handling logic away from `app.js`

## 1. Background

Express is a chain of middleware functions, invoked with `req`, `res` and `next`.

In the case of an error, `next(err)` is invoked and this will tell express to pass along the error argument to invoke the `next` _error_ handling middleware function.
_**Note:**_ If `next()` is invoked without an error, the next _normal_ middleware function will be invoked.

What separates an express error handling middleware function from a normal middleware function is that it will have 4 parameters, error first: `err, req, res, next`.

The benefit of being able to pass errors to specific error handling functions, it that it saves duplicate code (keeping code DRY!) and allows concerns to be separated.

_**Note:**_ This is different to the '/\*' route this is used to catch any routes that are not found in the app:

```js
//app.js
// ...
app.all('/*', (req, res, next) => res.status(404).send('Route not found'));
// ...
```

Express has a default error handler for if another error-handling-middleware function has not been defined, which by default will send a status 500 with the error that `next` has been invoked with, or a status 404 for a route that has not matched any in the app.

Error handling middleware functions defined in `app` will be called before express's default error handler.

## 2. Different errors and responses that should be sent

_**Note:**_ This is **NOT** a definitive list!

### GET All

- `/notARoute` -> route that does not exist: **404 Not Found**

### GET by ID

- `/api/resource/999999999` -> resource that does not exist: **404 Not Found**
- `/api/resource/notAnId` -> invalid ID: **400 Bad Request**

### POST

- `/api/resource` body: `{}` -> malformed body / missing required fields: **400 Bad Request**
- `/api/resource` body: `{ rating_out_of_five: 6 }` -> failing schema validation: **400 Bad Request**

### DELETE/PATCH/PUT by ID

- `/api/resource/999999999` -> resource that does not exist: **404 Not Found**
- `/api/resource/notAnId` -> invalid ID: **400 Bad Request**
- `/api/resource` body: `{}` -> malformed body / missing required fields: **400 Bad Request**
- `/api/resource` body: `{ increase_votes_by: "word" }` -> incorrect type: **400 Bad Request**

## 3. Testing and Handling Errors

Supertest (bug with `v4.0.0`, use `v4.0.2` and above) can check for error statuses and responses in the same way that it checks for 2xx statuses.

```js
// app.spec.js
// ...
it('GET for an invalid user_id - status:400 and error message', () => {
  return request(app)
    .get('/api/users/notAnID')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).to.equal('Invalid user ID');
    });
});
// ...
```

Ensure that the controller function has a `catch` block that will invoke `next` with any error that occurs in the promise chain:

```js
// controllers/users.js
// ...
exports.sendUserById = (req, res, next) => {
  const { user_id } = req.params;
  selectUserById(user_id)
    .then(user => res.status(200).send({ user }))
    .catch(next);
};
// ...
```

This will pass the error to the next error handling middleware:

```js
// app.js
// ...
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal Server Error' });
});
// ...
```

### PSQL Thrown Errors

PostgreSQL throws errors which are assigned five-character error codes (**NOT the same as HTTP status codes**). [PostgreSQL Error Codes](https://www.postgresql.org/docs/9.4/errcodes-appendix.html)

Example psql error object:

```js
{
  error: invalid input syntax for integer: "notAnID"
    at ...
  // ...
  name: 'error',
  length: 96,
  severity: 'ERROR',
  code: '22P02',
  // ...
}
```

Based on the error that has been thrown by psql, the error handling middleware in the app can send a different response.

This response can either use the message from the psql error (`err.message`) or a custom message written by the developer.

**Pros of using psql error messages:**

- They are already written
- They will be specific to the error that occurred
- Consistent with psql documentation (therefore searchable)

**Pros of using user defined error messages:**

- They can be made more user friendly
- They can be less cryptic than the existing error message

The below would allow relevant psql error codes to be added to the `psqlCodes` array, so that they would each cause a response to be sent with a status 400 and the appropriate psql error message.

```js
// app.js
// ...
app.use((err, req, res, next) => {
  const psqlCodes = ['22P02', ...]
  if (psqlCodes.includes(err.code))
    res.status(400).send({ msg: err.message || 'Bad Request' });
  res.status(500).send({ msg: 'Internal Server Error' });
});
// ...
```

When using psql error messages, the tests must be updated to match the message sent by psql. E.g:

```js
// /spec/app.spec.js
/// ...
expect(body.msg).to.equal('invalid input syntax for integer: "notAnID"');
/// ...
```

Some common instances in which psql may throw an error:

- Missing required fields (not null violation)
- Invalid input (failing schema validation)
- Column name does not exist
- Table name does not exist

### Custom Errors

In instances where psql does not throw an error, but an error status and message should be sent by the server, a custom error can be defined and thrown to the catch block for `next` to be invoked with.

An example where this may occur is when there is no error with the SQL query, but the query does not return any data/rows.

This can be identified in the model function, where the promise can be rejected with a **custom error status and message**, which would be caught by the `.catch(next)` block in the `sendUserById` controller function.

```js
// models/users.js
// ...
exports.selectUserById = user_id => {
  return db
    .query('SELECT * FROM users WHERE user_id = $1;', [user_id])
    .then(({ rows: [user] }) => {
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: `No user found for user_id: ${user_id}`
        });
      }
      return user;
    });
};
// ...
```

Once `next` is invoked with the **custom error status and message**, the error is passed to the next _error handling middleware_ function, where the appropriate HTTP status and response can be sent based on the `err` that has been received. E.g:

```js
// app.js
// ...
app.use((err, req, res, next) => {
  const psqlCodes = ['22P02', ...]
  if (err.status) res.status(err.status).send({ msg: err.msg });
  if (psqlCodes.includes(err.code))
    res.status(400).send({ msg: err.message || 'Bad Request' });
  else res.status(500).send({ msg: 'Internal Server Error' });
});
//...
```

The above would allow any custom error, defined with a `status` and `msg` that is passed to the error handling middleware to be handled and send a response to the client based on these, including the '/\*' route:

```js
//app.js
// ...
app.all('/*', (req, res, next) =>
  next({ status: 404, msg: 'Route not found' })
);
// ...
```

## 4. Refactoring to Individual Error Handling Blocks

Error handling middleware functions can quickly become complex and unwieldy. To manage this, it is good practice to split the error handling logic between multiple error handling blocks, that will be responsible for dealing with different types of errors and responses.

Errors can be passed down these blocks using `next(err)` if the condition to send a specific error status and message is not met. E.g:

```js
// app.js
//...
app.use((err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
});

app.use((err, req, res, next) => {
  const psqlBadRequestCodes = ['22P02'];
  if (psqlBadRequestCodes.includes(err.code))
    res.status(400).send({ msg: err.message || 'Bad Request' });
  else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
});
//...
```

Error handling middleware functions can be further separated into a separate file in order to keep the app tidy, and maintain all of the error handling logic in one place.

```js
// app.js
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors
} = require('./errors/index.js');
//...
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
//...

// errors/index.js
exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const psqlBadRequestCodes = ['22P02'];
  if (psqlBadRequestCodes.includes(err.code))
    res.status(400).send({ msg: err.message || 'Bad Request' });
  else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};
```

Collapse

Today

Ant Medina11:02 AM
Hi @channel Time to pair up again! ^ check out the lecture notes above!

:pear:
1

11:03 AM
aaand some additional notes on using separate dbs for testing.
Untitled

## Separate Test Database Configuration

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

The `NODE_ENV` should be set to ‘test’ when the tests are run, by adding the following to the top of the `app.spec.js` file:

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

## Re-seeding before the tests are run

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
