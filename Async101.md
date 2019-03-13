# Async 101

## Presuppositions

- Be able to follow the thread of execution in syncronous code.
- Understand the concept of functions as first class citizens. (Passing functions particularly).
- Higher order functions that take a function as an argument.

## Takeaways

- Async functions cannot use return statements. They use a callback function instead.
- An error-first callback function will always take an error as the first argument, any data thereafter.
- Javascript is run to completion. All syncronous code will execute before any async.

# Notes

How many things can I do in Javascript at once? One. Why? Because it's single threaded.

As we've understood with our examples so far, that means doing one line of code at a time.

But we've reached the limits of this linear, synchronous way of thinking about things.

For example, what if I was building a portfolio page that displayed some of my tweets. I sent off a request to fetch my tweets, and wanted to do something with that information when it came back?

Well, that's going to take time. Make a request to Twitter's API is not instantaneous. So we have a problem. If we followed the normal, linear way of following code that we have so far, how could we stop the functionality for displaying the tweets from firing before we have the tweets back?

Let's look an example of asynchronicity on a smaller scale, to see if we can get any ideas.

So let's think this code to refresh our memory.

```js
console.log('me first!');
console.log('me second!');
```

How could we cause the second console log to wait 1 second after the first is logged to the console?

```js
function blockForOneSecond() {
  // clue: console.log(Date.now()); ms from 1 Jan 1970
  // when timestamp is X seconds later, STOP!
  const startTime = Date.now();
  while (Date.now() < startTime + 1000) {
    // do nothing
  }
}

console.log('me first!');
blockForOneSecond();
console.log('me second!');
```

This is **blocking** code. Our code is read linearly, so the second console log will not happen until after the while loop inside `blockForOneSecond` ends.

Now let's look at this example:

```js
console.log('me first!');

setTimeout(() => {
  console.log('me second!');
}, 1000);
```

So here, we wait 1000 milliseconds before we get the me second console log. Hopefully nothing too surprising here.

But what happens if I do this?

```js
setTimeout(() => {
  console.log('me second!');
}, 1000);

console.log('me first!');
```

Okay... that's puzzling. Now what happens when I do this? What does this tell us about setTimeout?
It is **non-blocking**.

Ok,

```js
setTimeout(() => {
  console.log('me second!');
}, 0);

console.log('me first!');
```

WHAT JUST HAPPENED??

Clearly our current understanding of Javascript is no longer sufficient. `me first` is running before `me second`. This is called **non-blocking** code. I.e. Our javascript has done something with our setTimeout, and will come back to it later. It's carried on reading the rest of the code in a synchronous, linear manner.

Currently we understand our code with:

- The thread of execution
- The VE
- The Call-stack

In order to understand async code to the same degree, we're going to have to add some new tools to our kit. They are:

- Browser / Node background threads
- Callback / Message / Task Queue
- The event loop

## Background Threads

So it's clear from our example that something peculiar is happening. The first new tool we're going to need to understand is background threads.

When we call setTimeout, it clearly isn't going onto our call-stack. It's actually making a call to either the browser API or Node.

Let's go back to our simpler example for the time being.

```js
console.log('me first!');

setTimeout(() => {
  console.log('me second!');
}, 1000);
```

The function we have passed it is stored against that timer on the node api. The background thread running it can now keep checking the timer, and when it is finished, mark the function as ready to be invoked.

When we trigger a timer, something in the background of JS, called the event loop, starts spinning. Whilst spinning, it checks every async process in the node api and any that are ready are picked up by the event loop.

Once picked up, they are enqueued into the task queue, a queue data structure, just as you made the other day.

The function is now ready to be pushed to the stack. However, stacks operate in order, we can't just insert our function as soon as it's ready, we have to wait until the stack is empty. **Including having global popped off**. This is called **running to completion**.

If the stack is empty, our function is pushed and executed in the normal fashion, and we see our console log.

So what if we set the timer to 0?

```js
setTimeout(() => {
  console.log('me second!');
}, 0);

console.log('me first!');
```

Still in order! Because js is run to completion, all async processes will happen after all of the sync processes.

So even though the timer is set to zero, and immediately triggers, it still has to wait in the task queue until everything else has finished. So if I called a thousand functions in the rest of the global, that took ten minutes to run, that 0 second timer would still fire afterwards.

- Below is an example illustrating nested async processes. What order do we expect to see the console.logs?! 1, 3, 2

```js
console.log(1);
setTimeout(() => {
  console.log(2);
}, 1000);
console.log(3);
```

And these? 1, 5, 2, 4, 3

```js
console.log(1);
setTimeout(() => {
  console.log(2);
  setTimeout(() => {
    console.log(3);
  }, 1000);
  console.log(4);
}, 1000);
console.log(5);
```

# Sources of asynchronicity

There are 5 main sources of asynchronous code;

1.  User interactions
2.  Network I/O
3.  Disk I/O
4.  IPC - Interprocess communication i.e. web workers
5.  Timers

# Callbacks

## The need for callbacks

What will the code below output:

```js
const getMP3 = title => {
  return `${title}.MP3`;
};
const ninetiesClassic = getMP3('Rhythm of the night');
console.log(ninetiesClassic);
```

We would expect to see an output of `'Rhythm of the night.MP3'`.
We can save the return value of `getMP3` into a variable and access it afterwards. This is only possible because the above code is synchronous.

How about an example where getMP3 is made asynchronous using `setTimeout`?

This mimics the behaviour that we would expect from making a request for some data (an mp3 file in our example) across the internet, or from a database - it takes time for us to get the response / data.

```js
const getMP3 = title => {
  setTimeout(() => {
    return `${title}.MP3`;
  }, Math.random() * 5000);
};
const ninetiesClassic = getMP3('Rhythm of the night');
console.log(ninetiesClassic);
```

What will the output be for the above code? We end up seeing `undefined` for the console.log of `ninetiesClassic`. There is **NO** explicit return statement in the execution context of `getMP3` : it simply invokes `setTimeout`. So we can no longer rely on saving information in variables when we call functions.

Students will often try to return the call to timeout. Explain that return is syncronous and will not work. All syncrnous methods relying on return values are out of the window for dealing with async code. An async function will have no meaningful return value.

## The solution - callbacks

We can add an extra parameter to getMP3 - something like `handleMP3`.
This parameter is a placeholder for a **callback function**.
Callbacks are just functions that are pieces of code that may be executed at some point in the future. Not all callbacks are async, for example, your forEach functions in lowbar all took a callback but due to the nature of the code, it worked synchronously. Whatever we would like to do with the MP3 once it has come back, we will do in the `handleMP3` function. See below:

```js
const getMP3 = (title, handleMP3) => {
  setTimeout(() => {
    handleMP3(`${title}.MP3`);
  }, Math.random() * 5000);
};

getMP3('Rhythm of the night', mp3 => {
  console.log(`La La La...${mp3} ... La La La`);
});
```

The second argument is a callback function. It will be executed at a future point after the function passed to `setTimeout` has timed out. When the callback is invoked we can then go and on and do what we want with the MP3.

Callbacks give us a way to be able to use asynchronous processes and then continue to work on the results after the function has finished. You might notice here that we don't return anything here. That's because the return value is actually irrelevant. We can only use the MP3 in our callback.

## Error-first callbacks

The convention for asynchronous callbacks is to write them **error-first**. This is in order to ensure uniformity across async callbacks, and ensure that errors aren't forgotten.

Don't forget with `setTimeout` we're merely simulating a request to a server.

```js
const getMP3 = (title, handleMP3) => {
  setTimeout(() => {
    if (typeof title !== 'string') handleMP3('Invalid title format');
    else handleMP3(null, `${title}.MP3`);
  }, Math.random() * 5000);
};

getMP3('Rhythm of the night', (err, mp3) => {
  console.log(`La La La...${mp3} ... La La La`);
});
```

When we **declare** the callback function: it must have a first parameter off `err`

When we **invoke** the callback function: this is where we must actually pass an argument to say what `err` is going to be.

```js
const getMP3 = (title, handleMP3) => {
  setTimeout(() => {
    if (typeof title !== 'string') handleMP3('Invalid title format');
    else handleMP3(null, `${title}.MP3`);
  }, Math.random() * 5000);
};

getMP3('Rhythm of the night', (err, mp3) => {
  console.log(`La La La...${mp3} ... La La La`);
});
```

Just as with higher order functions, whenever we take a function as an argument, we pass an anoymous arrow function to use.

- It is very easy when using higher order functions to blur the lines between the parameters of the function itself and the function you pass it. Map take **one** argument, which is a **function**. Filter takes **one** argument. Those functions are invoked with **three** arguments. (element, index, array) Reduce takes **two** arguments, a **function** and an initial accumulator.

- Here getMP3 takes **two** arguments.

1. A title (String)
2. A callback (Function)

- The callback itself also takes two arguments.

1. error
2. mp3

Being clear about this distinction is crucial to understanding how callbacks work. Pass one function to use as the callback. That function will be invoked with the results of the async function.

## Testing

Mocha uses done which is a function that is passed in as an argument to the it callback function. Mocha runs test automatically as if it was sync and by using done, it tells mocha that your code is async and therefore makes it wait for a response. It will wait for a certain amount of time, but it also has a default timeout period, so if you get this error and your pretty certain your code should work, have a google about this and see what you find (i.e. you may need to make the timeout period longer)

## KEY-TERMS

After today you should all be more comfortable with some of the buzzwords you hear about JS

- Callbacks
- Non-blocking / blocking
- Asynchronous
- Run-to-completion
- Event loop, queue and call-stack
