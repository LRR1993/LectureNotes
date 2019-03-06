# Closure

## Presuppositions

- An understanding of how varaibles are looked up in javascript according to the rules of scope.
- Higher order functions are functions that either take a function as an argument or return a function.

## Takeaways

- If a variable is in scope. That variable is always accessible, regardless of which execution context the thread is currently in.
- Functions can carry a set of private variables in their COVE (closed over variable enviroments) that only they have access to.
- The rules of scope still apply, even if the execution context they are next looking in is closed.

## Re-cap example

When we've been through examples in the past, where we've looked at the call stack, the thread and memory.

So let's go over this one.

```js
function incrementCounter() {
  let count = 0;
  return ++count;
}

incrementCounter();
incrementCounter();
```

What happens when I call this function? It returns one.

What happens if I call incrementCounter twice? It returns one each time

When I return inside that function, what happens to its local memory/variable environment?

It's gone. Javascript has something in the background called the garbage collector, which comes along and sweeps up all the data that isn't being used. Javascript does this automatically, but lots of other languages don't. If you end up programming in another language, you may have to do this manually!

So this is very useful. But what if my function was doing something ridiculously strenuous. For example, I created a function to find the 1000th prime number. There's no way to do that without brute force. So what if I do all the work for that, and then call the function again?

I'm going to have to do all of that work again!

What if there was a way to give a function a memory; a way to remember what is was called with?

Well, there is. And it's called closure.

## Returning Functions

Now, before I get into the meat of this topic I want to touch briefly on returning functions. We've dealt with the side of higher order functions where we pass functions as arguments, but we have yet to return any. So, let's do two simple examples to get into the swing of it.

Explain console.log is a function.

```js
function returnEcho() {
  return console.log;
}

const echo = returnEcho();
echo("hello Northcoders!");
```

Go through line by line:

What happens when we go through this with VE, callstack and thread in mind?

1. We create a function called returnEcho in the global VE
2. We create a variable called echo in the global VE. It's currently .... undefined pending what? Pending the call to returnEcho.
3.

```js
function returnTimesTwo() {
  return function(n) {
    return n * 2;
  };
}

const timesTwo = returnTimesTwo();
console.log(timesTwo);
console.log(timesTwo(2));
```

## Closure Enlightenment

Closure is not a special feature of the language that you choose to use when convenient. Closure is all around you in JavaScript, you just have to recognise it and embrace it. Closure happens as a result of writing code that relies on lexical scope. It just happens.

So, let's show an example by adapting what we've just written.

```javascript
function returnTimesMult(mult) {
  return function(n) {
    return n * mult;
  };
}

const timesTwo = returnTimesMult(2);
console.log(timesTwo(2));
const timesThree = returnTimesMult(3);
console.log(timesThree(2));
```

So what does this show us? When we define a function, it MUST have access to the variable environment within its scope. This is called a COVE, or a closed over variable environment. In a course I watched, this was described as a little backpack that follows the function around, which is a nice way of thinking about it. Let's have a look at another example.

Now look at this:

```javascript
function foo() {
  let a = 2;
  function bar() {
    console.log(a);
  }
  return bar;
}

const baz = foo();
baz(); // 2
```

`bar` has lexical scope access to the inner scope of `foo`. But then, we take `bar`, the function itself, and pass it as a value. In this case we `return` the function object itself that `bar` references.

After we call `foo`, we assign the value it returned (our inner `bar` ) to a variable called `baz`, and we actually invoke `baz`, which of course is invoking our inner function `bar`, just by a different identifier.

`bar` is executed, but outside of its declared lexical scope.

After `foo` executed, normally we would expect that the entirety of the inner scope of `foo` would go away, because we know that the engine employs a Garbage Collector that comes along and frees up memory once it’s no longer in use. Since it would appear that the contents of `foo` are no longer in use, it would seem natural that they should be considered gone.

But the “magic” of closures does not let this happen. That inner scope is in fact still “in use”, and thus does not go away. Who’s using it? The function `bar` itself, which we know in the global execution context as `baz`.

**Important:** `baz` still has a reference to its lexical scope, and that reference is called closure.

The function is being invoked well outside of its author-time lexical scope. Closure lets the function continue to access the lexical scope it was defined in at author-time.

**Definition:** Closure is when a function is able to remember and access its lexical scope even when that function is executing outside its lexical scope.

**Definition:** A closure is a function bundled together with references to it’s surrounding state (lexical environment/scope). Simply define a function inside another function and expose the inner function. The inner function will have access to the variables in the outer function’s scope. Forever.

**Definition:** A closure is a stateful function. We usually think of functions as use once and discard pieces of code. Once they finish executing they are as good as dead. We can use them again, but they always start from a blank slate. With closure we can make functions “remember” the environment in which they were created.

Look back at this:

```javascript
function foo() {
  var a = 2;
  function bar() {
    console.log(a); // 2
  }
  bar();
}
foo();
```

`bar` has access to the variable `a` in the outer enclosing scope because of lexical scope. Is this “closure”?

Maybe, but not exactly. Access via lexical scope is only part of what closure is. Technically speaking, `bar` has a closure over the scope of `foo` . But, closure defined this way is not directly observable, because when we call `bar` we're still in the scope where `a` is accessible and we aren't witnessing anything surprising. What differentiates closure is what happens when you call `bar` somewhere else, where you might not expect it to have closure over `a`.

## A useful example and a new principle

Here's an example of a function that returns a function which may only be called once:

```js
function makeCounter() {
  let counter = 0;
  return function() {
    return ++counter;
  };
}

const increaseCounter = makeCounter();
console.log(increaseCounter());
console.log(increaseCounter());
```

Here we have created a count function, whose count is persistent in its COVE. Every time we call it, it looks inside its lexical scope, finds the count and increments it by one.

Can we modify this counter? We cannot modify it in any way other than by using the function. It's now what's known as a private variable.

What happens if I call a new makeCounter? It will have a new lexical scope, in which the counter will once again be zero. So we can have two separate counters.

Finally, how would I make a function that takes a function as its argument, and allows it to only be called once?

```javascript
function callOnceOnly(func) {
  let isFirstTime = true;

  return function() {
    if (isFirstTime) {
      isFirstTime = false;
      return func();
    }
  };
}

function logger() {
  console.log("Hello world");
}

const singleLog = callOnceOnly(logger);

singleLog(); // Hello world
singleLog();
```

Can we access `firstTime`?
Can someone change it from the outside?

In what lexical scope is `singleLog` called?
In what lexical scope is `singleLog` defined?

### Principle of Least Privilege

In the design of software, you should expose only what is minimally necessary and hide everything else.

Of course, any of the various ways that functions can be passed around as values, and indeed invoked in other locations, are all examples of observing/exercising closure.

```javascript
function createMultiplier(m) {
  return function(n) {
    return m * n;
  };
}
const double = createMultiplier(2);
const triple = createMultiplier(3);
double(5); // 10
triple(5); // 15
```

In this example, the anonymous function that we return has closure over the scope of `createMultiplier`

```javascript
const createSecret = function(secret) {
  const secretHolder = {
    check: function(word) {
      return word === secret;
    }
  };

  return secretHolder;
};

const postItNote = createSecret("12345");

postItNote.check("12345"); // true
```

In this example, the `.check` method is defined inside the scope of `createSecret` , which gives it access to any variables from `createSecret()` and makes it a privileged method (i.e. it has access to private data through closure).

### Example:

Underscore’s `once()` and `after()`

### Sources:

- [Kyle Simpson’s YDKJS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch5.md)
- [Master the JS Interview: What is a Closure? by Eric Elliot](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-closure-b2f0d2152b36#.szp9dswih)
