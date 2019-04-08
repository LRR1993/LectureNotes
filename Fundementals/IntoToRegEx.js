// Regular expression

// enclosed between '//'
//website - https://regexr.com/

//literal character /c/ 
//literal character /c/g selects all of the literal chracters in the strings

//meta chracters /123/g matches muliple characters

// /./ dot matches any charcaters apart from line breaks

// [^aeiou]/g // negates 

const lowercase = /[a-z]/;
lowercase.test('a'); // returns true
lowercase.test('2a'); // returns true - contains a-z 

// passwords
// must contain 1 uppercase, 1 lowercase, 1 number 

// new Regex () // create dynamically

const checkPassword = str => {
    const lowercase = /[a-z]/; //regex literal
    const uppercase = /[A-Z]/; //regex literal
    const number = /[0-9]/; //regex literal
    return lowercase.test(str) && uppercase.test(str) && number.test(str)
}

//const uppercase = /[A-z]/; //regex literal - only a single 1 lower case will pass this 

const pw = 'aB1' // will pass the test //return true

//must be 8 chars or more 
// lowercase and upper case and numbers

/*
const checkPassword = str => { 
    const lower = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/ //look ahead
}
const str = '5678sdfgh45674567dfghcvbn'

const letterNumberGroup = /[a-z]+\d+/g; //any number of letters and any number of digits
letterNumberGroup.exec(str) // find the instance that qualifies the match when returned again refrences the index of erach time it occurs

const letterNumberGroupCap = /([a-z]+)(\d+)/g; //splits instamces of letters and numbers
letterNumberGroup.exec(str) // prints the above 

let match;
const names =[];
const ids =[];

while ((match = letterNumberGroup.exec(str))){
    // matches 
}
*/

/*
// match is a string method - match is more demanding slower!
// match returns and array of all of the matches

const aNb = 'abba banana'
const As = aNb.match(/a/g) // gets an array of As
const Cs = aNb.match(/c/g) // returns null - cant use null in arrays
const Cs = aNb.match(/c/g) || [] // returns empty array - can be used 

//match doesnt make sense of capture groups - it returns everything
*/


// replace is a string method

const selfdoubt = 'hi ... will you go to prom with me ...?'
const confidence = selfdoubt.replace('...','!') // doesnt replace the ...?
const confidence = selfdoubt.replace(/\.{3}/g,'!') // replaces ... with !

const normalSentence = 'Welcome to the old world'
const YeOld = normalSentence
    .replace(/(d)([\s\.!\?"'])/g,'$1e$2') //finds capture groups $ maintains the surrounding 
    .replace('the', 'ye') // replaces with ye