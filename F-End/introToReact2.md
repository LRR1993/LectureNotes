# React Intro 2 (Quote Generator)

## Prior Knowledge

- Be able to use jsx and know how & when to transition between js & jsx
- Be able to create components (functional & class) and split code into separate components
- Understand concept of `state` and `props` and how to update / transfer data
- Comfortable with event handlers

## Learning Objectives

- Be able to set up a react project from scratch
- To improve planning, design, and architecture of a react project
- Be able to use multiple files for react projects
- Minimise state
- Be able to conditionally render jsx
- Be able to use react dev tools as a debugging aid

---

## 1. Starting a project

## create-react-app

React was created by Facebook. They first used it in 2011, then open-sourced it in 2013.

[create-react-app](https://facebook.github.io/create-react-app/) was made by FB as a tool to get started with React projects.

```bash
npx create-react-app $projectname
cd $projectname
npm start
```

There's some default setup that you are unlikely to have any use for, such as the React logo and the App css file. The `serviceWorker.js` file is used for offline capabilities on web apps - you can safely remove this and the reference to it in `index.js` if you don't intend on using it.

---

## Designing the application

### Questions to ask yourself:

- What do you want the application to do?
- What components does it need? What data does it require?
- What functionality is needed?
- What will it look like?

> Take time to _pare down the state_ - there is no need to hold the 'selected quote' separately - we can hold an indication of the **index**, and use render to determine what quote gets passed down.

Check out the [thinking in React](https://reactjs.org/docs/thinking-in-react.html) official site. It outlines the principles you should be considering when you plan your projects.

---

## 2. Components

## Dumb / Presentation

_Dumb_, or _presentational_, are called so because their only responsibility is to present something to the DOM.

_Smart_ components have a different responsibility. They are the ones that keep track of state and care about how the app works.

> A Quote component only needs to receive and display data not keep track of it

> Build your component statically - a hard coded quote - to begin with.

## Functional vs. Class

| functional                   | classes                     |
| ---------------------------- | --------------------------- |
| has `props`                  | has `props`                 |
| no `state`                   | `state`ful                  |
| no methods avaiable          | has methods e.g. `setState` |
| access `props` by parameters | access `props` via `this`   |
| no `render` method           | `render` method             |
| little transpiling needed    | lots of transpilng needed   |
| clear role of component      | not as clear                |

### **When to upgrade to a class**

1. When you need to store `state` - data that can change over the course of a user's session that cannot be derived from other `state`.
2. When you need life-cycle methods (next week's content)

## Reusability

In `React`, as in most programming, we want to make our code as DRY as possible. Using components to isolate reusable code makes this easier.

```js
// in render
<button onClick={this.doSomething}>text</button>
<button onClick={this.anotherThing}>another text</button>
```

```js
// in render
<Button buttonText='text' onClick={this.doSomething}
/>
<Button buttonText='another text' onClick={this.anotherThing}/>
```

## 3. Interactivity

## Handlers

It's often good practice to write handlers for event listeners you want to utilise. This allows you to separate and reuse behaviour across your component, and provides easier access to testing.

```js
// problematic: implies we are using the return value of `setState` when we are not, and obscures the functionality.
<button onClick={()=> this.setState(...)}
```

```js
// much better!
<button onClick={this.handleClick}
```

## Conditional Rendering

You might want to display a component - or elements within a component - only sometimes, dependent on the state of your application. The React documentation calls this [conditional rendering](https://reactjs.org/docs/conditional-rendering.html).

`jsx` relies on return values, so imperative code like `if else` and `for` loops cannot be used.

```js
// this is not valid javascript and will give you a TypeError
const happy = if(true){
  return true
} else {
  return false
}
```

You can achieve conditional rendering inline with ternary and logic operators are expressions. Consider this example where we want to sometimes show the author of a quote.

1. Figure out what your condition is:
   > _i.e. store in state when it's time to reveal the author_
2. Conditionally render your jsx
   > _i.e. the author in the quote component when showAuthor is true_

```jsx
{
  this.props.showAuthor ? <p>{quote.author}</p> : null;
}
```

The logical `and` operator can achieve the `if` without an `else`:

```jsx
// within Quote render
{
  this.props.showAuthor && <p>{quote.author}</p>;
}
```

## 4. Debugging Aids

## React Dev Tools

A really useful react aid, [React dev tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) allows you have more awareness of what is going on in your components, what's in `props` and `state` - without needing to `console.log` .

## Prop-types

[_Prop-types_](https://reactjs.org/docs/typechecking-with-proptypes.html) are a way of helping yourself and other developers read your react project and get better error messages, particularly when passing around lots of information on `props`

## 5. The don'ts:

#### There's lots of older react code online that you shouldn't be using

1. Babel makes use of the `class properties` JavaScript syntax proposal, so we don't need a constructor method as [shown in react docs](https://reactjs.org/docs/state-and-lifecycle.html) to set up state. We can just define state directly as a property within the class:

```js
// not generally necessary:
constructor(props) {
  super(props);
  this.state = {
    stuff: ""
  };
}
```

- You can just use `state = ....`

```js
// a much neater documentation of your class:

state = {
  stuff: ''
};
```

2. Babel also allows us to use the arrow syntax to bind functions to the class they are defined in. Without it, we would have the explicitly bind the function, either in the class `constructor` or as you pass it as props - otherwise, `this` would be bound to the context in which its containing function is invoked, which is likely to be a different class.

- Arrow functions methods do this already for you

```js
// passing function on props don't do this
handleClick = this.handleClick.bind(this);
```

## Extra resources

[State of js](https://stateofjs.com/) is a website where you can research programming demographics like what frameworks are popular.