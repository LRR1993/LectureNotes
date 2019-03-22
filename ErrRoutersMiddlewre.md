# Express Routers and Middleware

## Prior Knowledge

- Setting up an express application
- Awareness of middleware (body-parser)
- MVC (Models Views Controllers)
- RESTful endpoints
- Controller functions always invoked with `req` and `res` (at the moment)
- Parametric endpoints (`req.params`) and queries (`req.query`)

## Learning Objectives

- Understand what a **middleware** function is
- Refactor to mount routes
- Use `router.route()`
- Understand `next` and basic error handling

## Refactoring to mount routes

Having all of the routes and controllers in a single file can be difficult to maintain.

Express allows the separation of server routes into smaller sub routers.

An `app.js` file with the following routes set-up can be refactored to use multiple express routers:

```js
// app.js
app.get('/api/users', (req, res) => {
  res.status(200).send('All OK from /api/users');
});

app.get('/api/users/:id', (req, res) => {
  res.status(200).send('All OK from /api/users/:id');
});

app.get('/api/users/:id/shoppingList', (req, res) => {
  res.status(200).send('All OK from /api/users/:id/shoppingList');
});

app.get('/api/fruits', (req, res) => {
  res.status(200).send('All OK from /api/fruits');
});

app.get('/api/fruits/:id', (req, res) => {
  res.status(200).send('All OK from /api/fruits/:id');
});
```

Project structure (excluding models and controllers):

```
  express-routing-example/
└────     node_modules/
└────     routes/
│  ├────     api-router.js
│  ├────     fruits-router.js
│  └────     users-router.js
├────     app.js
├────     listen.js
├────     package-lock.json
└────     package.json
```

```js
// api-router.js
const apiRouter = require('express').Router();

apiRouter.get('/', (req, res) => {
  res.status(200).send('All OK from API Router');
});

module.exports = apiRouter;
```

We can refactor `app.js` to use the apiRouter on all routes beginning with `"/api"`:

```js
// app.js
const apiRouter = require('./routes/api');

app.use('/api', apiRouter);
// ...
```

Express allows multiple sub-routers. This is a separate `userRouter` that can funnel all our `user` requests:

```js
// users-router.js
const userRouter = require('express').Router();

userRouter.get('/', (req, res) => {
  res.status(200).send('All OK from /api/users');
});

userRouter.get('/:id', (req, res) => {
  res.status(200).send('All OK from /api/users/:id');
});

userRouter.get('/:id/shoppingList', (req, res) => {
  res.status(200).send('All OK from /api/users/:id/shoppingList');
});

module.exports = userRouter;
```

`apiRouter` can then be refactored to `use` the `userRouter`.

```js
// api-router.js
const apiRouter = require('express').Router();
const userRouter = require('./users');

apiRouter.use('/users', userRouter);

module.exports = apiRouter;
```

The same can be done for the `/fruits` endpoints to segment each route depending on the resource that the user is requesting.

The benefit of this it to keep code tidy and easier to maintain and manage.

### router.route()

Routes can be organised further when a particular route accepts different types of HTTP methods by using `.route()`.

```js
// users-router.js
userRouter
  .route('/')
  .get((req, res) => {
    res.status(200).send('All OK from GET /api/users');
  })
  .post((req, res) => {
    res.status(200).send('All OK from POST /api/users');
  })
  .patch((req, res) => {
    res.status(200).send('All OK from PATCH /api/users');
  });

userRouter
  .route('/:id')
  .get((req, res) => {
    res.status(200).send('All OK from GET /api/users/:id');
  })
  .patch((req, res) => {
    res.status(200).send('All OK from PATCH /api/users/:id');
  });
// ...
```

## Error Handling Middleware

In express, a middleware function is a function that has access to the request object (`req`) and the response object (`res`) in the request-response cycle.

One example of application-level middleware is `body-parser`, which is a function call before the routing and controller logic to deal with any possible incoming `req.body`s.

Handling errors using `console.log` or `throw` does not provide the user/client with any information as to why they have not received the expected response.

Instead of using `console.log` or `throw`, sending an error from the controller as per the below is much more useful to the end-user:

```js
if (err) res.status(500).send({ err });
```

However, having to repeat this line of code (or similar) in each controller beaks the DRY coding principle.

To fix this, the third argument that is passed by express to each middleware function and controller - **`next`** - can be used to pass an error to **error-handling middleware**.

Error-handling middleware functions are defined in the same way as other middleware functions, except error-handling functions have **four** arguments instead of three: `(err, req, res, next)`.

The first argument of an error-handling middleware function is the error that the `next` function inside the controller is invoked with.

For example, the bellow controller will invoke the `next` function if there is an error from the `fetchPetsByOwnerId` function, which will in turn invoke the error-handling middleware function inside `app.js`:

```js
// controller.js
exports.getPetsByOwnerId = (req, res, next) => {
  const { ownerId } = req.params;
  fetchPetsByOwnerId(ownerId, (err, ownersPets) => {
    if (err) next(err);
    else res.status(200).send({ ownersPets });
  });
};

// app.js
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Server Error!');
});
```
