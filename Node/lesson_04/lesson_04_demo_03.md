# Lesson 04 Demo 03 — EventEmitter Fundamentals

**Objective:** Learn the core `EventEmitter` API — registering listeners, emitting events with data, handling errors, and using `once` — through a practical order notification system.

**Tools:** VS Code, npm

**Prerequisites:** None

---

## Why EventEmitter?

Many things in Node.js are event-driven: an HTTP server emits `'request'` when a client connects, a stream emits `'data'` when bytes arrive, a process emits `'exit'` when it shuts down. `EventEmitter` is the class behind all of these. Understanding it helps you work with Node's built-in modules and lets you build your own event-driven components.

---

## Step 1: Basic Events — Place an Order

Set up a project directory:

```bash
mkdir eventDemo
cd eventDemo
touch index.js
code .
```

Write the following in `index.js`:

```js
const { EventEmitter } = require('events');

const shop = new EventEmitter();

// Listen for the 'order' event
shop.on('order', () => {
    console.log("New order received!");
});

// Simulate placing an order
shop.emit('order');
```

```bash
node index.js
```

`.on()` registers a listener. `.emit()` triggers it. This is the same pattern Node uses internally — when you write `server.on('request', callback)`, you're using `EventEmitter` under the hood.

---

## Step 2: Pass Order Details as Arguments

Any arguments after the event name in `.emit()` are forwarded to the listener. This is how you attach data to events.

Replace `index.js` with:

```js
const { EventEmitter } = require('events');

const shop = new EventEmitter();

shop.on('order', (item, qty, customer) => {
    console.log(`Order: ${qty}x ${item} for ${customer}`);
});

shop.emit('order', 'Laptop', 2, 'Alice');
shop.emit('order', 'Keyboard', 1, 'Bob');
```

```bash
node index.js
```

This is the same idea as passing data through a callback — the emitter decides what data to include, and the listener decides what to do with it.

---

## Step 3: Multiple Listeners — Notify Different Services

A single event can have multiple listeners. They run in the order they were registered. This is useful when different parts of your app need to react to the same thing.

Replace `index.js` with:

```js
const { EventEmitter } = require('events');

const shop = new EventEmitter();

// Listener 1: Log the order
shop.on('order', (item, qty, customer) => {
    console.log(`[LOG] ${customer} ordered ${qty}x ${item}`);
});

// Listener 2: Update inventory
shop.on('order', (item, qty) => {
    console.log(`[INVENTORY] Reduce ${item} stock by ${qty}`);
});

// Listener 3: Send confirmation email
shop.on('order', (item, qty, customer) => {
    console.log(`[EMAIL] Sending confirmation to ${customer}`);
});

shop.emit('order', 'Monitor', 3, 'Charlie');
```

```bash
node index.js
```

All three listeners fire in order from a single `.emit()`. This pattern keeps responsibilities separated — each listener handles one concern without knowing about the others.

---

## Step 4: `once` — First-Order Welcome Message

`.once()` registers a listener that fires only on the first emit, then automatically removes itself. This is useful for one-time setup or welcome flows.

Replace `index.js` with:

```js
const { EventEmitter } = require('events');

const shop = new EventEmitter();

// Fires every time
shop.on('order', (item, customer) => {
    console.log(`[ORDER] ${customer} ordered ${item}`);
});

// Fires only on the first order
shop.once('order', (item, customer) => {
    console.log(`[WELCOME] Thanks for your first order, ${customer}! Here's a 10% discount code: WELCOME10`);
});

shop.emit('order', 'Laptop', 'Alice');
console.log('---');
shop.emit('order', 'Mouse', 'Alice');
console.log('---');
shop.emit('order', 'Keyboard', 'Alice');
```

```bash
node index.js
```

The welcome message only appears for the first order. The regular order listener continues firing every time.

---

## Step 5: Error Handling

Node.js treats the `'error'` event specially: if you emit `'error'` and no listener is registered, Node crashes the process. Always register an error listener.

Replace `index.js` with:

```js
const { EventEmitter } = require('events');

const shop = new EventEmitter();

// Always register an error listener
shop.on('error', (err) => {
    console.error(`[ERROR] Order failed: ${err.message}`);
});

shop.on('order', (item, qty) => {
    if (qty <= 0) {
        shop.emit('error', new Error(`Invalid quantity (${qty}) for ${item}`));
        return;
    }
    console.log(`[ORDER] ${qty}x ${item} — confirmed`);
});

shop.emit('order', 'Laptop', 2);    // succeeds
shop.emit('order', 'Mouse', -1);    // triggers error
shop.emit('order', 'Keyboard', 5);  // succeeds
```

```bash
node index.js
```

The error listener catches the problem without crashing the program. This is the same pattern used by streams, sockets, and other Node.js built-ins — they all emit `'error'` when something goes wrong.

---

## Step 6: Async Listeners

Event listeners run synchronously by default. If a listener does heavy work, it blocks everything after it. Use `setImmediate()` to defer work to the next event loop tick.

Replace `index.js` with:

```js
const { EventEmitter } = require('events');

const shop = new EventEmitter();

// Synchronous — runs immediately
shop.on('order', (item, customer) => {
    console.log(`[ORDER] ${customer} ordered ${item}`);
});

// Asynchronous — deferred to next tick
shop.on('order', (item, customer) => {
    setImmediate(() => {
        console.log(`[EMAIL] Confirmation sent to ${customer}`);
    });
});

shop.emit('order', 'Laptop', 'Alice');
console.log('[MAIN] This runs before the email because the email listener is async');
```

```bash
node index.js
```

The `[MAIN]` log appears before the `[EMAIL]` log because `setImmediate` defers execution. This is useful when a listener performs I/O or heavy computation that shouldn't delay other listeners.

---

## Summary

| Concept | API | Real-world use |
|---|---|---|
| Register listener | `.on(event, callback)` | React to requests, data, state changes |
| One-time listener | `.once(event, callback)` | Initialization, welcome flows, first-connect logic |
| Emit event | `.emit(event, ...args)` | Signal that something happened, pass along data |
| Error events | `.emit('error', new Error())` | Report failures without crashing |
| Multiple listeners | Multiple `.on()` calls | Separate concerns (logging, email, inventory) |
| Async listeners | `setImmediate(() => { ... })` | Defer non-critical work like notifications |
