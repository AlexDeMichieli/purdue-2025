# Lesson 02 Demo 03 — The Event Loop

**Objective:** Demonstrate how Node.js schedules asynchronous operations across different phases of the event loop.

**Tools:** VS Code, npm

**Prerequisites:** None (but `essay.md` from Demo 02 should exist in the project directory)

---

## How the Event Loop Works

Node.js is single-threaded but handles concurrency through an **event loop** — a cycle that processes different types of callbacks in a specific order.

```
   ┌───────────────────────────┐
┌─>│        timers              │  ← setTimeout, setInterval
│  └───────────┬───────────────┘
│  ┌───────────┴───────────────┐
│  │     pending callbacks      │  ← system-level callbacks
│  └───────────┬───────────────┘
│  ┌───────────┴───────────────┐
│  │        idle, prepare       │  ← internal use
│  └───────────┬───────────────┘
│  ┌───────────┴───────────────┐
│  │          poll              │  ← I/O callbacks (fs, network)
│  └───────────┬───────────────┘
│  ┌───────────┴───────────────┐
│  │          check             │  ← setImmediate
│  └───────────┬───────────────┘
│  ┌───────────┴───────────────┐
│  │     close callbacks        │  ← socket.on('close')
│  └───────────┬───────────────┘
└──────────────┘
```

Each box is a **phase**. The loop cycles through them repeatedly, executing queued callbacks in each phase.

---

## The Code

Write the following in `index.js`:

```js
const fs = require("fs");

// --- Top level: setTimeout vs setImmediate ---
setTimeout(() => {
  console.log("1. setTimeout (top level)");
}, 0);

setImmediate(() => {
  console.log("2. setImmediate (top level)");
});

// --- Inside an I/O callback ---
fs.readFile("./essay.md", () => {
  console.log("3. readFile callback (I/O)");

  setTimeout(() => {
    console.log("4. setTimeout (inside readFile)");
  }, 0);

  setImmediate(() => {
    console.log("5. setImmediate (inside readFile)");
  });
});

// --- process.nextTick and Promises (microtasks) ---
process.nextTick(() => {
  console.log("6. process.nextTick");
});

Promise.resolve().then(() => {
  console.log("7. Promise.then");
});

console.log("8. synchronous (runs first)");
```

```bash
node index.js
```

---

## Expected Output

```
8. synchronous (runs first)
6. process.nextTick
7. Promise.then
1. setTimeout (top level)       ← or 2 first (non-deterministic)
2. setImmediate (top level)     ← or 1 first (non-deterministic)
3. readFile callback (I/O)
5. setImmediate (inside readFile)
4. setTimeout (inside readFile)
```

---

## Why This Order?

| What runs | When | Phase |
|---|---|---|
| Synchronous code (`console.log`) | Immediately, before the loop starts | Main script |
| `process.nextTick()` | After current operation, before any I/O | Microtask queue |
| `Promise.then()` | After nextTick, before any I/O | Microtask queue |
| `setTimeout(fn, 0)` | Timers phase | Depends on system clock resolution |
| `setImmediate()` | Check phase | After I/O polling |
| `fs.readFile` callback | Poll phase | When I/O completes |

### Key rules

1. **Synchronous code always runs first** — the event loop doesn't start until the main script finishes.

2. **Microtasks (`nextTick`, Promises) run between every phase** — they always jump the queue ahead of timers and I/O.

3. **At the top level**, `setTimeout(fn, 0)` vs `setImmediate()` is **non-deterministic** — either may fire first depending on system timing.

4. **Inside an I/O callback**, `setImmediate()` **always fires before** `setTimeout(fn, 0)` — because the check phase comes right after the poll (I/O) phase.

---

## Practical Example: Why This Matters

```js
// BAD — nextTick in a loop can starve I/O
function badRecursion() {
  process.nextTick(badRecursion); // I/O callbacks never get a chance to run
}

// GOOD — setImmediate allows I/O between iterations
function goodRecursion() {
  setImmediate(goodRecursion); // I/O callbacks run between each call
}
```

If you need to defer work but still let I/O happen, use `setImmediate`. If you need something to run before any I/O (like cleanup), use `process.nextTick`.

---

## Summary

```
Execution priority (highest to lowest):

1. Synchronous code                    ← runs immediately
2. process.nextTick()                  ← microtask, runs before I/O
3. Promise.then() / await              ← microtask, after nextTick
4. setTimeout / setInterval            ← timers phase
5. I/O callbacks (fs, http)            ← poll phase
6. setImmediate()                      ← check phase (but beats timers inside I/O)
```

Understanding this order helps you predict when your callbacks fire and avoid subtle race conditions in async code.
