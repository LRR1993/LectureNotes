# Errors & Middleware

BodyParser is a type of middleware

Express has a function called users, where we can separate are concerns\

```js
const app = require('express')();
const bodyParser = require('body-parser');
const {apiRouter} = require('./routes/apiRouter')
// remember to require & export

app.listen(9090, () => {}); // listen file

// main file
app.use(bodyParser.json());
app.use('/api',apiRouter) // creates new route

// error file
app.use((err,req,res,next) => {
    res.status(err.status).json(err.msg)
})
app.use((err,req,res,next) => {
    res.status(err.status).json(err.msg)
})

// Api routers
apiRouter.use('users/',userRouter)

//user router
const userRouter = express.Router()

userRouter.route('/')
  .get(fetchUser)//// etc - calls controller
  .post(createUser)/// etc - calls controller
})

//controller

function fetchUser ((req,res,next)=> {
  next({status:404,msg:'user not found'})
})
```

# Server Structure

**App**

- Create app,
- High level routing,
- Uses middle ware, export app

**Listen**

- Invokes app, on correct port

**Model**

- Gather data (DB,API,FS)

**Controller**

- Controls data

**Errors**

- Always deal with the client errors first (400 series)
