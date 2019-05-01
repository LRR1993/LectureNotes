# Optimistic Rendering With React

## Prior knowledge

- understanding of HTTP requests and responses
- understand and implementing asynchronous code flow in React

## Learning objectives

- how to optimistically render information based on the assumption of successful network requests
- understand the implications of adopting optimistic rendering
- know how to use state to maintain representation of async data

## Background

**Optimistic rendering** refers to the principle of rendering information based on the assumption from the front-end that things will happen as hoped at the back-end. Practically, this means not awaiting responses from api requests before making changes (for example, setting state).

It should be clear that this approach should be avoided in some circumstances - financial transactions, for examples, should never give the indication that something has happened when it hasn't, or vice versa. But there may be advantages in some cases to adopting the optimistic rendering approach.

## Adapting code for optimistic rendering

Here is a non-optimistically rendered example of a component showing how many messages have been sent:

```js
class MessageStats extends React.Component {
  state = {
    sentMessageCount: 0
  };

  componentDidMount() {
    api.getSentMessageCount().then(sentMessageCount => {
      this.setState({ sentMessageCount });
    });
  }

  handleSendMessageClick = () => {
    api.sendMessage().then(({sentMessageCount}) => {
      this.setState({ sentMessageCount });
    })
  };

  render() {
    return (
      // component html/css, including...
      <button onClick={this.handleSendMessageClick}>Send message</button>
    );
  }
}
```

In this example, the `sentMessageCount` value is updated on two occasions:

- in `componentDidMount` (presumably on the page loading)
- when the user sends a message, via the `sendMessage` api function.

When we set the state after the user sends a message, we will be using the latest data from the database. However, if this were a 'real world' application, with many simultaneous users, the latest `sentMessageCount` may have jumped considerably in the time between the component mounting and the messages being sent.

At this point, as developers, we need to decide what we are trying to present here: a factual report of how many messages have been sent at that moment, or the impression that a user has had an impact by pressing the button. If it is the latter, then seeing the number increment by one might be more effective. This is demonstrated below:

```js
handleSendMessageClick = () => {
  api.sendMessage().then(() => {
    this.setState(prevState => {
      return {
        sentMessageCount: prevState.sentMessageCount + 1
      }
    });
  })
};
```

The new `sentMessageCount` here will not be an accurate representation of the state of our database, but may feel more natural to user.

If we are to adopt this approach, then we should consider if we should be waiting for the response from the api in the first place. We are not using any of the data that is being returned, so we can consider an alternative:

```js
handleSendMessageClick = () => {
  api.sendMessage()
  this.setState(prevState => {
    return {
      sentMessageCount: prevState.sentMessageCount + 1
    }
  });
};
```

To summarise the differences between these approaches:

| **Optimistic rendering**                                   | **Rendering on response**                                        |
| ---------------------------------------------------------- | ---------------------------------------------------------------- |
| Both `setState` and the API request trigger simultaneously | `setState` only happens after the API response                   |
| Cannot use data from the API response                      | Data from the API response is available                          |
| Both actions will always trigger                           | `setState` will only trigger if the API response is not an error |
| Cannot accurately represent the database                   | Can accurately represent the database at the time of reponse     |

It is of course possible to use elements of both approaches. You may wish to have some effect immediately on triggering the handler - for example, disabling a button to prevent multiple requests from being made. You can also undo state changes should a request fail. If so, you will need to think carefully how to achieve this gracefully and without disorienting a user.

### Potential data states

When dealing with async data, a common pattern to have in state is:

```js
state = {
  data: null,
  loading: true,
  error: null
};
```

We can conditionally render based on all sorts of things here. We just have to remember to set `loading` to true before we make the API request, and set `data` or `error` accordingly depending on whether it is successful or not.

**Note:** This is a good example of why it is good to _componentise_ our application as much as possible. Holding multiple `data`, `loading` and `error`s in one state could easily get confusing.


