this and Object-Oriented Programming
Pre-Knowledge
Assigning and updating properties on an object
Behaviours of scope
References vs values of objects
Learning Objectives
By the end of the sprint you should:

Understand basic distinction between Functional Programming and Object-Oriented Programming
Be able to create a factory function
Be able to use this where appropriate
Understand difference between implicit, explicit, and default binding to this.
Programming Paradigms: Functional Programming vs Object-Oriented Programming
A programming paradigm is just another way of saying 'a style of programming'.

Up until this point, you've mainly been writing JavaScript using a Functional Programming (FP) Paradigm, perhaps even without realising. This means that we're writing JS in a style that focusses on functions, and strives to make these functions 'pure'.

Among other things, a 'pure' function is one that:

avoids mutation: e.g if the function is passed an array, it will return a new array with the relevant changes rather than the same array mutated.

has a consistent output for input: e.g. if a function invoked multiple times with the same input, the output will always be the same. This allows us to confidently carry out testing - we know what we want to always get as an output based on a test input.

We are now going to look at a different style of programming: Object-Oriented Programming (OOP).

OOP exploits the fact that objects in JavaScript can hold data in properties and hold 'behaviours' (functions) as methods. The izzisAccount object below holds the data of the user's username and basket, and also has a method addToBasket that adds an item to the basket array.

const izzisAccount = {
username: "izzi",
basket: [],
addToBasket: function(item) {
izzisAccount.basket.push(item);
}
};
Factory Functions
If we want to create lots of objects that all have the same basic blueprint, we can create a factory function. This function can return a new object every time its called, where each one is initialised with the same template.

function createUser(name) {
const newUser = {};
newUser.username = name;
newUser.basket = [];
newUser.addToBasket = function(item) {
newUser.basket.push(item);
};
return newUser;
}

const izzisAccount = createUser("Izzi");
const anatsAccount = createUser("Anat");
Every user object created using the function above will be initialised with a key of name, basket (which is an empty array) and addToBasket. When addToBasket is invoked with an item it will update the user object's basket with the new item.

The problem is that every time we create a new user, we also create an entirely new function every time, each with a different reference in memory. This very quickly gets unsustainable.

console.log(izzisAccount.addToBasket === anatsAccount.addToBasket); // FALSE
The solution is to bring this method outside the scope of the factory function itself:

function createUser(name) {
const newUser = {};
newUser.username = name;
newUser.basket = [];
newUser.addToBasket = addToBasket;
return newUser;
}

function addToBasket(item) {
newUser.basket.push(item); // gives ReferenceError: newUser is not defined
}
We no longer have reference to what object newUser is referring to now, which is where this comes in...

This
Implicit Binding
We can replace newUser with this, which represents the context of the function. Whenever a function is called as a method of an object, the this inside of it gets implicitly bound to whatever object is calling the function (i.e. the object left of the dot).

function addToBasket(item) {
this.basket.push(item);
}

izzisAccount.addToBasket("sandwiches");
In the example above, izzisAccount is the 'owner' of the function addToBasket, so any occurences of this within that function act as placeholders for the izzisAccount object.

Explicit Binding
We can call and explicitly set the value of this of a function call by using the function methods call and apply.

addToBasket.call(izzi, "sandwiches");
addToBasket.apply(izzi, ["sandwiches"]);
Both of the above invoke the function addToBasket, setting the value of this to be izzi. The difference between call and apply is only in how you pass in arguments to addToBasket - call takes multiple arguments, whereas apply takes an array of arguments.

Another method available is bind.

const addToIzzisBasket = addToBasket.bind(izzi);
Invoking bind returns a new function - in the example above, it returns a copy of addToBasket where the value of this is always going to be the izzi object. A bound function cannot have the this value changed.

Default Binding
If we call a function containing the this keyword without providing any context then this will get its value by 'default binding'. This means that it will bind to the global object (which is the window if you do this in the browser). This can be dangerous as we can accidentally start adding keys and values to the global - this is the case in code below, which adds the key of 'favouriteAnimal' and value of 'Hedgehog' to the global object.

function addFavouriteAnimal(animal) {
this.favouriteAnimal = animal;
}

addFavouriteAnimal("Hedgehog");
console.log(global);
The console.log(global) would show the entire global object with a key of favouriteAnimal and a value of "Hedgehog"!
