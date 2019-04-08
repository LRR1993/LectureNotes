### Reduce

## Re-cap

- In which cases are `map` and `filter` the most appropriate array method?
- What are some of the key benefits of these array methods?
- What will they always return ?

## Motivation

- What do the following examples have in common:

```js
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const getTotal = arr => {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
};
const total = getTotal(nums);
// 55
```

```js
const pets = ["dog", "cat", "dog", "dog", "rabbit", "dog", "cat", "snake"];

const getPetsTally = arr => {
  const petTally = {};
  for (let i = 0; i < arr.length; i++) {
    const pet = arr[i];
    if (petTally[pet] === undefined) petTally[pet] = 1;
    else petTally[pet]++;
  }
  return petTally;
};
const petTally = getPetsTally(pets);
// {dog : 4, cat : 2, rabbit : 1, snake : 1}
```

- On the surface of things, these examples look totally different. One is creating an object and one is creating a number that represents the total of all the numbers in the array.

- However, they do share several things in common. We start with some variable : be it an **empty object** or a number like **0**. Over the course of the iteration (the `for` loop) this variable is updated in someway. We can call this variable the **accumulator**.

- At the end of both examples the **accumulator** is returned out of the function. So how could we create a more general function that could allow us to do the same thing in both cases ?

- We could create a function that takes three arguments:
  - The array to iterate over
  - A **function** : this iteratee will be responsbile for updating the accumulator during each iteration.
  - Finally, we can pass in the inital value of the **accumulator**

```js
const createAcc = (arr, updateAccumulator, accumulator) => {
  for (let i = 0; i < arr.length; i++) {
    accumulator = updateAccumulator(accumulator, arr[i]);
  }
  return accumulator;
};
```

- On line 53, we are re-assigning the accumulator to be the return value of `updateAccumulator` : some function that is going to be passed the **accumulator** and the **current array element** during each stage of the iteration.

```js
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const addNums = (acc, num) => acc + num;

const total = createAcc(nums, addNums, 0);
```

```js
const pets = ["dog", "cat", "dog", "dog", "rabbit", "dog", "cat", "snake"];

const updateTally = (tally, pet) => {
  if (!tally[pet]) tally[pet] = 1;
  else tally[pet]++;
  return tally;
};

const petTally = createAcc(pets, updateTally, {});
```

- Now we can use a function to update the tally object during each round of iteration.

- It is **essential** that the `updateTally` function returns something. If this function doesn't return anything then what will happen to the **acccumulator**?

- In both cases, the `addNums` function and the `udpateTally` function will be passed the accumulator as the first argument and the current array element as the second argument.

## reduce

- In practice, `createAcc` is a very crude implementation of `reduce`. Reduce is a native JS array method that we can use to reduce **ANY** data type - this is all depends on what we initalise the accumulator to be!

- The above examples would look like the following if we used reduce:

```js
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const addNums = (acc, num) => acc + num;

const total = nums.reduce(addNums, 0);
```

We would even write :

```js
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const total = nums.reduce((acc, num) => acc + num, 0);
```

In the example above, we don't have a separate reference for the iteratee : we just pass it straight into the reduce. Note how now we are also invoking reduce as a method on the array.

- The second example from before would now look like this:

```js
const pets = ["dog", "cat", "dog", "dog", "rabbit", "dog", "cat", "snake"];

const petTally = pets.reduce((tally, pet) => {
  if (!tally[pet]) tally[pet] = 1;
  else tally[pet]++;
  return tally;
}, {});
```
