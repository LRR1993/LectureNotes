# DOM

## Front End Testing
cypress used for testing front end testing

```
npm i cypress
```

cypress uses website and tests the functionality

uses chai assertions (no need to require/imports)

JS Typical tests
```js
cy.visit(todos.html)
cy.get('input').type('testing testing ...')
cy.get('[data-cy=task-input').type('testing testing ...') // selects all data sets
cy.get('[data-cy=task-input-adder]').click()
cy.get('li.task').should('have.length',1)
cy.get('li.task > button').should('have.length',1)

cy.get('li.task > button').eq(0).click()
cy.get('li.task > button').first().click()

cy.get('li.task > span').click({multiple:true}).should('have.css','line-through')

```
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>To Do List</title>
    <script type="text/javascript" src="./methods.js" defer></script>
    <link
      href="https://fonts.googleapis.com/css?family=Merriweather"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <h1 data-cy="task-input">To Do List</h1>
    </body>
```

In cypress there are typical command/tasks tha can be used when testing so there isnt much repetivness

```js
Cypress.Commands.add('addTaks',(task = ['learn cypress']=>{
  ....
}))

```