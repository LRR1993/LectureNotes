/// Into to map

// 1. it returns a new array - IT SHOULD NOT MUTATE AN ORGINAL ARAAR
// 2. the output array is always teh same as the input length
// 3. the function we pass to map has three params -> element, index, array

const tutors = ['sam', 'mitch', 'bill']

//const output = tutors.map(function({})) // WILL RETURN A NEW ARRAY OF UNDEFINED

/* breakdown of map
const output = tutors.map( iteratee)
iteratee = (Element, index, array) => { // stuff to mutate and create a new array}
*/

//const tutorsButLouder = tutors.map(tutor => tutor.toUpperCase()); // arraow function of new array
//console.log(tutorsButLouder) // prints caps of tutors

//const tutorsandindex = tutors.map ((tutor,i) => tutor+i) // tutors and index

// []===[] // false as both empty but not the same

//tutorstutorstutors = tutors.map((a,b,c) => c) // prints orginal array three times

/* map function explained
const myMap = (arr, func) => {
    const output = [];
    for(let i = 0; i < arr.length; i++){
        output.push(func(arr[i]);
    }
return output
}

const tutorsButLouder = myMap(tutors, tutor => tutor.toUpperCase())
*/

const nums = [1,2,3,4,5]
const output = nums.map(a,b => a*b) // element x index 