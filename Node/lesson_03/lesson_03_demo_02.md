# Lesson 03 Demo 02 — Working with Functions and Arrays

**Objective:** Create functions and work with arrays by pushing, removing, updating, and transforming elements.

**Tools:** VS Code, npm

**Prerequisites:** None

---

## Setup

```bash
mkdir demo2 && cd demo2
touch index.js
code .
```

---

## Part 1: Functions

### Function Declaration

The most basic way to define a function. Declarations are **hoisted** — you can call them before they appear in the file.

```js
greetUser("Fionna"); // works even though the function is defined below

function greetUser(username) {
  console.log(`Hello ${username}, how are you?`);
}
```

### Function Expression

Assign an anonymous function to a variable. Not hoisted — must be defined before use.

```js
const sayHello = function () {
  console.log("Hello there!");
};

sayHello();
```

### Arrow Functions

Shorter syntax introduced in ES6. Preferred for callbacks and short functions.

```js
// Standard arrow function
const greet = (name) => {
  console.log(`Hello, ${name}!`);
};

// One-liner with implicit return (no braces needed)
const double = (n) => n * 2;

// Single parameter — parentheses optional
const square = n => n * n;

console.log(double(5));  // 10
console.log(square(4));  // 16
```

### Default Parameters

Provide fallback values when no argument is passed.

```js
const greet = (name = "stranger") => {
  console.log(`Hello, ${name}!`);
};

greet("Ava");  // Hello, Ava!
greet();       // Hello, stranger!
```

### Rest Parameters

Collect any number of arguments into an array.

```js
const sum = (...numbers) => {
  return numbers.reduce((total, n) => total + n, 0);
};

console.log(sum(1, 2, 3));       // 6
console.log(sum(10, 20, 30, 40)); // 100
```

### First-Class Functions

"First-class" means functions can be **passed as arguments**, **returned from other functions**, and **stored in variables** — just like any other value.

**Passing a function as an argument:**

```js
const greet = (name) => console.log(`Hello, ${name}!`);

const runGreeting = (greetingFn, userName) => {
  greetingFn(userName);
};

runGreeting(greet, "Olivia"); // Hello, Olivia!
```

**Returning a function from another function (closure):**

```js
const createGreeter = (prefix) => {
  return (name) => {
    console.log(`${prefix}, ${name}!`);
  };
};

const excitedGreeter = createGreeter("Hey there");
excitedGreeter("Noah"); // Hey there, Noah!

const formalGreeter = createGreeter("Good evening");
formalGreeter("Noah"); // Good evening, Noah!
```

The returned function "remembers" the `prefix` it was created with. This is called a **closure** — an inner function that retains access to variables from its outer function's scope, even after the outer function has finished executing.

---

## Part 2: Arrays

### Declaring an Array

```js
const fruits = ["Apple", "Banana", "Cherry"];
console.log(fruits);        // ["Apple", "Banana", "Cherry"]
console.log(fruits.length); // 3
console.log(fruits[0]);     // "Apple"
```

### Adding and Removing Elements

```js
const fruits = ["Apple", "Banana", "Cherry"];

// push / pop — end of array
fruits.push("Mango");       // ["Apple", "Banana", "Cherry", "Mango"]
fruits.pop();               // ["Apple", "Banana", "Cherry"]

// unshift / shift — beginning of array
fruits.unshift("Strawberry"); // ["Strawberry", "Apple", "Banana", "Cherry"]
fruits.shift();               // ["Apple", "Banana", "Cherry"]

// splice — any position
fruits.splice(1, 1);             // remove 1 at index 1 → ["Apple", "Cherry"]
fruits.splice(1, 0, "Blueberry"); // insert at index 1  → ["Apple", "Blueberry", "Cherry"]
```

### Update by Index

```js
fruits[1] = "Grape";
console.log(fruits); // ["Apple", "Grape", "Cherry"]
```

### Searching

```js
const nums = [10, 20, 30, 40, 50];

nums.includes(30);     // true
nums.indexOf(40);      // 3
nums.indexOf(99);      // -1 (not found)

// find — returns the first element that matches a condition
nums.find(n => n > 25);      // 30
nums.findIndex(n => n > 25); // 2
```

### Transforming Arrays (map, filter, reduce)

These are the most important array methods in JavaScript. They return **new arrays** without modifying the original.

**`map`** — transform every element:

```js
const prices = [10, 20, 30];
const withTax = prices.map(price => price * 1.1);

console.log(withTax); // [11, 22, 33]
console.log(prices);  // [10, 20, 30] — unchanged
```

**`filter`** — keep elements that match a condition:

```js
const scores = [85, 42, 91, 67, 55, 73];
const passing = scores.filter(score => score >= 60);

console.log(passing); // [85, 91, 67, 73]
```

**`reduce`** — combine all elements into a single value:

```js
const cart = [
  { item: "Shirt", price: 25 },
  { item: "Pants", price: 40 },
  { item: "Shoes", price: 60 }
];

const total = cart.reduce((sum, product) => sum + product.price, 0);
console.log(total); // 125
```

### Chaining Methods

`map`, `filter`, and `reduce` can be chained together:

```js
const orders = [
  { product: "Laptop", price: 999, qty: 1 },
  { product: "Mouse", price: 25, qty: 3 },
  { product: "Monitor", price: 350, qty: 2 },
  { product: "Cable", price: 10, qty: 5 }
];

// Get total cost of orders over $50
const bigOrderTotal = orders
  .map(order => order.price * order.qty)          // [999, 75, 700, 50]
  .filter(cost => cost > 50)                      // [999, 75, 700]
  .reduce((sum, cost) => sum + cost, 0);          // 1774

console.log(bigOrderTotal); // 1774
```

---

## Summary

### Functions

| Syntax | Example | Notes |
|---|---|---|
| Declaration | `function greet() {}` | Hoisted, available anywhere in scope |
| Expression | `const greet = function() {}` | Not hoisted, must define before use |
| Arrow | `const greet = () => {}` | Shorter syntax, no own `this` binding |
| Default params | `(name = "world") => {}` | Fallback when argument is missing |
| Rest params | `(...args) => {}` | Collect remaining arguments as an array |

### Arrays

| Operation | Method | Mutates original? |
|---|---|---|
| Add to end | `push()` | Yes |
| Remove from end | `pop()` | Yes |
| Add to start | `unshift()` | Yes |
| Remove from start | `shift()` | Yes |
| Insert/remove at index | `splice()` | Yes |
| Transform elements | `map()` | No (returns new array) |
| Filter elements | `filter()` | No (returns new array) |
| Reduce to single value | `reduce()` | No (returns single value) |
| Check existence | `includes()` | No |
| Find element | `find()` / `findIndex()` | No |
