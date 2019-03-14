# Async 102

## Recap

- Blocking - something wont run until something else is finished
- Synchoronous - run to completion, done sequentially
- Aynchoronous - things dont run in order
- Singly threaded - only one callstack where things can be exceted (things have to run in order)
- Event Loop - controller of the async data
- Callback function - function that our data is invoked in at a point, we necessarily dont have control over
- I/O - input:output

#### Solution/Problem

- get pizzabyid from ultility server
- utility server takes id and callback function

```js
const { getPizzaById } = require('./ultis/index.js');

// 1st arg - pizza array of index
// 2nd arg - cb func - invoke pizza index, when info is obtained
// cb func two arg - err pizza info
// innvoke getPizzaById for each id in array

const fectchPizzas = function(pizzaIds, getPizzas) {
  const pizzaArr = [];
  pizzaIds.forEach(pizza =>
    getPizzaById(pizza, (err, pizzaInfo) => {
      if (err) {
        getPizzas(err);
      } else {
        pizzaArr.push(...pizzaInfo);
        if (pizzaArr.length === pizzaIds.length) getPizzas(null, pizzaArr);
      }
    })
  );
};

module.exports = { fectchPizzas };
```

#### Testing

-refer to mocha spec fo async"
