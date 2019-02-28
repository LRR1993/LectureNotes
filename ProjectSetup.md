Pair programming
- driver / navigator 
- be respectful

Project Setup
... package json - recpiet of eveything thats needed
1. npm install mocha/chai
2. .gitignore - config.js, node_modules - dont want to upload all the modeules to github use package.json instead
3. git init, git status, git commit, git push 

Testing
- should no longer be console log, should be testing as using muliple values

example test - assertion library
```js
const sum = (a,b) => a+b;
sum(2,3)=== 6
//if true passes the test
```

Chai
- function library - objects of functions
```js
const {expect, assert /* can put muliple propertys in*/} = require('chai') // takes variables from the object and saves a const of the same name
const sum = (a,b) => a+b;
expect(result).to.equal(4):

```
will show nothing is pass, will throw an assertion error if fail, JS complier will stop running as error is thrown.

Mocha
uses it block to write test functionality, need to update package json to use mocha 
```js
describe('sum', () => {
    it('sums two intergers',()=>{
        const result = sum(2,2)
        expect(result).to.equal(4):
    }) // test only fail when we add error to compare it
})
```

always see youre test fail before you make it pass

projects
1. write a specfication for the project
    used to test the actual code
2. write a sciptt (actual code)

example spec
```js
const { expect } = require('chai');
const fizzBuzz = require('../fizzBuzz');

describe('fizzBuzz', () => {
  it('returns n when n is not divisible by 3 or 5', () => {
    expect(fizzBuzz(1)).to.equal(1);
    expect(fizzBuzz(2)).to.equal(2);
  });
  it('returns "fizz" when n is divisble by 3', () => {
    expect(fizzBuzz(3)).to.equal('fizz');
    expect(fizzBuzz(6)).to.equal('fizz');
  });
  it('returns "buzz" when n is divisble by 5', () => {
    expect(fizzBuzz(5)).to.equal('buzz');
    expect(fizzBuzz(10)).to.equal('buzz');
  });
  it('returns "fizzbuzz" when input is divisible by 3 and 5', () => {
    expect(fizzBuzz(15)).to.equal('fizzbuzz');
    expect(fizzBuzz(30)).to.equal('fizzbuzz');
  });
});
```

example code
```js
const fizzBuzz = n => {
  if (n % 15 === 0) return 'fizzbuzz';
  if (n % 3 === 0) return 'fizz';
  if (n % 5 === 0) return 'buzz';
  return n;
};

module.exports = fizzBuzz; //exports from chai/mocha
```