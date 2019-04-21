# Fetching Data in a React App

So far we have been using a lot of data in our applications that we have hardcoded ourselves in our apps. But a big part of web development involves using data that other people have collected and are hosting on their servers.

## Google Books

The Google books api is an easy one to implement here as it requires no authetication - as long as you have a user's id and their bookshelf id, you can see what they have put on that bookshelf.

As always draw up a sketch first, separating out the components, the state they need to interact with and the methods to alter that state.

`npx create-react-app <proj-name>`, to start the project.

One thing we'll need to be able to do is fetch the books from the api. Here's a version that uses [axios](https://github.com/axios/axios) but you could use any package that makes http requests / the browser [fetch api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

```js
  fetchBooks = async () => {
    const { topic } = this.state;
    const { data } = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${topic}`
    );
    return data.items;
  };
```

This is an action we want to undertake straight away, so the correct place for this is `componentDidMount`. We want to do this in our `App` class because this book information will be needed by our Chart and Books components.

```js
 componentDidMount = async () => {
    const books = await this.fetchBooks();
    this.setState({
      books
    });
  };
```

Books will be in state as an array, so we can map through that to render our books. However, depending on our initial state definitions, we may get a Type Error. If what we passed to the Books component is initially not an array, then it cannot be mapped - our asynchronous state setting doesn't happen immediately.

Two approaches to this issue:
* set up an initial state of `{books : []}` in App. This won't display anything as it's empty, but mapping an empty array isn't a problem. When the state gets replaced with a new array, we're still happy.
* or, conditionally render Books only when the data has been fetched

```js
{
  !this.state.loading && <Books books={books} />;
}
```

...the difference being that the first will create the component immediately, but not display anything until it receives a filled array, whereas the second does not mount the component until the array is created.

## Chart.js

There is no shame on building on the code written by other people - to create a Pie Chart from scratch would be a foolish errand if we can utilise others. This example uses `react-chart-js2` - a quick look at the docs will show how to get this going. Here's an example hidden away in their [GitHub](https://github.com/jerairrest/react-chartjs-2/blob/master/example/src/components/pie.js). This shows how a pie chart expects to receive its data.

We can see that our Pie Chart expects to receive a prop called `data`, so below is a function that takes our state of books and formats it in the correct way. But the takeaway here is that sometimes you will be in the position of receiving data in a format outside your control, then massaging it into new data required in another format, again outside your control.

```js
  const tally = books.reduce((acc, book) => {
    // tally required data
  }, {});

  const data = {
    labels: Object.keys(tally),
    datasets: [
      {
        data: Object.values(tally),
        backgroundColor: Object.keys(tally).map(() => faker.commerce.color())
      }
    ]
  };
  return data;
```

(This is an ugly function but that is sometimes the case when you have data come back in a form you don't control and you want to send it on to something else again in a different format you don't control.)

This logic can be extracted into a util to keep our render nice and clean:
```js
import { formatPieData } from '../utils/charts.js'

const Chart = ({ books }) => {
  return (
    <div className="chart-wrapper">
      <Pie data={formatPieData(books)} />
    </div>
  );
};
```

For named exports simply export the varaible instead of exporting a default.

```js
export const formatPieData = books => {
  // formatting here...
}
```