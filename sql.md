# Structured Queary Lang (SQL)

### Non-Relational (extremly flexible)

```
└────Collections
        └────Docs
        └────Docs
```

Relational - stored in tables

| OwnerID | FirstName | Age |
| ------- | --------- | --- |
| 1       | Bob       | 54  |
| 2       | Tim       | 12  |
| 3       | Amy       | 20  |

### SQL

- different types (psql,oracle,mySQL)
- Mainly used for relational databases
- data files : .sql
- ';' to end line
- DataTypes
  - Characters
    - CHAR (n) - fixed length of n
    - VARCHAR (n) - up to length of n
    - TEXT - unrestricted size
  - Intergers
    - SMALL INT (2bytes +/-32,000)
    - INT (4 bytes - +/-2billion)
    - BIG INT (8 bytes)
    - SERIAL (auto-gen INT)
  - BOOL (True/False)
  - DATE
  - TIME
  - TIMESTAMP (Date follwed by time)

SQL Terminal commands

- psql -f test_example.sql (runs files)
- \q (quits)
- \c (connects to table in database)
- \> pipe in another file

```sql
CREATE DATABASE IF EXISTS test_example;
CREATE DATABASE test_example;

-- connect to table
\c test_example

CREATE TABLE skills
(
  skill_id SERIAL PRIMARY KEY,
  skill TEXT
);

CREATE TABLE people
(
  people_id SERIAL PRIMARY KEY,
  first_name VARCHAR(40)
  last_name TEXT
  animal_id INT
  FOREIGN KEY (animal_id)
  REFERENCES animal_id (animals)
);

CREATE TABLE animals
(
  animal_id SERIAL,
  animal VARCHAR
);

INSERT INTO people
(first_name, animal_id)
VALUES
('jim', 'bob', 1),
('amy', 'smith',2);

-- junction table
CREATE people_skills
(
  people_skill_id SERIAL PRIMARY KEY,
  peple_id INT REFERENCES people(people_id),
  skill_id INT REFERENCES skills(skill_id);
)

INSERT INTO skills
(skill)
VALUES
('javascript'),
('cats'),
('mtq'),
('running');

INSERT INTO animals
(animal_id)
VALUES
('dog'),
('cat');

INSERT INTO people_skills
(people_id, skill_id)
VALUES
(1,1),
(1,2);
(1,3);
(1,4);

-- one to many
SELECT * FROM people
JOIN animals
ON people.animal_id = animals.animal_id
```
