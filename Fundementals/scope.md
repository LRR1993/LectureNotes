# Scope

**Scope** refers to the rules by which the JavaScript **interpreter** - whether this is Node, or the browser - look up variables within your programme.

If JS was a compiled language then the interpreter would go through the whole file, parse the syntax to make sure it's valid and if so, transform it all to machine code, and any errors would make the process fail at the syntax parsing stage.

```js
function foo() {
  console.log(bar);
}
```

Here, the function is never run, so the programme doesn't throw a reference error. The global execution context runs, but JS only parses and compiles the code that is required for the programme to run - that doesn't include functions which aren't invoked.

To understand scope we need to start thinking about how our code is compiled and run by the JS engine which involves thinking about code often in a different order to the order in which we write it.

The compiler collects and maintains a look-up list of all the declared **identifiers** (variables), and enforces a strict set of rules as to how these are accessible to currently executing code. Variables that are accessible are said to be **in scope**

An **execution context** is a 'wrapper' that helps manage the code you are running. Code can contain a number of different contexts, where different variables may be available. We've seen this demonstrated on diagrams so far this week, where we open a new context whenever we call a function.

So, in this example, using the methodology for understanding how JS runs earlier this week, what happens?

```javascript
const name = "Harriet";

function print(name) {
  console.log(name);
}

print("Foo");
```

It prints foo, as the variable 'name' is available in the local scope of the function.

What happens in this example, when we no longer have 'name' available in the local memory?

```javascript
const name = "Harriet";

function print() {
  const bar = "bar";
  console.log(name);
}

print();
```

JS looks in the memory of the execution context above it. In this case, it's the global. Not finding the variable in its own context (or **variable environment**), it looks immediately outside its own vairable environment, and in the global variable environment, it finds 'name' - it's Harriet. And it runs.

n.b. the exection context "above it" is the execution context the function is defined in. Wherever that function is defined is where it will look next in the chain. In this case, the global.

Variables that we can find anywhere along the scope chain are said to be, "in scope."

The interpreter will look up through the levels of nesting to decided which variable should be used. It will stop looking at the first one in which it finds the variable. As these contexts are defined by the way they are written, they can also go by the name of **lexical contexts**.

```javascript
function print() {
  console.log(text);
}

print();
```

We don't have a variable 'text' in any of the variable environments that print lives in, so we get a reference error - there's no variable with that name available.

The same variable name can be used in different execution contexts. There's no intrinsic reason not to do this, but be wary of readability in this situation and it being clear what something refers to.

Let's look back at another way variables can be declared:

```javascript
var name = "Harriet";
var name = "Mauro";
function foo() {
  var name = "Chris";
}

foo();
console.log(name);
```

Using `var` - the original way to declare variables in JS - the second declaration of the variable `name` overwrites the first in the global execution context, but in the local execution context of the function, a new variable `name` is created, so we don't overwrite the other one.

Looking back to how our variable was overwritten in the second line, we should think of this behaviour as potentially risky. Declaring a variable should be seen as a statement of intent - you've created this for a reason. And it's reasonable to expect the each time you assert a variable, you want it available. There's no real reason to overwrite a variable in context.

Using the new ES6 variable declaration keywords, we can alert ourselves when we're potentially making such a mistake.

```javascript
let name = "Harriet";
let name = "Mauro";
function foo() {
  let name = "Chris";
}

foo();
console.log(name);
```

This produces a type error - declaring a variable which has already been declared with `let`. If this is ever a mistake, we'll know. Using `name` again is fine if we're intending to overwrite it - we just purposefully don't use a declaration.

```javascript
let name = "Harriet";
name = "Mauro";
```

Of course, it's possible we don't want to ever overwrite - that's what `const` is for. A good rule of thumb may be to default to `const` - it is the safest declaration - then to `let` if it becomes apparent you are going to need to overwrite.

This is another risky behaviour we probably don't want to take advantage of:

```javascript
function foo() {
  name = "Chris";
}
console.log(name);
```

Normally, we wouldn't expect this console log to be able to refer to a variable declared in a local scope. However, that's not exactly what has happened here. Having not declared `name` within the function (using `var`, `let` or `const`), it **leaks** into the global execution context. Not having control over the execution context where your variables are available is a potential source of bugs.

What happens here?

```javascript
const a = 12;

function foo(a) {
  console.log(a + b);
}

const b = 2;

foo(2);
```

Although they exist in different execution contexts, both `a` and `b` are in scope in the function body. `a` is defined as 2, as it's the first argument passed to the function. `b` is grabbed from the global variable environment - following the thread of the context, `b` has been declared before `foo` is invoked, so its value is available.

```javascript
const a = 12;

function foo(a) {
  console.log(a + b);
}

foo(2);

const b = 2;
```

This is a small change, but now we'll have a reference error - `b` has not been declared at the point of invocation.

An extremely important aspect of scope is that an outer execution context cannot access variables defined in a local execution context.

```javascript
function foo() {
  const a = "hello world";
}

console.log(a);
```

Similarly, local, unrelated execution contexts cannot reach inside each other to refer to variables - they are completely separate.

```javascript
function foo() {
  const a = "hello world";
}

function bar() {
  console.log(a);
}

foo();
bar();
```

A parameter behaves like a local variable. We cannot access it outside of its local context.

```javascript
function foo(a) {
  a = "Hello world";
}
foo("greeting");

console.log(a);
```

There is one more behaviour that differentiates `let` and `const` from `var`:

```javascript
function createBananas(num) {
  for (let i = 0; i < num; i++) {
    let bananas = "banana".repeat(i);
  }
  return bananas;
}
createBananas(3);
```

`let` is **block scoped** - variables declared within a code block (where curly braces are used to enclose a section of code, as you are forced to do with if statements and loops, but can be theoretically done wherever you like). Outside of that block is a different variable environment, even though the execution context is the same. So here, `bananas` is not available to return.

`var`, however, is **function scoped** - bananas would be available to return. This may seem convenient, but actually means you lose a bit of your ability to control the scoping of your variables.

If you strictly resist `var`, this is a common resultant pattern:

```javascript
function respond(person) {
  let response;
  if (person.agreeable) {
    response = "You are nice";
  } else {
    response = "You are not nice";
  }
  return response;
}
```

Given that `let` is block scoped, we needed to declare it, as yet undefined, ready to be assigned a value within the conditional blocks, so it was available after for returning. You could argue that this is a bit clunky and verbose.

Here are two alternatives:

```javascript
function respond(person) {
  if (person.agreeable) {
    return "You are nice";
  } else {
    return "You are not nice";
  }
}
```

This avoids the initial empty declaration. However we may wish to strive to avoid returning in multiple places, for the sake of readability - it is convenient to know that you can determine what is returned from a function just by looking at its end, and not worry that there may be alternatives hidden above.

There is another pattern that uses a different form of logic to come to the same conclusion:

```javascript
function respond(person) {
  return person.agreeable ? "You are nice" : "You are not nice";
}
```

This is known as a **ternary operator**, and could be said to be well suited to this situation. Unlike an if statement, a value is 'returned' from the ternary logic, so it can be returned in turn from the function.

Ternary operators are not without their detractors - it could also be said that this is less explicit than words like 'if' and 'else'. But they can express code elegantly. If you are to use them, pay particular concern to the naming of variables, the layout of your code, and be particularly wary of nesting them!

One final phenomenon to address:

```javascript
pullChain();

function pullChain() {
  console.log("choo choo!");
}
```

You might expect this function not to invoke, it being declared afterwards. But **function declarations** - that is to say, functions defined with the `function` keyword - are **hoisted** before the thread runs, so they are actually available across the whole context, from the start.

Note however that **function expressions** are not hoisted, just as no values assigned to variables are made available until declaration. As such, you are probably safest pretending this behavious doesn't exist, and declare your functions as early as possible.

## Takeaways

- When the thread reads a variable, it looks up it's value at the point in the execution.
- The variable's value is looked up using the rules of scope.
- The first place it looks is the execution context the thread is currently in.
- If a variable of that name doesn't exist, it will go up it's scope chain.
- The next point in the scope chain is where the current execution context was defined.
- This process repeats until the global execution context is reached.
- If the variable doesn't exist in the global, a reference error will be thrown.
