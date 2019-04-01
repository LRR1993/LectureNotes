# Node & Databases

> psql - user interface

> POST QL - actual databases

db folder (set up)

- npm i pg (normal dependency)
- seed scirpt
- config.js to be included in .gitignore
- config.js: object
  - database name
  - host
  - port (5432 - postgress defined port)
- index.js
  - create node postgress client (enitiy to interact with the database)
  - const {client} = require('pg')
  - require in db
  - const client - new Client(dbConfig)
  - client.connect((err)=> console.log(err), else console.log(connected...))
  - module exports client

```js
// query example
const db = require('./db');

// olds ways
db.query('SELECT * FROM spells;', (err, data) => {
  if (err) console.log(err);
  else console.log(data.rows);
});
```

## Promises

- stateful object represents eventual outcome of some async process
  - state: pending
    - fullfilled or rejected
- .then() <--- call back function (called if promises succesful)
- .catch() <--- call back function (will get call if error)

```js
// promises
db.query('SELECT * FROM spells;')
  .then(data => console.log(data.rows))
  // returns a new promise - no need to nest callback functions
  .then() // new promise used in the next chain
  .catch(err => console.log(err))
  // one catch for all errs

});
```
