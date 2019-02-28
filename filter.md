Filter

```js
const filter (arr, predicate) => {
  const output = [];
  for (let i = 0; i < arr.length; i++){
    if (predicate(arr[i],i,arr)) output.push((arr[i])) //can take index and orginal array
  }
  return output
};
const nums = [1,2,3,4,5]
const isEven = n => n%2 ===0

const evenNums = filter(nums,isEven)
```
