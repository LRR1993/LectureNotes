Map Explained

array and fucntion included

```js
const double = n => n * 2;

const map = (arr,func) = {
  const output = [];
  for (let i = 0; i < arr.length; i++){
    output.push(func(arr[i]))
  }
  return output
};

const a = map([1,2,3,4,5], double)
console.log(a)

```

index included within map

```js
const timesByIndex = n => n * index;

const map = (arr,func) = {
  const output = [];
  for (let i = 0; i < arr.length; i++){
    output.push(func(arr[i],i))
  }
  return output
};

const a = map([1,2,3,4,5], timesByIndex)
console.log(a)

```
