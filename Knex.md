# Node Environments

- test (small data, small behaviors - kept locally on the machine)
- developments(bigger data - shared among many developers)
- production (database used by users when deployed)

To know what env in use process in node (global object)

- process.env ---->>>> containing env variables
  - process.env.node_ENV - current env ("test", "dev", or "production")

# Knex

knexfile.js (must be lower case) <--- file to be ignored
knex innit - intilise bank template

```js

const ENV = process.env.NODE_ENV || 'development'


const dbConfig = {
  development : {
    client: 'pg'
    connection: {
      database: 'imdb'
  },
  seeds : {
    directory: './db/seeds'
    }
  },
  test : {
    client: 'pg'
    connection: {
      database: 'imdb_test'
  },
  seeds : {
    directory: './db/seeds'
    }
  }

}

module.exports = dbConfig[ENV]
// exports for the specfic environments
```

## Seeds

seed.js (using knex to populate database)

```js
// promise -> knex can use bluebird promise lib
// index.js data
const ENV = const ENV = process.env.NODE_ENV || 'development'
const devData ... require
const testData ... requires

const data = {
  devlopment: devData,
  test: testData

}
module.exports = data[ENV]

// seed
const { filmData, directorData } = require('../data')
exports.seed = {db,Promise}=> {
db.insert(filmData).into('films')
}
```
