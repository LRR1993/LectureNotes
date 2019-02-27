// intro to filter

// falsy values
    // false
    // undefined
    // Nan
    // null
    // 0
    // ''


// 1. It always returns an new array -> YOU SHOULD NOT MUTATE YOUR ORGINAL ARRAY
// 2. Less than or equal to the orginal array
// 3. The function we pass to filter is called a predicate (on the basis of something is truthy or flasy)
        // if teh value the predicate return is true/truthy, it will push the element to the array
        // otherwise will ignore it
// 4.  the predicate takes 3 [params] -> element, index, orginal array


const nums = [1,2,3,4,5]
//const output = nums.filter(() => true) // output return the array but is different

const isOdd = nums.filter(num => num % 2) //eval if truthy

const tutors = ['sam', 'mitch', 'bill','bob', 'tim', 'jake'];
const res = tutors.filter((_,index)=> {
   return index % 3 || index === 0 // index invoked, removing every third person
});

const dupes = ['sam', 'mitch', 'bill','bob', 'tim', 'jake','bob', 'tim', 'jake'];
const dedupes = dupes.filter((el,index, arr) => {
    return index === arr.indexOf(el); // removes duplicates, checks what orginal array and index of that.
})