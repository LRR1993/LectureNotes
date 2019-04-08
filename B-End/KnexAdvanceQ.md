# Group By and Aggregate Functions

## Prior Knowledge

- How to set up an `express` project using `knex`
- How to seed a database using `knex`
- How to build `express` endpoints using TDD

## Learning Objectives

- Use aggregate functions with `GROUP BY` in raw SQL
- Convert similar logic into `knex` syntax for use in a model
- Create flexible, reusable models that handle optional queries gracefully

## Organising Logic in raw SQL

Before building complicated database query logic in the models of a server, it is often beneficial to try out that logic in raw SQL.

Create an SQL file for this purpose. Any name will do - but make sure that it is `.gitignore`d as it has nothing to do with the functioning of the app itself.

```sql
-- ./query.sql
\c imdb_test

SELECT * FROM directors;
```

This file can also be useful for checking what is currently in the database.

## Aggregate Functions

There are many [aggregate functions](https://www.postgresql.org/docs/current/functions-aggregate.html) available for use in SQL. Examples include `COUNT`, `SUM`, `AVG`, `MAX`, and `MIN`. Aggregate functions compute a single result from a set of input values.

Aggregate functions can be a powerful way to add extra, useful information to the results served up on an endpoint. In the following example, we are attempting to generate a `COUNT` of the films by each director.

1. Use a `JOIN` to connect two tables together, creating a row for each unique combination. `LEFT JOIN` is appropriate here so directors with no films are not lost.

```sql
SELECT * FROM directors
LEFT JOIN films ON films.director_id = directors.director_id;
```

2. Having a row for every unique film-director combination isn't what we want. The rows created can be "squashed" together using `GROUP BY`, which will take some column to group the rows together with. Note: we can only `SELECT` columns that share the same values across the rows being grouped together. At this point, the results will look exactly the same as before...

```sql
SELECT directors.* FROM directors
LEFT JOIN films ON films.director_id = directors.director_id
GROUP BY directors.director_id;
```

3. We are now able to use an aggregate function - for example, counting all the appearances of some column, in the rows that are grouped together. Here, we count the `film_id`s of the rows grouped together. This will show up as a new column on the result of the query called `count`.

```sql
SELECT directors.*, COUNT(film_id) FROM directors
LEFT JOIN films ON films.director_id = directors.director_id
GROUP BY directors.director_id;
```

4. It is possible to alias this column with `AS`:

```sql
SELECT directors.*, COUNT(film_id) AS film_count FROM directors
LEFT JOIN films ON films.director_id = directors.director_id
GROUP BY directors.director_id;
```

## Converting SQL Logic into Knex Syntax

Now that the logic has been worked out in raw SQL, it is time to look up the syntax for doing the same thing using `knex`. Use the knex documentation to find examples.

[Knex's count method](https://knexjs.org/#Builder-count) allows us to pass it an object to rename the column produced from the count function. The rest of the query remains similar:

```js
exports.getDirectors = () => {
  return connection
    .select('directors.*')
    .count({ film_count: 'film_id' })
    .leftJoin('films', 'directors.director_id', 'films.film_id')
    .groupBy('directors.director_id');
};
```

## Creating Flexible Models

Often the models that are created could be reused in more than one controller.

Take for instance, a controller that gets results from a particular table. This may take optional queries, such as a limit for results etc. It is easy to provide a default value for a limit if the query is not there:

```js
exports.getFilms = ({ limit }) => {
  return connection
    .select('*')
    .from('films')
    .limit(limit || 10);
};
```

It could be useful to add in an optional named parameter, such as an `id` so that the same model could be reused for a `get*ById` controller. It is then a little trickier to handle the default behaviour. There is no obvious default value to provide to the SQL query. Thankfully, `knex` provides a [modify](https://knexjs.org/#Builder-modify) method. `modify` allows us to optionally alter the query:

```js
// ./models/films.js
exports.getFilms = ({ limit, film_id }) => {
  return connection
    .select('*')
    .from('films')
    .limit(limit || 10)
    .modify(query => {
      if (film_id) query.where({ film_id }).first();
    });
};
```

It is now possible to use the same controller for getting something by its `id` _and_ getting a whole collection of items.

```js
// ./controllers/films.js

exports.sendFilms = (req, res, next) => {
  getFilms(req.query).then(films => {
    res.status(200).send({ films });
  });
};

exports.sendFilmsById = (req, res, next) => {
  getFilms(req.params).then(film => {
    res.status(200).send({ film });
  });
};
```

Note that all of the arguments are passed to the model as a single object. This pattern allows us to pass optional arguments to a function without leaving "blank" spaces.
