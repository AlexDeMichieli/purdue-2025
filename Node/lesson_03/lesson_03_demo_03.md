# Lesson 03 Demo 03 — Working with Objects

**Objective:** Create objects in Node.js and perform common operations — accessing, adding, updating, deleting, and iterating over properties.

**Tools:** VS Code, npm

**Prerequisites:** Basic understanding of JavaScript

---

## Step 1: Declare an Object

Objects store data as **key-value pairs**. Values can be any type — strings, numbers, booleans, arrays, or even other objects.

Create `index.js`:

```js
const user = {
  name: "Fionna",
  age: 32,
  email: "fionna@example.com",
  active: false,
  hobbies: ["Playing", "Cooking"],
  address: {
    street: "ABC",
    city: "Ludhiana",
    state: "Punjab",
    country: "India"
  }
};

console.log(user);
```

```bash
node index.js
```

---

## Step 2: Access Properties

Two ways to read values from an object:

```js
// Dot notation — cleaner, use when key is a known identifier
console.log(user.name);          // "Fionna"
console.log(user.address.city);  // "Ludhiana"

// Bracket notation — required when key is dynamic or has special characters
console.log(user["email"]);      // "fionna@example.com"

const key = "age";
console.log(user[key]);          // 32
```

### Optional chaining (`?.`)

Safely access nested properties that might not exist — returns `undefined` instead of throwing an error.

```js
console.log(user.address?.zip);       // undefined (no error)
console.log(user.social?.twitter);    // undefined (no error)

// Without optional chaining, this would throw: "Cannot read property 'twitter' of undefined"
```

---

## Step 3: Add New Properties

```js
user.phone = "1234567890";
user.address.zip = "141001";

console.log(user.phone);       // "1234567890"
console.log(user.address.zip); // "141001"
```

### Computed property names

Use variables or expressions as keys with bracket notation:

```js
const field = "nickname";
user[field] = "Fi";

console.log(user.nickname); // "Fi"
```

---

## Step 4: Update Existing Properties

```js
user.name = "Fionna Peterson";
user.age = 24;
user.active = true;

console.log(user.name);   // "Fionna Peterson"
console.log(user.active); // true
```

---

## Step 5: Delete Properties

```js
delete user.phone;
console.log(user.phone);       // undefined
console.log("phone" in user);  // false
```

---

## Step 6: Check if a Key Exists

```js
// "in" operator — checks own + inherited properties
console.log("email" in user); // true
console.log("phone" in user); // false

// hasOwnProperty — checks only own properties (not inherited)
console.log(user.hasOwnProperty("age")); // true
```

---

## Step 7: Iterate Over an Object

```js
// Object.keys — array of all keys
console.log(Object.keys(user));
// ["name", "age", "email", "active", "hobbies", "address"]

// Object.values — array of all values
console.log(Object.values(user));

// Object.entries — array of [key, value] pairs (most useful for looping)
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}:`, value);
}
```

---

## Step 8: Merge and Copy Objects

### Spread operator

```js
const defaults = { theme: "light", language: "en", notifications: true };
const preferences = { theme: "dark", language: "es" };

const settings = { ...defaults, ...preferences };
console.log(settings);
// { theme: "dark", language: "es", notifications: true }
```

Later spreads overwrite earlier ones for duplicate keys. This is a common pattern for merging config/options.

### Object.assign (older alternative to spread)

```js
const settings = Object.assign({}, defaults, preferences);
// same result as spread
```

### Object.freeze — prevent modifications

```js
const config = Object.freeze({
  apiUrl: "https://api.example.com",
  timeout: 5000
});

config.timeout = 9999;       // silently ignored (or throws in strict mode)
console.log(config.timeout); // 5000
```

> `Object.freeze` is shallow — nested objects can still be modified. Use `structuredClone` + freeze for deep immutability.

---

## Step 9: Destructuring

Extract properties into variables in a single line.

```js
// Basic destructuring
const { name, age, email } = user;
console.log(name);  // "Fionna Peterson"
console.log(email); // "fionna@example.com"

// Nested destructuring
const { address: { city, country } } = user;
console.log(city);    // "Ludhiana"
console.log(country); // "India"

// Rename while destructuring
const { name: fullName, age: userAge } = user;
console.log(fullName); // "Fionna Peterson"
console.log(userAge);  // 24

// Default values
const { phone = "N/A", active = false } = user;
console.log(phone); // "N/A" (phone was deleted earlier)
```

Destructuring is especially useful in function parameters:

```js
function displayUser({ name, email, address: { city } }) {
  console.log(`${name} (${email}) — ${city}`);
}

displayUser(user); // "Fionna Peterson (fionna@example.com) — Ludhiana"
```

---

## Summary

| Operation | Syntax | Example |
|---|---|---|
| Access | `obj.key` or `obj["key"]` | `user.name` |
| Safe access | `obj?.nested?.key` | `user.address?.zip` |
| Add | `obj.newKey = value` | `user.phone = "123"` |
| Update | `obj.key = newValue` | `user.age = 24` |
| Delete | `delete obj.key` | `delete user.phone` |
| Check key | `"key" in obj` | `"email" in user` |
| List keys | `Object.keys(obj)` | `Object.keys(user)` |
| List values | `Object.values(obj)` | `Object.values(user)` |
| Iterate | `Object.entries(obj)` | `for (const [k, v] of Object.entries(user))` |
| Merge | `{ ...obj1, ...obj2 }` | `{ ...defaults, ...preferences }` |
| Freeze | `Object.freeze(obj)` | Prevent modifications |
| Destructure | `const { key } = obj` | `const { name, age } = user` |
