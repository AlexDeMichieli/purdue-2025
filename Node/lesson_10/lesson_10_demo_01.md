# Lesson 10 Demo 01 — Demonstrating Configuration Commands

**Objective:** Demonstrate configuration commands in Express.js for effective application setup

**Tools:** VS Code, Express.js, Node.js

**Prerequisites:** Knowledge of JavaScript and Node.js

---

## Overview

Express applications have a built-in settings system accessed through methods like `app.set()`, `app.get()`, `app.enable()`, and `app.disable()`. These configuration commands let you store key-value pairs, toggle boolean flags, and query their state — all without external config libraries. In production apps, these settings control everything from template engines and environments to security headers and JSON formatting.

---

## Step 1: Set Up the Working Directory

Create and navigate to the project folder, then initialize it:

```bash
mkdir express-config-demo
cd express-config-demo
npm init -y
npm install express ejs
touch index.js
```

Open the folder in VS Code.

---

## Step 2: Use `app.set()` and `app.get()`

These methods form the foundation of Express configuration. Real applications use them to set the view engine, define the port, store an app name, configure the environment, and more.

### 2.1 Add the following code to `index.js`

```js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Configure real application settings
app.set('view engine', 'ejs');
app.set('app name', 'My Task Manager');
app.set('env', process.env.NODE_ENV || 'development');

// Retrieve and display all configured settings
console.log('--- App Configuration ---');
console.log('View engine:', app.get('view engine'));
console.log('App name:  ', app.get('app name'));
console.log('Environment:', app.get('env'));
console.log('Port:       ', PORT);

// Use settings inside a route
app.get('/', (req, res) => {
    res.json({
        app: app.get('app name'),
        environment: app.get('env'),
        viewEngine: app.get('view engine'),
    });
});

app.listen(PORT, () => {
    console.log(`\n${app.get('app name')} running at http://localhost:${PORT}`);
});
```

### 2.2 Run the server

```bash
node index.js
```

**Expected output:**

```
--- App Configuration ---
View engine: ejs
App name:   My Task Manager
Environment: development
Port:        3000

My Task Manager running at http://localhost:3000
```

Visit `http://localhost:3000/` to see the config returned as JSON.

**What's happening:** `app.set(name, value)` stores a setting and `app.get(name)` retrieves it. Some setting names are special to Express — `'view engine'` tells Express which template engine to use, and `'env'` controls behavior like error verbosity. You can also store any custom key-value pair (like `'app name'`).

---

## Step 3: Use `app.enable()` and `app.disable()`

These are shorthand for toggling boolean settings. In practice, they control features like `'trust proxy'` (needed behind load balancers), `'x-powered-by'` (a security consideration), and `'strict routing'`.

### 3.1 Replace `index.js` with the following code

```js
const express = require('express');
const app = express();
const PORT = 3000;

// By default, Express sends the "X-Powered-By: Express" header.
// Attackers can use this to identify the framework — disable it.
console.log('x-powered-by before:', app.get('x-powered-by')); // true (default)

app.disable('x-powered-by');
console.log('x-powered-by after: ', app.get('x-powered-by')); // false

// Enable trust proxy — required when running behind Nginx, AWS ELB, etc.
// Without this, req.ip and req.protocol report the proxy, not the client.
console.log('\ntrust proxy before:', app.get('trust proxy')); // undefined

app.enable('trust proxy');
console.log('trust proxy after: ', app.get('trust proxy')); // true

// Enable strict routing — /api/users and /api/users/ become different routes
app.enable('strict routing');

app.get('/api/users', (req, res) => {
    res.json({ message: 'User list (no trailing slash)' });
});

app.get('/api/users/', (req, res) => {
    res.json({ message: 'User list (with trailing slash)' });
});

app.listen(PORT, () => {
    console.log(`\nServer running at http://localhost:${PORT}`);
    console.log('Try: /api/users vs /api/users/');
});
```

### 3.2 Run the server

```bash
node index.js
```

**Expected output:**

```
x-powered-by before: true
x-powered-by after:  false

trust proxy before: undefined
trust proxy after:  true

Server running at http://localhost:3000
Try: /api/users vs /api/users/
```

Test both URLs — with strict routing enabled, they return different responses.

**What's happening:** `app.enable(name)` is shorthand for `app.set(name, true)` and `app.disable(name)` is shorthand for `app.set(name, false)`. The examples here are settings you would actually toggle in production: disabling `x-powered-by` is a basic security hardening step, `trust proxy` is essential behind reverse proxies, and `strict routing` gives you precise control over URL matching.

---

## Step 4: Use `app.enabled()` and `app.disabled()`

These are boolean checks that let you conditionally branch your app logic based on current settings — useful for feature flags and environment-aware behavior.

### 4.1 Replace `index.js` with the following code

```js
const express = require('express');
const app = express();
const PORT = 3000;

// Simulate a feature-flag system using Express settings
app.enable('feature:dark-mode');
app.disable('feature:beta-dashboard');

// Check flags and configure middleware accordingly
if (app.enabled('feature:dark-mode')) {
    console.log('[feature] Dark mode is ON');
}

if (app.disabled('feature:beta-dashboard')) {
    console.log('[feature] Beta dashboard is OFF');
}

// Build a status endpoint that reports all feature flags
app.get('/api/features', (req, res) => {
    res.json({
        darkMode: app.enabled('feature:dark-mode'),
        betaDashboard: app.enabled('feature:beta-dashboard'),
        xPoweredBy: app.enabled('x-powered-by'),
        trustProxy: app.enabled('trust proxy'),
    });
});

// Conditionally add a route only if the beta feature is on
if (app.enabled('feature:beta-dashboard')) {
    app.get('/dashboard/beta', (req, res) => {
        res.json({ message: 'Welcome to the beta dashboard!' });
    });
}

app.get('/', (req, res) => {
    res.json({ message: 'Visit /api/features to see all flags' });
});

app.listen(PORT, () => {
    console.log(`\nServer running at http://localhost:${PORT}`);
});
```

### 4.2 Run the server

```bash
node index.js
```

**Expected output:**

```
[feature] Dark mode is ON
[feature] Beta dashboard is OFF

Server running at http://localhost:3000
```

Visit `http://localhost:3000/api/features` to see all flags as JSON. Try hitting `/dashboard/beta` — it will 404 because the feature is disabled. Change `app.disable('feature:beta-dashboard')` to `app.enable(...)`, restart, and the route appears.

**What's happening:** `app.enabled(name)` returns `true` if the setting is truthy, while `app.disabled(name)` returns `true` if falsy. Unset settings are `undefined` (falsy), so `app.disabled()` returns `true` for anything not yet configured. This pattern works well as a lightweight feature-flag system — you can gate routes, middleware, and behavior behind simple boolean checks.

---

## Summary

| Method | Purpose | Real-World Use Case |
|--------|---------|---------------------|
| `app.set(name, value)` | Store a configuration value | Set view engine, app name, environment |
| `app.get(name)` | Retrieve a configuration value | Read current env, port, or custom settings |
| `app.enable(name)` | Set a boolean flag to `true` | Turn on `trust proxy` behind a load balancer |
| `app.disable(name)` | Set a boolean flag to `false` | Hide `x-powered-by` header for security |
| `app.enabled(name)` | Check if a setting is truthy | Gate a beta feature behind a flag |
| `app.disabled(name)` | Check if a setting is falsy | Skip middleware when a feature is off |
