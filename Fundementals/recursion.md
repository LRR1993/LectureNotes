# Recursion

## Pre-knowledge

- Understand how functions are called.
- Understand that function invocations are added to the call stack and the nature of the call stack (**LIFO**).

## Takeaways

- the key features of recursive functions (base case, recursive case, recursive step)
- considerations and approaches when writing recursive solutions
- understanding when recursive solutions are necessary

## Background

When we talk about **recursion**, in programming terms, we are talking about **recursive functions**. A recursive function is a function that makes a call to itself.

The two following examples have the same result - they calculate the factorial on a number (the product of all integers from 1 to _n_).

### Example: factorial ()

```javascript
function factorial(n) {
  let total = 1;
  for (n; n > 1; n--) {
    total *= n;
  }
  return total;
}

function recursiveFactorial(n) {
  if (n === 1) return n;
  return n * recursiveFactorial(n - 1);
}
```

Consider some of the differences between these solutions:

- the recursive solution is clearly shorter and more concise.
- the recursive solution is arguably more readable - there are fewer variables with unclear purposes.
- the recursive solution will be more costly, due to function calls being added to the stack.

As a developer, your focus should always be on the _development_ of the code - performance is a secondary consideration. If performance is an issue, this can be addressed in performance testing.

### Key features of recursion

#### Base case

A function that can call itself also needs a reason _not_ to call itself, else invocations will keep getting added to the stack (**stack overflow**). Therefore a recursive function needs a **base case** (or **exit case**) - a condition in which the function can return, and stop calling tiself.

#### Recursive case

The function also needs a reason to call itself. Recursive behaviour might be useful for constructing an object, keeping a total, finding a value, or a number of other reasons. The nature of the recursive case will determine the conditions and arguments with which the function is called.

#### Recursive step

The recursive case needs to move the problem towards the base case, else the function will error out in the same way as if there was no base case. As such, the problem needs to be broken down, minimized, modified with each subsequent call to the function. Each recursive call should be edging you nearer to your base case.

### Example: sum()

```javascript
function sum(n) {
  if (n <= 1) return n;
  return n + sum(n - 1);
}
```

This is a successful recursive solution because:

- the first line describes a conditional base case, in which the function returns.
- the second line shows how our total is constructed - by adding the recursive call to the number that has been passed in as an argument.
- by reducing the value of the the recursive call's argument (`n - 1`), each subsequent invocation takes it closer to the base case.

When writing - and more importantly, _testing_ - a recursive function, it's often sensible to consider the base case first. You can ensure that your function works correctly by thinking about the situation in which it _won't_ need to call itself first.

### The call stack

When you ask your computer to invoke a function, it 'pushes' this function to something the **call stack**. The call stack operates on a _last in, first out_ principle (_LIFO_). The common analogy is a stack of plates: the last plate to be added must be the first to be washed. As soon as a new function is pushed to the call stack, it must return and 'pop' off the call stack before the next function down can continue.

In recursion, you may have several invocations stacking up, waiting for one to resolve when the base case is finally met, allowing all the previous invocations to finally evaluate and resolve too.

### Examples: countLength(), reverse()

Though recursion is relatively simple to understand with numbers, we can use it as an approach with any data type. If we are to imagine a JS world where the length property of a string doesn't exist, we could use recursion to count its length:

A function that counts the length of a string recursively:

```javascript
function countLength(str) {
  if ((str = "")) return 0;
  return 1 + countLength(str.slice(1));
}
```

A function that reverses a string recursively:

```javascript
function reverse(str) {
  if (str.length < 2) return str;
  return str.slice(-1) + reverse(str.slice(0, -1));
}
```

In both of these examples, we are using `.slice` to make our recursive step towards our base case - a short enough string to not need counting / reversing any longer. We build up our ultimate solution by adding or appending the result of our recursive calls to the desired value we got out of that call - in `countLength()`, it is `1`; in `reverse()` it is `str.slice(-1)`.

### Recursion as the only solution

All the exmaples so far have had alternative (and often better) solutions. However, recursion is the only solution for objects/arrays which are nested data structures that we may need to inspect deeply, but not know how deeply.

Consider this implementation of `countInstances`, which looks through an array and counts the number of times the value appears in that array. For this, no recursion is necessary.

```javascript
function countInstances(arr, value) {
  let total = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) total++;
  }

  return total;
}
```

But we are only checking the equality of each iterated value against the value passed in as an argument. If the iterated value was another array we wanted to look inside, this equality check would not suffice. However, this _would_ be a sensible, testable initial behaviour, from which we can implement TDD.

Thankfully, we have already written a function that counts the instances inside the inner array - it's the same function we've just written. We just need to describe the condition in which this function should call itself:

```javascript
function countInstances(arr, value) {
  let total = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) total++;
    if (Array.isArray(arr[i])) total += search(arr[i], value);
  }

  return total;
}
```

Now, we check two things for each item in the array - we add 1 to our result if we come across the desired item, but instead of ignoring array as if they were any other undesired value, we call our function again on them, and add whatever they eventually return - even if they themselves make further recursive calls - to our total.

It may not be as obvious, but this function still has all the key features of recursion - they are just hidden away in the syntax of the for loop:

- `i < arr.length`, or the 'while' condition of our for loop, describes the base case. When there is no more array the iterate over, the function can return and there will be no more recursive calls.
- `i++` denotes our recursive step, taking us closer towards the end of the array, and the base case.
