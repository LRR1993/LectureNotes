# Testing React Apps

## Prior Knowledge

- An appreciation of unit testing and TDD from Fundamentals / Backend
- How to install and run Cypress
- How to use selectors and make assertions using Cypress

## Learning objectives

- An overview of tools for testing in React
- Extended knowledge of the ways that Cypress can be used to test any browser-based front-end application.
- Learn how to stub API requests with cypress.

## Background

There are several ways we might approach testing a React application. `create-react-app` comes packaged with the testing framework `Jest`, which can run tests on files following their naming conventions. It is often used in conjunction with a package called `Enzyme`, which can be used to easily interact with React elements, and test component behaviours. Another increasingly common package is `react-testing-library`, which can be used to manipulate the DOM for testing purposes.

These notes will not explore this approach - known as **snapshot testing** - in favour of other ways of ensuring that we are confident in our application's behaviour.

## Extracting logic

Perhaps the best thing we can do for our React code is to extract as much logic that is independent of React from our code as possible. Any function that doesn't interact with the component (`this`) could be brought in from elsewhere, and unit-tested independently of React with Jest or any other framework you desire.

## Stubbing API requests

### Rationale

Running tests on an application's behaviour that interacted with an external API presents some challenges:

- A **production** database would have its data interfered with every time we ran a test - this would be unacceptable.
- A **development** database could not be trusted to give consistent data without being reseeded before running each test, which could become annoying quickly.
- Even a **test** database requires us to configure changes to where our data is requested from whenever we run tests.
- All external databases are subject to server or connection problems.
- We cannot engineer a test for how our application would respond to a server crash or other 5xx error.

A solution is to **stub** an API request. This means getting the browser to intercept a network request, and simulate a return value based on the variables of the request (its method, path, query and body).

There are some libraries built to do this:

- [Nock](https://github.com/nock/nock) is really good for stubbing XML HTTP Requests (XHR). It works with any tests that are run by node.
- [Fetch Mock](http://www.wheresrhys.co.uk/fetch-mock/) is good for stubbing requests made by the fetch API. Most don't do both.
- [Jest](https://jestjs.io/docs/en/manual-mocks) - set up our own mocks with Jest.

### Using Cypress

[Cypress](https://docs.cypress.io/guides/guides/network-requests.html#Testing-Strategies) has stubbing functionality built in. It only works in the browser, so it can't be used for React Native etc, and it does't work for the fetch API.

#### Installation

- to install Cypress as a dev dependency, run `npm i -D cypress`.
- add this script to `package.json`: `"cy:open": "cypress open"`.
- add `"baseUrl": "http://localhost:3000"` to `cypress.json`.

To stub an API request, create a Cypress 'server' in one of your tests, and define a route that you wish to intercept:

```js
describe('/home', () => {
  it('displays required data', () => {
    cy.server();
    cy.route('*/cats', {
      cats: [
        {
          _id: 1,
          name: 'Mitch',
        },
        {
          _id: 2,
          name: 'Tigger',
        }
      ]
    });
    cy.visit('/home');
    cy.get('data[cy=cat-card]').should('have.length', 2);
  });
});
```

Some points to note from this example:

- The first argument of `cy.route` is the route you wish to intercept. The wildcard `*` is used to intercept any network request ending in `/cats` so it doesn't matter if we change our server from localhost to any deployed version.
- The second argument is the data you wish to stub on this request. It is important you keep this aligned with the data structure of your API.
- The rest of the test will continue to run after the stubbed data is returned in the response from your network request - here, we are asserting that the return of the data should have resulted in the creation of two 'cat cards'.

#### Fixtures and Commands

Having all of this information in the `integration` folder could quickly make our tests become unwieldy.

Cypress provides a `fixtures` folder where we can hold JSON data we wish to be stubbed in place of API responses. We can refactor to hold the data in `./cypress/fixtures/cats.json`:

```json
{
  "cats": [
    {
      "_id": 1,
      "name": "Mitch",
    },
    {
      "_id": 2,
      "name": "Tigger",
    }
  ]
}
```

And we can further refactor by extracting the server, routing and visiting behaviour in a `command` (for example, `./cypress/support/commands.js`):

```js
Cypress.Commands.add('stubAndVisit', (path = '') => {
  cy.server();
  cy.route('*/home', 'fx:cats.json');
  cy.visit(path);
});
```

This leave a much neater test file:

```js
describe('/home', () => {
  beforeEach(() => {
    cy.stubAndVisit('/home');
  });
  it('displays all cats', () => {
    cy.get('data[cy=cat-card]').should('have.length', 2);
  });
});
```

#### Stubbing post requests

We can add additional routes in our `command`. If we want to make any request other than a `GET`, then we need to specify this as the first argument. By passing the posted data in as an argument, we can use this to simulate the return data:

```js
Cypress.Commands.add('stubAndVisit', (path = '', newCat) => {
  cy.server();
  cy.route('*/cats', 'fx:cats.json');
  cy.route('POST', '*/cats', {
    ...newCat,
    _id: 3,
    blockHistory: [1]
  });
  cy.visit(path);
});
```

## Resources

- [Running tests with `create-react-app`](https://facebook.github.io/create-react-app/docs/running-tests).
- [Enzyme](https://airbnb.io/enzyme/)
- [React Testing Library](https://github.com/kentcdodds/react-testing-library)