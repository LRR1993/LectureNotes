# SQL Introduction

## 1. What is SQL

SQL stands for **Structured Query Language**

SQL is a query language for interacting with a **relational** database.

A database is an organized collection of data, stored and accessed electronically.

There are two main types of databases:

- relational
- non-relational

## 2. Relational vs. Non-Relational

### _Relational:_

- it is built from a set of unique tables (also called relations)
- data stored in columns and rows (very structured)
- a table contains data about just one entity
- tables must have a **primary key** column
- each row in a table has its own **unique primary key** value
- tables are linked by primary and foreign keys

### _Non-relational:_

- for less structured data
- Everything is a document
- throw it in the database, doesn't matter if it looks the same as other data
- data usually structured like json - can even be nested
- can usually retrieve instantly by an id or some other key

### _Pros of Relational:_

- Pro: data is well organised and structured. Great for when you know what your data will look like and its integrity is important. E.g. finance, retail, transaction systems
- Pro: no redundant (duplicate) data
- Pro: SQL is quite easy to learn in order to interact with the database
- Pro: Popular, has support expertise and tools.
- Pro: security is good, it's a mature technology compared to NoSQL

### _Cons of Relational:_

- Con: not good for fluid data or where we might not know what it looks like
- Con: enterprise level SQL DBS can be very expensive
- Con: With v. complex data can be hard to retrieve across many tables
- Con: Doesn't scale well: 'scaling horizontally' means adding extra machines, but this is hard when you have 100mil customers on a table and you need to add more customer on another machine. Very inefficient to have tables split across multiple machines. Need to pay a lot of money to scale horizontally or scale vertically (buy better hardware). FB trapped in 'SQL fate worse than death' due to inability to scale but managed to make it work

## 3. PostreSQL

Although SQL does have a strict standard, there are different versions of the SQL language.

However, to be compliant with the ANSI standard, they all support at least the major commands (such as SELECT, UPDATE, DELETE, INSERT, WHERE) in a similar manner.

PostgreSQL (PSQL) is an _open source_ version of SQL which dates back to 1986 as part of the POSTGRES project at the University of California at Berkeley.

### `psql` CLI commands

- `\l` - show databases
- `\c` northcoders_test - connect to db
- `\dt` - show tables
- `\dt+` - show tables and more info
- `\?` - show other commands
- `\q` - exit CLI
- `:q` = Return to `psql` cli from database/table/query view

## 4. Creating a database

To drop a database (if it exists), deleting the directory containing the data, including all tables and records, the SQL statement is as follows:

```sql
DROP DATABASE IF EXISTS my_database_name;
```

The following SQL statement creates a database called "northcoders_test":

```sql
CREATE DATABASE northcoders_test;
```

Run `\c northcoders_test` to connect to the database in the psql CLI.

To create a table inside a database, the name of the table must be specified, as well as the table's **column names** and their **data types**

### PostgreSQL **data types**:

- Boolean (`BOOL` or `BOOLEAN`)
- Character
  - `CHAR(n)` is the fixed-length character. If you insert a string that is shorter than the length of the column (n), PostgreSQL pads the spaces. If you insert a string that is longer than the length of the column, PostgreSQL will issue an error.
  - `VARCHAR(n)` is the variable-length character string. With `VARCHAR(n)`, you can store up to `n` characters. PostgreSQL does not pad spaces when the stored string is shorter than the length of the column.
  - `TEXT` is the variable-length character string. Theoretically, text data is a character string with unlimited length.
- Integers
  - `SMALLINT` is 2-byte signed integer that has a range from -32,768 to 32,767.
  - `INT` is a 4-byte integer that has a range from -2,147,483,648 to 2,147,483,647.
  - `SERIAL` is the same as integer except that PostgreSQL will automatically generate and populate values into the `SERIAL` column. This is similar to `AUTO_INCREMENT` column in MySQL or `AUTOINCREMENT` column in SQLite.
- Floating-point numbers (`FLOAT(n)`, `REAL` /`FLOAT8` `NUMERIC` or `NUMERIC(p,s)`)
- Temporal
  - `DATE` stores the date values only
  - `TIME` stores the time of day values
  - `TIMESTAMP` stores both date and time values
  - `INTERVAL` stores periods of time
- And many others! **See [PostrgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)**

### Creating a table

The following statement will create a table of northcoders, that holds information on each northcoders name. Where the primary key of each row is an `id`.

```sql
CREATE TABLE northcoders (northcoder_id INT PRIMARY KEY, northcoder VARCHAR(40));
```

### Inserting data into a table

Data can be inserted into the table using the following statements, inserting specific values to the columns in the table:

```sql
INSERT INTO northcoders (northcoder_id, northcoder) VALUES (1, 'Tom');
```

Multiple records can be inserted in one statement by comma separating the entries:

```sql
INSERT INTO northcoders (northcoder_id, northcoder) VALUES (2, 'Izzi'), (3, 'Alex');
```

### Querying a table for data

The `northcoders` table can then be queried using a `SELECT` statement

```sql
SELECT * FROM northcoders;
```

_**Note:** `*` will return all of the columns, or column names can be specified by comma separating them_

## 5. Syntax and Naming Conventions

### Syntax

Missing a semi-colon `;` from the end of a statement or query will result in it not being executed.

### Naming Conventions

> "There are only two hard problems in Computer Science: cache invalidation and naming things."

There are some important conventions to consider when naming tables and columns:

- Lowercase identifiers. Identifiers should be written in lower case. (e.g.: `first_name`, not `"First_Name"`)
  - This includes database names, tables and column names
  - Mixed case identifier names mean that every usage of the identifier would need to be quoted in double quotes
- Name primary keys using `[singularOfTableName]_id` format (e.g. `customer_id`).
  - If your primary key is `id` it can later be more difficult to keep track of what the `id` relates to.
- Foreign keys and fields representing the same kind of data on different tables should be named consistently.
  - E.g `student_id` and `staff_id`; and `student_username` and `staff_username`, rather than `student_username` and `staff_user`.
- Underscores to separate words, for readability (especially given the usage of lowercase identifiers)
- Full words, not abbreviations. In general avoid abbreviations for clarity.
- Table names: plural
- Column names: singular
- Avoid reserved/key words. Do not name columns with key words such as name, new, null etc. (See: [SQL key words](https://www.postgresql.org/docs/7.3/sql-keywords-appendix.html))

_**Note:** the above are only suggestions. (e.g. it is still possible to write identifiers in mixed case, but this would require the use a lot of "DoubleQuotes")_

## 6. Running a file with PSQL

SQL statements can also be written in a file and then run with `psql` to make the code reusable with the following commands:

- `psql -f example.sql` to print output to the _**terminal**_
- `psql -f example.sql > example.txt` to print output to an _**example.txt**_ file

_Note: this command **cannot** be run from within the `psql` CLI_

```sql
-- example.sql
DROP DATABASE IF EXISTS northcoders_test;
CREATE DATABASE northcoders_test;

\c northcoders_test

-- create tables

-- insert into tables

-- select from tables
```

## 7. Foreign Keys

A `FOREIGN KEY` is a field in one table that refers to the `PRIMARY KEY` in another table to link two tables together.

The table containing the foreign key is the child table, and the table containing the primary key is the referenced or parent table.

In the below tables the `spirit_animal_id` column in the `northcoders` table is a `FOREIGN KEY` that references the `PRIMARY KEY` of the `spirit_animals` table (`spirit_animal_id`).

```
northcoders table
-----------------
 northcoder_id | northcoder | spirit_animal_id
---------------+------------+------------------
             1 | Ant        |                2
             2 | Izzi       |                4
             3 | Tom        |                1
             4 | Alex       |                3

spirit_animals table
--------------------
 spirit_animal_id | spirit_animal | number_of_legs
------------------+---------------+----------------
                1 | Spider        |              8
                2 | Butterfly     |              6
                3 | Unicorn       |              4
                4 | Koala         |              4
```

## 8. Many-to-One Relationships

The above creates a **many-to-one** relationship between `northcoders` and `spirit_animals`;
Where many northcoders may have the same spirit animal.

To implement the above relationship between two tables, the `northcoders` table must be given the `spirit_animal_id` field in the `CREATE TABLE` statement. This will be of type `INT` to match the `spirit_animal_id` field in the `spirit_animals` table.

In order to have primary keys auto generated as incrementing integers, `SERIAL` can be used in place of `INT` when creating a table's primary key (e.g. `northcoder_id SERIAL PRIMARY KEY,`).

If using `SERIAL` the primary key does not need to be specified when inserting data into a table.

```sql
-- example.sql continued...

-- create tables
CREATE TABLE northcoders
(
  northcoder_id SERIAL PRIMARY KEY,
  northcoder VARCHAR(40),
  spirit_animal_id INT,
  FOREIGN KEY (spirit_animal_id) REFERENCES spirit_animals(spirit_animal_id)
);
```

OR

```sql
CREATE TABLE northcoders
(
  northcoder_id SERIAL PRIMARY KEY,
  northcoder VARCHAR(40),
  spirit_animal_id INT REFERENCES spirit_animals(spirit_animal_id)
);
```

## 9. Ordering of SQL Statements

In order for the `northcoders` table to reference the `spirit_animal_id` from the `sprit_animals` table, the `sprit_animals` table must be created before the `northcoders` table, or it will throw an error from trying to reference a table, and column that does not exist.

```sql
-- example.sql
DROP DATABASE IF EXISTS northcoders_test;
CREATE DATABASE northcoders_test;

\c northcoders_test;

CREATE TABLE spirit_animals
(
  spirit_animal_id SERIAL PRIMARY KEY,
  spirit_animal VARCHAR(40),
  number_of_legs INT
);

CREATE TABLE northcoders
(
  northcoder_id SERIAL PRIMARY KEY,
  northcoder VARCHAR(40),
  spirit_animal_id INT,
  FOREIGN KEY (spirit_animal_id) REFERENCES spirit_animals(spirit_animal_id)
);
```

In order for the `northcoders` rows to be created with a reference to a specific `spirit_animal` from the `sprit_animals` table, the `sprit_animal` must exist in the `spirit_animals` table, or it will throw an error from trying to reference a `spirit_animal_id` that does not exist.

```sql
-- example.sql continued...

-- insert into tables
INSERT INTO spirit_animals
  (spirit_animal, number_of_legs)
VALUES
  ('Spider', 8),
  ('Butterfly', 6),
  ('Unicorn', 4),
  ('Koala', 4);

INSERT INTO northcoders
  (northcoder, spirit_animal_id)
VALUES
  ('Ant', 2),
  ('Izzi', 4),
  ('Tom', 1),
  ('Alex', 3);

-- select from tables
SELECT * FROM northcoders;
SELECT * from spirit_animals;
```

## 10. Joins

`JOIN` clauses are used to combine records from two or more tables in a database.

There are many different Join Types in sql:

- `INNER JOIN`
  - Creates a new result table by combining column values of two tables (`table1` and `table2`) based upon the join condition.
  - The query compares each row of `table1` with each row of `table2` to find all pairs of rows, which **satisfy** the join condition.
  - When the join condition is satisfied, column values for each matched pair of rows of `table1` and `table2...
