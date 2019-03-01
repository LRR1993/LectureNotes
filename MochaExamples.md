TDD
The TDD interface provides suite(), test(), suiteSetup(), suiteTeardown(), setup(), and teardown():

```js
suite("Array", function() {
  setup(function() {
    // ...
  });

  suite("#indexOf()", function() {
    test("should return -1 when not present", function() {
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
});
```

BDD
The BDD interface provides describe(), context(), it(), specify(), before(), after(), beforeEach(), and afterEach().

context() is just an alias for describe(), and behaves the same way; it just provides a way to keep tests easier to read and organized. Similarly, specify() is an alias for it().

All of the previous examples were written using the BDD interface.

```js
describe('Array', function() {
  before(function() {
    // ...
  });

  describe('#indexOf()', function() {
    context('when not present', function() {
      it('should not throw an error', function() {
        (function() {
          [1, 2, 3].indexOf(4);
        }.should.not.throw());
      });
      it('should return -1', function() {
        [1, 2, 3].indexOf(4).should.equal(-1);
      });
    });
    context('when present', function() {
      it('should return the index where the element first appears in the array', function() {
        [1, 2, 3].indexOf(3).should.equal(2);
      });
    });
  });
```

INCLUSIVE TESTS
This feature is the inverse of .only(). By appending .skip(), you may tell Mocha to simply ignore these suite(s) and test case(s). Anything skipped will be marked as pending, and reported as such. Here's an example of skipping an entire suite:

```js
describe('Array', function() {
  describe.skip('#indexOf()', function() {
    // ...
  });
});
Or a specific test-case:

describe('Array', function() {
  describe('#indexOf()', function() {
    it.skip('should return -1 unless present', function() {
      // this test will not be run
    });

    it('should return the index when present', function() {
      // this test will be run
    });
  });
});
Best practice: Use .skip() instead of commenting tests out.
```

```js
HOOKS
With its default "BDD"-style interface, Mocha provides the hooks before(), after(), beforeEach(), and afterEach(). These should be used to set up preconditions and clean up after your tests.

describe('hooks', function() {
  before(function() {
    // runs before all tests in this block
  });

  after(function() {
    // runs after all tests in this block
  });

  beforeEach(function() {
    // runs before each test in this block
  });

  afterEach(function() {
    // runs after each test in this block
  });

  // test cases
});
```

```js
DESCRIBING HOOKS
Any hook can be invoked with an optional description, making it easier to pinpoint errors in your tests. If a hook is given a named function, that name will be used if no description is supplied.

beforeEach(function() {
  // beforeEach hook
});

beforeEach(function namedFun() {
  // beforeEach:namedFun
});

beforeEach('some description', function() {
  // beforeEach:some description
});
```

```js
REQUIRE
The require interface allows you to require the describe and friend words directly using require and call them whatever you want. This interface is also useful if you want to avoid global variables in your tests.

Note: The require interface cannot be run via the node executable, and must be run via mocha.

var testCase = require('mocha').describe;
var pre = require('mocha').before;
var assertions = require('mocha').it;
var assert = require('chai').assert;

testCase('Array', function() {
  pre(function() {
    // ...
  });

  testCase('#indexOf()', function() {
    assertions('should return -1 when not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
```
