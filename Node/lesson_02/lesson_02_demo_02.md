# Lesson 02 Demo 02 — Blocking and Non-Blocking Operations in Node.js

**Objective:** Work with blocking (synchronous) and non-blocking (asynchronous) methods for reading files in Node.js.

**Tools:** VS Code, npm

**Prerequisites:** Basic knowledge of Linux commands and npm commands

---

## Setup

Create a sample file to read:

```bash
touch essay.md
```

Add any text content to `essay.md` (a paragraph or two is enough).

---

## Step 1: Read File Content Synchronously (Blocking)

Write the following in `index.js`:

```js
const fs = require("fs");

console.log("=== START ===");

// Blocking — execution halts here until the entire file is read
const data = fs.readFileSync("./essay.md", "utf-8");
console.log(data);

// This only runs AFTER the file read is complete
for (let num = 1; num <= 10; num++) {
  console.log(`5 * ${num} = ${num * 5}`);
}

console.log("=== END ===");
```

```bash
node index.js
```

**Expected output order:**
```
=== START ===
(file contents)
5 * 1 = 5
5 * 2 = 10
...
=== END ===
```

Everything runs top-to-bottom. `readFileSync` blocks the entire process — the multiplication table cannot start until the file read finishes.

> The `"utf-8"` encoding argument tells Node to return a string. Without it, `readFileSync` returns a raw `Buffer` (e.g., `<Buffer 48 65 6c 6c 6f>`).

---

## Step 2: Read File Content Asynchronously (Non-Blocking)

Replace `index.js` with:

```js
const fs = require("fs");

console.log("=== START ===");

// Non-blocking — registers a callback and moves on immediately
fs.readFile("./essay.md", "utf-8", (error, data) => {
  if (error) throw error;
  console.log("[readFile callback]", data);
});

// Delayed execution — fires after 1 second
setTimeout(() => {
  console.log("[setTimeout callback] Hello");
}, 1000);

// Synchronous — runs immediately, does NOT wait for readFile or setTimeout
for (let num = 1; num <= 10; num++) {
  console.log(`5 * ${num} = ${num * 5}`);
}

console.log("=== END ===");
```

```bash
node index.js
```

**Expected output order:**
```
=== START ===
5 * 1 = 5
5 * 2 = 10
...
=== END ===
[readFile callback] (file contents)
[setTimeout callback] Hello
```

The multiplication table and `=== END ===` print **first** because they're synchronous. The file content appears next (I/O completes), then `"Hello"` fires after the 1-second delay.

---

## Why This Matters

Imagine a web server that reads a large file for every request:

```
Blocking (readFileSync):
  Request 1 → read file (500ms) → respond → Request 2 → read file (500ms) → respond
  Total: 1000ms for 2 requests

Non-blocking (readFile):
  Request 1 → start reading → Request 2 → start reading → both respond when ready
  Total: ~500ms for 2 requests
```

Blocking I/O forces requests to queue up. Non-blocking I/O lets Node handle multiple requests concurrently on a single thread — this is why Node.js is fast for I/O-heavy workloads.

---

## Modern Alternative: async/await with fs.promises

Callbacks work but can get messy when nested. The `fs.promises` API lets you write async code that reads like synchronous code:

```js
const fs = require("fs").promises;

async function main() {
  try {
    const data = await fs.readFile("./essay.md", "utf-8");
    console.log(data);
  } catch (error) {
    console.error("Failed to read file:", error.message);
  }
}

main();
```

This is still non-blocking under the hood, but much easier to read and reason about.

---

## Summary

| Method | Type | Blocks event loop? | Returns |
|---|---|---|---|
| `fs.readFileSync(path, encoding)` | Synchronous | Yes | File content directly |
| `fs.readFile(path, encoding, callback)` | Async (callback) | No | Content via callback |
| `fs.promises.readFile(path, encoding)` | Async (Promise) | No | Content via `await` |

**Rule of thumb:** Use synchronous methods only for startup/config loading. For everything else, use async methods to keep the server responsive.
