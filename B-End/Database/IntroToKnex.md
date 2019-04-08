# Introduction to Knex and Seeding

## Prior Knowledge

- Basic SQL Syntax
- JavaScript Promises

## Learning Objectives

- Use `knex` methods for inserting data into a postgreSQL database
- Be able to seed a database from some raw json data, using `knex`
- Handle references within data

## Knex

Knex is a SQL query builder, that provides a more powerful way for us to interact with a SQL database. Rather than building manually building up query strings (like when using node-postgres directly), Knex provides many chainable methods to help query the database in a more flexible way. It also has a command line interface for performing common tasks, such as seeding the database.

## Configuring the Project

`knex` can be used with several different flavours of `SQL` so the correct client adapter needs to be installed too. In our example, we will use node-postgres, so we need to install the dependency (`pg`).

```bash
npm i knex pg
```

`knex` requires configuration information, including the client adapter and the database we are connecting to. We can also specify where the function to seed our database lives.

Keep this information in `knexfile.js` in the root directory:

```js
// in ./knexfile.js

const dbConfig = {
  client: 'pg',
  connection: {
    database: 'imdb'
    // for linux:
    // username: 'mitch',
    // password: 'passywordingtons'
  },
  seeds: {
    directory: './db/seeds'
  }
};
```

If there is a test database too, then the config object can be split into two parts:

```js
// in ./knexfile.js

const dbConfig = {
  development: {
    client: 'pg',
    connection: {
      database: 'imdb'
    },
    seeds: {
      directory: './db/seeds'
    }
  },
  test: {
    client: 'pg',
    connection: {
      database: 'imdb_test'
    },
    seeds: {
      directory: './db/seeds'
    }
  }
};
```

Each key in the config object represents a different database that can be connected to.
**NOTE**: ensure that the `seeds` object is nested inside both the `development` and `testing` object.

## Environments

To use the appropriate database, check the Node environment (`process.env.NODE_ENV`) to export only the correct config object. The node environment should be either 'test', 'development' or 'production'. This information can be found on the `process` object - a global object, used to provide information about and control over the current node.js process.

Within the `process` object there is another object - `process.env` - containing our environment variables, amongst them is `process.env.NODE_ENV`. This is just a string set to either 'test', 'development' or 'production'

In the `knexfile.js`, check the current NODE_ENV. Then use this value to export out only the matching configuration object.

```js
// in ./knexfile.js

const ENV = process.env.NODE_ENV || 'development';
// check the environment and default to 'development' if undefined

const dbConfig = {
  development: {
    client: 'pg',
    connection: {
      database: 'imdb'
    },
    seeds: {
      directory: './db/seeds'
    }
  },
  test: {
    client: 'pg',
    connection: {
      database: 'imdb_test'
    },
    seeds: {
      directory: './db/seeds'
    }
  }
};

// use square brackets to evaluate ENV
// rather than dot notation,
// which would look for a key 'ENV' in the `dbConfig`
module.exports = dbConfig[ENV];
```

## `dev-setup.sql` & `test-setup.sql`

These files will create the databases necessary for the project, as well as their schemas (what tables, columns, and data types belong in each place) from scratch. They can be run with this command:

```bash
psql -f ./db/dev-setup.sql && psql -f ./db/test-setup.sql
```

These commands can then be added to the scripts in the `package.json`:

```json
// in ./package.json
{
  "scripts": {
    "setup-dev-db": "psql -f ./db/dev-setup.sql",
    "setup-test-db": "psql -f ./db/test-setup.sql"
  }
}
```

## Seeding Data into the SQL database

We can avoid writing an `SQL` script to insert data into the database - this could take a long time to write, as the data could be multiple arrays containing thousands of items with many keys. Each item could also contain a reference to another item.

`knex` provides appropriate methods for seeding the database. Add a `seed.js` file inside `./db/seeds` and write the following:

```js
// in ./db/seeds/seed.js

exports.seed = function(connection, Promise) {
  // <-- logic for inserting our data here!
};
```

This seed function is called with a connection object with API methods for building a database query. It also has a `Promise` parameter, as under the hood `knex` uses the bluebird promise library (bluebird is meant to be better optimised than the native JS `Promise`!)

- To run the seed function, add the following scripts to our `package.json`:

```json
// in ./package.json
{
  "scripts": {
    "seed-dev": "npm run setup-dev-db && knex seed:run",
    "seed-test": "npm run setup-test-db && NODE_ENV=test knex seed:run"
  }
}
```

These scripts use the `knex` CLI to run our seed function, after dropping and creating the database.

- The `seed-dev` script will drop and create the development database (using postgres), then seed the development database.
- The `seed-test` script will drop and create the test database (using postgres). It then sets an environment variable so that `process.env.NODE_ENV === 'test'` and knex will use the test database when running the seed function.

## Project Structure

The directory structure for a back end that provided data on films and their directors may look something like this:

```raw
.
├── db
│   ├── data
│   │   ├── index.js -> exports 'development' and 'test' data
│   │   ├── dev-data
│   │   │   ├── index.js -> exports directors and films data
│   │   │   ├── directors.js
│   │   │   └── films.js
│   │   └── test-data
│   │       ├── index.js -> exports directors and films data
│   │       ├── directors.js
│   │       └── films.js
│   ├── seeds
│   │   └── seed.js -> contains the seed function
│   ├── dev-setup.sql -> creates the development database & tables
│   ├── test-setup.sql -> creates the test database, tables & inserts data
├── knexfile.js -> contains configuration information for knex
└── package.json
```

## Exporting Test or Development Data

As we develop a project, it is often useful to have two (or more) sets of data. One will be a simple, smaller set of data that can be used for testing purposes. Another will be a more realistic set of data that can be used as a "placeholder" for real data created by users. We want to make it so that, depending on the environment that we are in, we use the correct set of data.

- Create an `index.js` file in the `test-data` and `dev-data` folders in order to export the data from one file in the directory.

```js
// ./db/data/dev-data.js && /db/data/test-data.js
exports.filmData = require('./films');
exports.directorData = require('./directors');
```

Then we can add an `index.js` file to the directory above, that requires in both test and development data. It can then check the `NODE_ENV` (default to 'development', if the `NODE_ENV` has not been defined) and export out only the relevant data.

```js
// ./db/data/index.js
const ENV = process.env.NODE_ENV || 'development';
const testData = require('./test-data');
const devData = require('./dev-data');

const data = {
  development: devData,
  test: testData
};

module.exports = data[ENV];
```

## Building the Seed Function

**STRATEGY**

- The first thing to think about is **order** - we need to consider which data needs to be inserted into the database.

- Looking at SQL tables can give us an indication of which tables are reliant on other tables already existing in the database. If one table has an `id` column that references the another table, this data cannot be inserted until another set of data with their `id`s already exists inside the SQL database.

- Require the data into `seed.js`. Knex provides an [`insert`](https://knexjs.org/#Builder-insert) method for inserting multiple rows into the database.

```js
knex
  .insert([{ title: 'Great Gatsby' }, { title: 'Fahrenheit 451' }])
  .into('books');
```

```sql
insert into `books` (`title`) values ('Great Gatsby'), ('Fahrenheit 451');
```

Above is a nice example from knex - plucked straight from the [Query Builder section](https://knexjs.org/#Builder) of the knex documentation. Access a method off the knex connection object and invoke it with a single argument - an array of objects. Each object in the array represents what will be a single row in the books table (each key corresponds to a column name, and the value will be inserted). We can use this example to build our own insert query:

```js
const { directorData } = require('../data');

exports.seed = function(knex, Promise) {
  return knex
    .insert(directorData)
    .into('directors')
    .returning('*');
};
```

- The `insert` and `into` methods when chained like this will return a `Promise` as the insertion of data into the db is an asynchronous operation. It is **essential** that the seed function returns a `Promise` for this to work.

- `returning('*')` will mean the data that has just been inserted into the db can be accessed in a callback function that is pass to the `then()` block.

```js
const { directorData } = require('../data');

exports.seed = function(knex, Promise) {
  return knex
    .insert(directorData)
    .into('directors')
    .returning('*')
    .then(insertedDirectors => {
      console.log(insertedDirectors, '<-- an array of inserted directors');
    });
};
```

## Creating References

- The raw data for films looks like this:

```js
[{
    title: 'The Shawshank Redemption',
    year_of_release: 1994,
    duration: 142,
    plot:
        'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    rating: 9.3,
    box_office: 58300000,
    director: 'Frank Darabont',
}, ...]
```

This is problematic as the one table in the SQL database needs to reference another's `id` - a foreign key. This problem is akin to iterating over the collection, and replacing some value with the corresponding `id`.

- A reference object is a way of storing information much like one would in a table. The key will represent some piece of data and the value will be some different but corresponding piece of data.

Ultimately we want a reference object that looks something like this:

```js
{
  'David Fincher': 1,
  'Jonathan Demme': 2,
  'George Lucas': 3,
  ...
}
```

With this object we can go through the films and replace each film string with a corresponding `film_id`.
