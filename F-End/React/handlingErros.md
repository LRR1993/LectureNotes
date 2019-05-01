# Dr 404, Or How I Learned To Stop Worrying and Handle Errors with React and Reach Router

When working with a front end connected to an API / some APIs, sometimes things go wrong.

- An incorrect id is entered in the URL, so an article is requested that doesn't exist.
- A link exists that points somewhere, but the document has been moved to another location.
- The server isn't working as it normally should.
- A user isn't authorised to access a resource.
- The request in the URL is badly formatted in some way.

With a bit of luck and a well designed back end, these will come with an error code (4xx or 5xx). First consider what would happen if an entity of yours - such as an article - failed to return. How would that impact your render? Will you be trying to access properties that don't exist / are undefined? Worse, access properties of _those_ properties, which will lead to a Type Error?

Clearly we need to handle these catches on the front end, and provide sensible feedback to the user. `console.log` won't cut it - we can't expect a user to open the console and see what has happened.

```js
class Page extends React.Component {
  state = {
    stuff: null,
    err: null
  };

  componentDidMount = prevProps => {
    this.fetchContent(this.props.stuffId);
  };

  fetchContent = id => {
    axios
      .get(`https://www.myserver.com/api/stuff/${this.props.stuffId}`)
      .then(stuff => {
        this.setState({
          stuff
        });
      })
      .catch(err => {
        this.setState({
          err
        });
      });
  };

  render() {
    const { err, stuff } = this.state;
    if (err) return <Err />;
    return <Stuff />;
  }
}
```

In this situation, our external api request either works or doesn't. If it doesn't, we record this in state, and on the re-render, we spot that there is an error and render an error component instead of the regular stuff. This is perfectly adequate, but we perhaps have other methods at our disposal. What if we want to have render all 404 errors on a particular route?

Reach comes with a `navigate` prop, which is tied into the browser history API. We can use this to automagically take us to a new path.

n.b. If your component isn't a child of a router you can import navigate directly from reach.

```js
import { navigate } from '@reach/router';
```

```js
fetchContent = id => {
  axios
    .get(`https://www.myserver.com/api/stuff/${this.props.stuffId}`)
    .then(stuff => {
      this.setState({
        stuff
      });
    })
    .catch(err => {
      navigate('/error');
      // this requires an error component set up on this route
    });
};

// Router
<Router>
  <Error path="/error" default />
</Router>;
```

This changes the url and therefore the route that gets rendered in your application. There is a snag here - as the new url is `push`ed to the history of your browser. Navigating back in the browser will take you to the incorrect url that took you to 404 in the first place. Thus you enter an inescapable loop of doom.

To handle this, Reach Router gives us a simple option.
`navigate` takes a second argument that allows us to replace the previous url in the browser's history.

```js
navigate('/error', { replace: true });
```

If we want some custom props available to us in the "error" component - we can pass `navigate` some extra information in this second argument. Confusingly enough, this prop is called `state`:

```js
navigate('/error', {
  replace: true,
  state: {
    code: err.code,
    message: err.message,
    from: '/articles'
  }
});
```

- NOTE: The Reach Router docs are currently incorrect when detailing how to pass extra information through via navigate.