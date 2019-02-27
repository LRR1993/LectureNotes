// Intro to function

function triple10(){ // function declaration
    return 10 * 3;
}

console.log(triple10()) //<-- function is called

function triple10(a){ // function declartion with parameter
    return a * 3 //a is a parameter
}

console.log(triple10(50)) //<-- function is called with a being the argrument oassed

let triplenum = function(num ) { // function expression, expressed to variable triplenum
    return num * 3
}

let tripled = num => num * 3 // arrow function

// be cause of hoisting variable - do not use var, old way

// example of scoping issues
let b = 10
function mult (a){
    b = 3 // b variuable is overwritten here
    return a * b
}

// errors example
let b = 10
function mult (a,b){
    b = 3 // b variuable is overwritten here
    return a * b
}
console.log(mult(54)) //54 is argurment, b is undefined, log will be NaN