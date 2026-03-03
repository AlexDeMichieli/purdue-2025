# Lesson 03 Demo 01 — Pass by Reference vs Pass by Value

**Objective:** Understand how primitive types and objects behave differently when assigned or copied in JavaScript.

**Tools:** VS Code, npm

**Prerequisites:** None

---

## What's the Difference?

When you assign a variable to another variable, JavaScript does one of two things depending on the data type:

- **Primitives** (number, string, boolean, null, undefined) are copied **by value** — you get an independent clone.
- **Objects** (objects, arrays, functions) are copied **by reference** — you get a second pointer to the *same* data.

Think of it this way:

- **By value** = photocopying a document. Each person has their own copy. Writing on one doesn't affect the other.
- **By reference** = sharing a Google Doc link. Both people edit the same document.

---

## Step 1: Pass by Value (Primitives)

Primitives live in their own independent memory slots. Copying one creates a completely separate value.

Write the following in `index.js`:

```js
// --- NUMBERS ---
let price = 100;
let discountedPrice = price; // copies the value 100

discountedPrice = discountedPrice * 0.8; // apply 20% discount

console.log("price:", price);                     // 100 (unchanged)
console.log("discountedPrice:", discountedPrice); // 80

// --- STRINGS ---
let greeting = "Hello";
let shout = greeting;

shout = shout.toUpperCase();

console.log("greeting:", greeting); // "Hello" (unchanged)
console.log("shout:", shout);       // "HELLO"

// --- BOOLEANS ---
let isLoggedIn = true;
let wasLoggedIn = isLoggedIn;

isLoggedIn = false;

console.log("isLoggedIn:", isLoggedIn);   // false
console.log("wasLoggedIn:", wasLoggedIn); // true (unchanged)
```

```bash
node index.js
```

In every case, changing the copy has **zero effect** on the original. They are completely independent.

---

## Step 2: Pass by Reference (Objects)

Objects are not copied — only the *reference* (memory address) is copied. Both variables point to the exact same object.

Replace `index.js` with:

```js
let student1 = {
  name: "Fionna",
  email: "fionna@example.com",
  phone: "1234567890"
};

let student2 = student1; // NOT a copy — same object, second label

console.log("Before update:");
console.log("student1:", student1);
console.log("student2:", student2);

// Modify through student2
student2.email = "fionna.peter@example.com";
student2.hobbies = ["Playing", "Cooking"];

console.log("\nAfter update:");
console.log("student1:", student1); // also changed!
console.log("student2:", student2);
```

```bash
node index.js
```

Both variables show the updated email and hobbies — because there is only **one object** with two names.

### Arrays behave the same way

```js
let colors = ["red", "green", "blue"];
let palette = colors; // same array, second label

palette.push("yellow");

console.log("colors:", colors);   // ["red", "green", "blue", "yellow"]
console.log("palette:", palette); // ["red", "green", "blue", "yellow"]
```

Pushing to `palette` also changes `colors` because they reference the same array.

### Gotcha: reassignment vs mutation

There's an important distinction. **Mutating** (changing a property) affects all references. **Reassigning** (pointing to a new object) does not:

```js
let a = { x: 1 };
let b = a;

// Mutation — both see the change
b.x = 99;
console.log(a.x); // 99

// Reassignment — only b changes, a still points to the original
b = { x: 200 };
console.log(a.x); // 99 (still the original object)
console.log(b.x); // 200 (new object)
```

`b = { x: 200 }` doesn't modify the old object — it creates a brand new object and points `b` to it. `a` still references the original.

---

## Step 3: How to Make a Real Copy of an Object

If you **want** an independent copy, you need to explicitly create one.

### Shallow copy (spread operator)

Copies top-level properties only. Nested objects are still shared.

```js
let student1 = {
  name: "Fionna",
  email: "fionna@example.com",
  hobbies: ["Playing", "Cooking"]
};

let student2 = { ...student1 };

student2.name = "Jake";
console.log(student1.name); // "Fionna" — top-level copy worked

student2.hobbies.push("Reading");
console.log(student1.hobbies); // ["Playing", "Cooking", "Reading"] — nested array is shared!
```

The `hobbies` array is the same reference in both objects. Spread only goes one level deep.

### Deep copy (structuredClone)

Recursively copies everything, including nested objects and arrays.

```js
let student1 = {
  name: "Fionna",
  email: "fionna@example.com",
  hobbies: ["Playing", "Cooking"]
};

let student3 = structuredClone(student1);

student3.hobbies.push("Reading");
console.log(student1.hobbies); // ["Playing", "Cooking"] — completely independent
console.log(student3.hobbies); // ["Playing", "Cooking", "Reading"]
```

| Method | Copies nested objects? | Use when |
|---|---|---|
| `{ ...obj }` / `[...arr]` | No (shallow) | Object has only primitive properties |
| `structuredClone(obj)` | Yes (deep) | Object has nested objects or arrays |
| `JSON.parse(JSON.stringify(obj))` | Yes (deep) | Older Node versions without `structuredClone` |

> `JSON.parse(JSON.stringify())` works but drops `undefined`, functions, and `Date` objects. Prefer `structuredClone` when available (Node 17+).

---

## Step 4: Functions and Pass by Reference

This comes up often with functions. When you pass an object to a function, the function can mutate the original:

```js
function addGrade(student, grade) {
  student.grades = student.grades || [];
  student.grades.push(grade);
}

let alice = { name: "Alice" };
addGrade(alice, "A");
addGrade(alice, "B+");

console.log(alice);
// { name: "Alice", grades: ["A", "B+"] }
```

The function modified `alice` directly — it didn't return a new object. This is a common pattern but can be surprising if you don't expect it.

To avoid mutation, work on a copy inside the function:

```js
function withGrade(student, grade) {
  return {
    ...student,
    grades: [...(student.grades || []), grade]
  };
}

let alice = { name: "Alice" };
let aliceWithA = withGrade(alice, "A");

console.log(alice);       // { name: "Alice" } — unchanged
console.log(aliceWithA);  // { name: "Alice", grades: ["A"] }
```

---

## Summary

| Type | Behavior | What gets copied | Changing the copy affects the original? |
|---|---|---|---|
| **Primitives** (number, string, boolean) | Pass by value | The actual value | No |
| **Objects** (object, array, function) | Pass by reference | The memory address | Yes (if mutated) |

The most common bug: mutating an object you *thought* was a copy but was actually the original. When in doubt, spread it out (`{ ...obj }`) or use `structuredClone()`.
