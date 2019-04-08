# Testing and Error-handling

​

## Learning Objectives

​

- Learn about `400`, `404`, `405` and `422` error codes
- Handle errors using error-handling middleware functions
- Use the `router.all()` method in express
  ​

## Error-handling

​
When something goes wrong on the server side, it is useful to indicate to the client what has gone wrong and, perhaps, why it has happened. One way to convey this information is to send the client the correct HTTP status code.
​

### 400 - Bad Request

​
A 400 status code means "Bad Request", that is to say, the client did something wrong in their request.
​
For example, say there is an end-point `/api/films/:film_id`, where the `:film_id` should be an integer value. If a client then makes a request of `/api/films/abc`, this is a bad request. The ID should be an integer but instead the client provided an ID of "abc" which makes no sense at all!
​
When the user sends some malformed information (in the request body, request params or the request query) - 400.
​

### 404 - Not Found

​
Sending a 404 status code indicates that the client was able to communicate with a given server, but the server could not find what was requested. There are two main instances where this applies:
​

1. A client requests a route that does not exist on the server (for example `GET /not-a-route`)
2. A client requests some resource that cannot be found (for example `GET /api/resources/1`, where a resource with an id of `1` was deleted some time ago)
   ​

### 405 - Method Not Allowed

​
When a route exists, but cannot be accessed with that method a particular HTTP method. This is useful to let the client know that this route _does_ exist, but the method they are using is not available on it (for example `DELETE /api/articles`)
​

### route.all()

​
Middleware that is called on ALL other routes not specified. This is best for handling the method not allowed errors.
​

### 422 - Unprocessable Entity

​
When the entity conforms to the database schema but cannot be processed for other reasons, such as unique key violations.
​
For example, if a client makes `POST` request to add a new user to a service, but the unique username is already taken. In this case, it is not necessarily the client's fault and the request may conform to the right structure, but cannot be processed by the database.
​

## Testing an Error

​
Each time a route is built on the server, after taking the "happy path", you should then start to think about what might go wrong. Each time you think of something **make a test** for that situation first.
​

```js
describe('/api/films/:film_id', () => {
  it('GET status:400 responds with error message when request is made with a bad ID', () => {
    return request
      .get('/api/films/abc')
      .expect(400)
      .then(res => {
        expect(res.body.msg).to.equal('Bad Request');
      });
  });
});
```

​
Once you see the test fail, you can try to handle the error gracefully.
​

### Error Handling Blocks

​

#### SQL Errors

​
Knex throws SQL errors. SQL errors are useful because they are consistent, and have definitions which provide useful feedback to our api users. Ensure that every controller has a `.catch` block on it, so that any promise rejections are caught.
​

```js
exports.sendItems = (req, res, next) => {
  fetchItems()
    .then(items => {
      res.status(200).send({ items });
    })
    .catch(next);
};
```

​
When a promise rejection is caught, the error can be passed to the _next_ error handling middleware that is attached to the `app`. In this middleware, we can check some properties of the error to decide which status code is the most appropriate to send. If it doesn't match one of the expected errors, we can pass it on to the next error handling middleware that is attached to `app` by calling `next` with the error.
​

```js
// app.js
// ...
app.use((err, req, res, next) => {
 const badRequestCodes = ['22P02', ...];
 if (badRequestCodes.includes(err.code)) {
  res.status(400).send({ msg: err.message || 'Bad Request' });
 } else next(err);
});
​
app.use((err, req, res, next) => {
 console.log(err);
 res.status(500).send({ msg: 'Internal Server Error' });
});
//...
```

​
By doing this check in one place - it prevents us from having to check for 400s or 404s in many different controllers throughout the app.
​

### DELETE

​
One problem you may face is that you cannot delete some items from your database easily. This is because entries in other tables may use its ID as a foreign key. In this case, you might want to add this to your migrations, to save you from sending 2 (or more!) delete requests:
​

```js
// db/migrations/20190.._create_*_table
// ...
blogsTable
  .integer('user_id')
  .references('users.user_id')
  .onDelete('CASCADE');
// ...
```

​
This means that when something is deleted in one table, the rows in another table that reference it should also be deleted. In the example above, this makes sense because if a user were to delete their account, they would also want any blogs that they had written to be deleted too.
