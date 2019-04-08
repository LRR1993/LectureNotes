Constructors, Prototypes and Pseudo-Classical design
Re-cap
Define a factory function.
The main features of object-oriented programming.
Three rules of this: implict, explicit and default bindings.
Learning objectives
Learn about the new keyword in javascript. What happens when we invoke a function using the new keyword
Define a constructor.
Learn about the mechanism of prototypes and the prototype chain in javascript.
Firstly, we explored earlier an example of a createAccount factory function. Now our factory function may have shared functionality.

const accountMethods = {
addToBasket(item) {
this.basket[++this.quantity] = item;
},
getTotalPrice() {
const totalPrice = Object.values(this.basket).reduce((acc,{price}) => acc + +price.replace(/,|£/g,''),0);
return `£${totalPrice}`;
},
}

function createAccount (name,age,sortCode) {

}
Suppose we want an instance of createAccount to have access to the methods in accountMethods, then we could just use the Object.create method. We could write : const newAccount = Object.create(accountMethods) newAccount will still be a new empty object: however, it will now have a link if you like to the accountMethods object. We will investigate this "link" more later on...

Definition
constructors
Functions that are designed to be called with the new keyword are categorised as constructors. Using the new keyword when invoking a function means that certain things will happen behind the scenes when we create a local execution context.
function Account() {
console.log(this) // {}
}

const myAccount = new Account(); // {}

const arr = new Array(); // []
When a function is called with the new operator, two things will happen:
this inside the body of the function will be bound to a new empty object with a prototypal link to the constructor's prototype property. More on this later on.
The constructor will implicitly return it's value of this at the end of the execution context. (instead of undefined);
In other words, we don't need to explicitly write a return statement when writing a constructor function.We should never write an explicit return statement inside of our constructors as this will cause some unintended behaviour if we return an object.
(4th rule of this)
Let's have a look at how we can use the new value of this that is created.

function Account(name, sortCode) {

this.name = name;
this.sortCode = sortCode;
this.balance = 0;

}

const myAccount = new Account('paul', '42-42-42');
// Account { name : 'paul', sortCode: '42-42-42', balance: 0}
That's why, by convention, we name constructor functions with an upper case letter.
const invalidAccount = Account('paul', '42-42-42') // undefined
n.b. Because we will be calling our constructors with the new keyword, they will implicitly return their value of this.

When we log our new object it will show us the constructor that was used to make it. We can check what constructor(s) have been used to create our objects with the instanceof operator
const myAccount = new Account('paul', '42-42-42')

console.log(myAccount instanceof Account) // true

const nums = [1, 2, 3];
console.log(nums instanceof Array) //true
console.log(nums instanceof Object) //true
Prototypes
A prototype is an object that will contain the shared methods used by all instances of the constructor. (It serves a similar purpose to the stackMethods object that we created yesterday.)

When we log the prototype of our constructor we can see that object and all of the methods available to it.

console.log(Account.prototype) // {}
Let's add some methods to our prototype, like so:

Account.prototype.checkBalance = function() {
return `£${this.balance.toFixed(2)}`
}

Account.prototype.deposityMoney = function(amount) {
this.balance += amount;
}
We can see that these methods are now attached to the prototype object of Account.

Now when we call these methods on myAccount, what will this refer to inside the methods?

myAccount.checkBalance() // £0.00
myAccount.depositMoney(1.99)
myAccount.checkBalance() // £1.99
This has been implicitly bound to the myAccount object and added money to myAccount.

When the new value of this is created, it is created with a prototypal link to the the constructors prototype. This is how myAccount can access the methods on the Account prototype without being explicitly given them.

We can check which prototype an object has a link to with the Object.getPrototypeOf method. This is the same Object as Account.prototype.

Object.getPrototypeOf(myAccount) // Account { checkBalance: [Function], depositMoney: [Function] }

Object.getPrototypeOf(myAccount) === Account.prototype // true
When we used the new operator when making myAccount a new object is created as the value of this. This object will have a prototypal link to the Account prototype. This link gets added to the account as the proto variable (pronounced dunder-proto). We can see that this is a link to the Account prototype
console.log(myAccount.**proto** === Account.prototype) // true
This is the link that is used in Object.getPrototypeOf. As we have seen, private variables are denoted by an \_, proto has four of them, so they really don't want us messing with it directly, we should use Object.getPrototypeOf

When you look up a key on an object, it first looks at the object itself to see if it has that property. If that property does not exist then it will look on it's prototype, using Object.getPrototypeOf / proto. If not found there it will keep looking until it gets all the way back to the original constructor. This is refered to as the prototype chain.
