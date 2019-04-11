# Front End Testing

## Cypress

- install cypress as a dev dependency `npm i -D cypress`
- add a script to your package.json `"cy:open": "cypress open"`
- `npm run cy:open` in the console to initialize cypress
- look at the changes that cypress has made to your repo:

```
./cypress
  /fixtures
    - example.json

  /integration
    /examples
      - *.spec.js

  /plugins
    - index.js

  /support
    - commands.js
    - index.js

./cypress.json
```

- explore the example tests in `./cypress/integration/examples`
- create your own file `./cypress/integration/<someName>.spec.js`
- create a first test:

```
describe("...", () => {
  it("...", () => {
    cy.visit("");

    cy.get("...");
  });
});
```

- Refer to the [cypress documentation](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html) to find the cypress methods you'll need to test your mini-apps.
- Cypress [assertions](https://docs.cypress.io/guides/references/assertions.html)
- Check out [ui gradients](https://uigradients.com/) and [box-shadow](https://www.cssmatic.com/box-shadow).

## Types of testing:

- Unit (no api calls / requests, just a single piece of code / a function)
- Integration (multiple units together)
- Regression (testing over time confirms that changes to the code base do not break other features)
- End to end (no mocking. flow-based testing e.g. login, add item to basket, check out)
- performance, penetration, a11y, i18n, smoke, usability, stress, fuzz...
- testing diagram

| SLOW |     E2E     | \$\$\$ |
| :--: | :---------: | :----: |
|      | Integration |        |
| FAST |    Unit     |   \$   |

---

So far on the course we have used **unit** testing. We have used mocha to run those tests and chai as an assertion library, for building our `expect` statements. You'll have also used Jest, which performs the role of both test runner and assertion library.

## Cypress

Cypress is an end to end / integration testing tool that runs in the browser. Under the hood it uses Mocha and Chai, so a lot of the syntax is familiar. To get it up and running:
- `npm init`
- `npm i -D cypress`
- look at docs: [cypress.io](https://www.cypress.io/)
- add script to package.json `"cy:open": "cypress open"`
- `npm run cy:open`

You can see Cypress running tests on their own site if you explore `./cypress/integration/examples`, and execute `npm run cy:open`.

Here's an otherwise pointless little smoke test:

```js
describe('Our first test', () => {
  it("doesn't do much", () => {
    expect(true).to.equal(true);
  });
  it('shows us a failing test', () => {
    expect(true).to.equal(false);
  });
});
```

As you can see, we can use `describe` and `it` blocks, just like with Mocha. Check out the [ES6 Mocha Snippets extension](https://marketplace.visualstudio.com/items?itemName=spoonscen.es6-mocha-snippets) if you aren't using this already. We can also use `expect` without `requiring` it in. This is because cypress makes it globally available.

## Build Checklist

It's always good practice to start with diagram & plan what you're going to create. It gives us the ability to using something like TDD to approach building the site. But it's worth noting that ideas an approaches change more often at the front end than when designing a function to a spec, so some aspects of TDD may not feel so applicable.

Let's add a test. Create `./cypress/integration/task-adder.spec.js`.

`cy.get()` is our primary method for isolating particular elements so we can test their state. It takes a [css selector](https://www.w3schools.com/cssref/css_selectors.asp) argument (i.e. the same string you can use to apply css). Here's an example:

```js
describe('task-adder', () => {
  it('exists', () => {
    cy.visit('');

    cy.get('input');
  });
});
```

(Note: If `cy.visit` is called with an empty string, cypress will look for an `index.html` page in the root dir. In this test, it then looks for an input existing in a form on the page.)

https://docs.cypress.io/guides/references/best-practices.html is a particularly useful page for outlining best practices in cypress, and if you read through it you should notice some of the drawbacks of what we've just done. We would like our tests to endure - that is, not to need to be adapted as we change the contents of our page. If we add another form or input, our testing could become problematic, and we don't want to have to be continually auditing it.

A solution that avoids this is to use the **data** attribute of an html tag. An element can be given multiple data attributes, which are encompassed in a `dataset` property (https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset). Datasets advertise clearly what the attribute is for (we can use `data-cy`, for example) and can prevents conflict with other things (i.e. using classes for CSS or querying).

So the correct solution here would be to give data to the input: `<input data-cy="task-adder" />`

And the way to harness it cypress would be: `cy.get('[data-cy=task-adder]')`

There are lots of [different assertions available](https://docs.cypress.io/guides/references/assertions.html#Chai) - here's a couple of useful ones in action for testing adding a task.

```js
it('can add a task to the list', () => {
  cy.visit('');

  const task = 'Do the laundry';

  cy.get('[data-cy=task-adder]').type(`${task}{enter}`);

  cy.get('[data-cy=task]')
    .should('have.length', 1)
    .contains(task);
});
```

Here you can also see chaining of assertions. This is indicative of a difference in approach to the unit testing we are used to. In Cypress, don't worry about isolating each action and saving to the variable. Integration testing expects a certain 'narrative' to be followed - you are describing a use case in your tests which might encompass several steps.

If you're repeating steps though, take advantage of mocha's `beforeEach`. We can move `cy.visit("")` there as that's something that needs to happen before each assertion.

Keep good testing practices and break up your describe blocks. Individual components or pages are good targets for breaking down your testing suite. Here's `task-list.spec.js`, and we're testing the items that we added to the form in more detail.

```js
describe('task-list', () => {
  beforeEach(() => {
    cy.visit('');
  });
  it('each task has a delete button', () => {
    const task = 'test my code';
    cy.get('[data-cy=task-adder]')
      .type(`${task}{enter}`)
      .type(`${task}{enter}`);

    cy.get('.delete').should('have.length', 2);
  });
});
```

This relentless querying of the task adder element is getting a bit tiring, and our code is becoming WETTER. Even if we add it to the `beforeEach` it would lack any flexibility & we might have to rewrite it in other test files anyway. The answer: custom cypress commands. In `./cypress/support/commands.js`:

```js
Cypress.Commands.add('addTasks', (tasks = ['some text']) => {
  const taskAdder = cy.get('[data-cy=task-adder]');
  for (let i = 0; i < tasks.length; i++) {
    taskAdder.type(`${tasks[i]}{enter}`);
  }
});
```

Effectively, we have shorthanded this to an additional method on cypress. Refactoring our test code:

```js
it('each task has a delete button', () => {
  const tasks = ['make some tests', 'run the tests'];
  cy.addTasks(tasks);
  cy.get('.delete').should('have.length', tasks.length);
});
```