# React Lifecycle 1

## Prior Knowledge

- A basic understanding of how React works: a tree of linked components that are all called via an initial render from ReactDOM
- A conception of **state** as a place to hold changeable data that represents what's going on in your application
- A conception of **props** as the way of passing functions and data between your components

## Learning Objectives

- a better understanding of state - how to use but not abuse
- familiarity with two new React methods: `componentDidMount` and `componentDidUpdate` and how they fit into the React **lifecycle**

### React State

When making decisions about how to organise data, it's worth spending a little time planning ahead. This applies to React state as much as it does any database.

There are several factors you should consider, and it's possible that some of them may lead to conflicting conclusions, so you will have to make judgment calls. These are some of the criteria decisions should be based on:

- *Avoiding duplicate data*: this is advice applicable across the wider programming world, and should generally be a deciding factor. Duplicate data is tricky to update and leads to multiple sources of truth, and therefore potential bugs.
- *Ability to derive necessary information*: store all the information needed (but with as little excess as possible) to get the information that you want.
- *Keeping data flat*: as state should *never* be mutated, having nested data that can be overwritten can prove awkward.
- *Use cases in your application*: in many to many relationships, consider which should dataset should be responsible for holding the other. An app that held information about _recipes_ and _ingredients_ might store that data differently if the primary use of the application is to organise your recipe cards or to organise your store cupboard, for example.
- *Extensibility*: keep in mind how your data mind change in the future - allow for extra information fields.
- *Performance*: should not be your number one concern, but there are easy wins and for a website that is re-rendered regularly, this should be on your mind. Storing collected data in objects is often more efficient to query that finding the correct object in an array, for example.

### React lifecycle

We have already been exposed to one vital part of the React lifecycle - the `render` method. `render` means that we will always get the latest versions of our data (or **state**) on the screen.

#### render

`render` is responsible for generating JSX for our component's content, but is also a good place for executing lightweight code responsible for deriving information from state:

```js
class App extends React.Component {
  state = {
    houses: [
      // some house data...
    ],
    searchTerm: ''
  }

  render () {
    const {houses, searchTerm} = this.state;
    const searchedHouses = houses.filter(house => house.name === searchTerm);
    return // JSX based on filtered houses
  }
}
```

In this example, the filter will be called every time `render` is called, but we shouldn't consider this an issue. It's a very quick operation, and prevents us from duplicating information in state.

#### componentDidMount

Some logic should not be carried out on each render. There are two principle reasons:
- you want to `setState` with the return value, which would cause a re-render, and therefore infinite looping
- you only want to execute the logic once - to fetch data, for example

Imagine we want to persist our data so that when the application is re-opened, our previous data is loaded. This is a good use case for local storage:

```js
function TodoSaver({ saveData }) {
  return <button onClick={handleClick}>Save!</button>;

  handleClick = (event) => {
    saveData();
  };

  saveData = () => {
    localStorage.setItem('data', JSON.stringify(this.state));
  };
}
```

When loading the application, we want extract the data from local storage - but only once. `render` is a bad place to do this, for both the reasons outlined above.

React provides a _lifecycle API_ for situation like this. The correct lifecycle method to use in this case is `componentDidMount`. This is for logic we want to employ just once on loading the application. So we can employ this in our App class:

```js
componentDidMount = () => {
  const data = localStorage.getItem('data');
  if (data) {
    const state = JSON.parse(data);
    this.setState(state);
  }
};
```

It may seem a little counter-intuitive, but `componentDidMount` is triggered _after_ the first render function is completed. This does make sense however - we only want to carry out mounting logic is the component renders correctly, which this ensures.

#### componentDidUpdate

If we want to execute logic every time props and/or state changes, React provides a lifecycle method for this too - `componentDidUpdate`:

```js
componentDidUpdate = () => {
  this.saveData();
};
```

This would remove the need for the implementation of the button above, as we get our data saved every time state is changed.

We often want to conditionalise the logic executed in `componentDidUpdate`, potentially based on the previous values in props or states. One common example is when logic results in setting state - as `setState` will trigger `componentDidUpdate`, we need to guard against infinite looping. To help us with this, React will call `componentDidUpdate` with the previous props and state from the last render:

```js
componentDidUpdate = (prevProps, prevState) => {
  if (prevState !== this.state) {
    this.fetchData();
  }
};
```

## Resources:
- [React component docs](https://reactjs.org/docs/react-component.html#componentdidmount), including lifecycle methods
- [React lifecycle methods diagram](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)