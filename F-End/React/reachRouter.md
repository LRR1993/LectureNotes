# Reach Router
## Prior Knowledge
- An understanding of the parent-child relationship what exists in HTML and is emulated in JSX
- An appreciation of React as a single page application (SPA) library
- Understand the mounting, rendering and updating phases of a React component lifecycle
- Understanding of how MVC 'classically' serves fulfilled HTML and an appreciation of how React does not fit into this model
## Learning objectives
- Understand the compositional pattern of React and have some insight into the advantages it affords
- Understand the objectives and principles of adding routing to a single page application
- Understand how to apply some of the components and facilities offered by the Reach router library
## Background - Composition
The [React docs](https://reactjs.org/docs/composition-vs-inheritance.html) list **composition** as one of their 'main principles'. This is entirely in keeping with a technology built around a tree structure, like the DOM. React and JSX allow us to 'componentise' parts of our application and use them as different branches of the DOM tree. Any React element or component has a relationship with its parent and children by its existence within your application.
React allows us to further tie this parent-child relationship together by the passing of `props` from one 'generation' to the next. Because a parent has responsibility for rendering its children, it also able to pass information to be used by the child at the point of render.
In fact, React treats this parent-child relationship as equivalent to the passing of props - child elements or components can be props of their parent components. JSX allows us to express this by separating the opening and closing tags of a component:
```javascript
function BigMarginWrapper(props) {
  return (
    <div className="big-margin">
      {props.children}
    </div>
  );
}
function Heading() {
  return (
    <BigMarginWrapper>
      <h1>
        Look at all the space around me!
      </h1>
    </BigMarginWrapper>
  );
}
```
In this example, `Heading` is eventually rendering an `h1` tag, but this is actually happening indirectly. The `h1` tag is made the responsibility of `BigMarginWrapper` to render in its own function, and JSX will make this available to `BigMarginWrapper` in the `children` value of its props. `BigMarginWrapper` in this case does so enclosed within a styled `div` - but the possibilities are of course much wider.
## How Routing Works
One of these possibilities could be to conditionally render the child under certain circumstances. Again, there are limitless possibilities. One behaviour we could create which would be especially helpful would be to give a sense of _routing_ - to conditionally render components based on the `url`. This is a property available on the global `window` object on any browser, so a Router parent component could use this to determine which of its children is displayed.
React applications are generally **single page applications** (SPAs) - as all the JavaScript is sent (though not necessarily all the data) required to construct the whole website, instead of individual HTML pages. Essentially, it does not matter what the path of the URL is on an SPA, as everything is sent on the home path anyway. There are advantages to this, but there are two major drawbacks to losing this routing behaviour:
- Different areas of our application are not individually addressable (preventing, for example, sharing links)
- Losing use of the browser's history (back and forward navigation)
**Reach Router** is a library that allows **client-side routing**, as opposed to **server-side routing**:
### Server-side routing
- The server has views for every single route of our app
- User navigates to `/about`, the browser sends a GET request to `/about` and our server responds with the corresponding view.
### Client-side routing
- In React applications, the server provides a single HTML file (with an empty div) and a bundle of JavaScript. The rendering of the application happens client-side.
- Because all the view of our application are already in the browser, we don't need to make GET requests to get different views.
- We can use a router, a library that catches the changes in the URL and renders different components accordingly.
- HTTP requests still happen in the background, but not for displaying views, just for getting or sending data to servers.
- The page never reloads, components come and go from the DOM, giving the illusion of navigation.
## Using Reach Router
Install like any other npm package: `npm install @reach/router`.
The following shows a basic use case for Reach router. Notice that the components we want to render conditionally are _children_ of the `Router` component from the Reach Router library.
```js
import React from 'react';
import { Router } from '@reach/router';
const App = () => (
  <Router>
    <Home path="/" />
    <About path="/about" />
    <Topics path="/topics" />
  </Router>
);
const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);
const About = () => (
  <div>
    <h2>About</h2>
  </div>
);
const Topics = () => (
  <div>
    <h2>Topics</h2>
  </div>
);
```
For this to work, `Router` _must_ be conditionally rendering one of its child components. We could consider these 'pages' of our application, because they are each given a `path` prop, which `Router` will compare to the window URL in deciding which to render.
### Links
Though typing in a new URL will take you to the correct place if you have routing set up, you will still be reloading the entire application, which defeats one of the purposes of React and single page applications. **Anchor tags** (tags) are normally used for linking between pages, but the default behaviour of these is also to load a new page.
Reach router provides a useful `<Link>` component that removes this behaviour for us. It takes a `to` property that will set the url. It could be useful in a `Navigation` component, for example:

```javascript
<nav>
  <Link to="/"><button>Home</button></Link>
  <Link to="/about"><button>About</button></Link>
  <Link to="/topics"><button>Topics</button></Link>
</nav>
```
Again, we can see composition being used give behaviour (perhaps more accurately in this case, strip out the new page behaviour) to its child.
### Subrouting and Parametric routes
**Reach router** gives us the facility to create parameters in our routes, so we don't have to anticipate every variation of a url that might exist. The syntax for doing so is similar to Express:
```js
const Topics = () => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to="rendering">Rendering with React</Link>
      </li>
      <li>
        <Link to="components">Components</Link>
      </li>
      <li>
        <Link to="components-v-state">Props v. State</Link>
      </li>
    </ul>
    <Router>
      <Topic path=":topic" />
    </Router>
  </div>
);
```
In this example, we create a new `Router` to house our individual `Topic` component. Even though there is only one component that can be rendered from this component, `Router` will give the `Topic` component a prop of the _value_ that exists in the place of `topic` in the url, essentially creating a key value pair of the parameter name and value.
Notice also that `Topic`'s `path` prop does not take the whole url, just the extension from the current url that rendered topic in the first place. We want `Topic` will be rendered when the url is `/topics/components` or `/topics/rendering` or any other topic we create a link to or we have content for.
To make this happen, we need one more refactor at App level:
```js
const App = () => (
  <Router>
    <Home path="/" />
    <About path="/about" />
    <Topics path="/topics/*" />
  </Router>
);
```
Without the wildcard (`*`) at the end of the topics route, going to a subroute of `"/topics/:topic"` would actually no longer match the path description `"/topics"`, so nothing would be rendered at all. Adding the wildcard means that `Topics` - and all its children - will be rendered whether the route is `"/topics"`, `"/topics/:topic"` or anything beyond that.
### Default routes
It may be advisable to catch any routes that don't match any of the `path`s you have outlined. You can do this by adding a `default` prop to the final child route in `Router`:
```js
const NoMatch = () => (
  <div className="NoMatch">
    <h1>We could not find what you are looking for...</h1>
    <Link to="/">Go back to the Home Page</Link>
  </div>
);
// and on the render method for App:
<Router>
  <Home path="/" />
  <About path="/about" />
  <Topics path="/topics" />
  <NoMatch default />
</Router>;
```
### Routing and the React lifecycle
When a component is first rendered through a Router, it will mount, triggering its `componentDidMount` lifecycle method. This is an opportunity to fetch data that is required for that particular route - if you have navigated to a route for a particular news article, for example. Any component that is no longer being rendered if the url changes will trigger its `componentWillUnmount` method - useful for cancelling requests or listeners, for example.
If a user navigates between pages that render the same component (for example `/topics/components` to `/topics/rendering`) then neither the `Topics` nor the `Topic` component will unmount or remount, as they were never given any cause to. This removes `componentDidMount` as an opportunity for data fetching. However, as the url has changed, so have the `props` of our `Topic` component, which means `componentDidUpdate` _will_ fire. We can make the same calls to an API in both the mounting and updating lifecycle methods to accommodate this.
There is a risk associated with doing this in `componentDidUpdate` however: as `componentDidUpdate` also triggers when `state` changes, a call of `setState` in `componentDidUpdate` could potentially trigger an infinite loop. As such, it's important to conditionalise any state change in `componentDidUpdate`. The lifecycle method will be called with two useful arguments to this effect: the **previous props** and the **previous state** of your application before the last render. You can check your new props / state against these to determine whether you want to make a further API call or any other action.
## Resources
- [Embedded Routers](https://reach.tech/router/example/embedded-routers)
- [componentDidUpdate](https://reactjs.org/docs/react-component.html#componentdidupdate)
- [Fragments](https://reactjs.org/docs/fragments.html)
- [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [Reach Router - navigate](https://reach.tech/router/api/navigate)