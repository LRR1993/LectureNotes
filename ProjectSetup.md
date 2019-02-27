Pair programming
- driver / navigator 
- be respectful

Project Setup
... package json - recpiet of eveything thats needed
1. npm install mocha/chai
2. .gitignore - config.js, node_modules
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
    }) // test only fail when we add errow to compare it
})
```

always see youre test fail before you make it pass

projects
1. write a specfication for the project
    used to test the actual code
2. write a sciptt (actual code)
