# Lesson 10 Demo 03 — Using Middleware in an Express.js App

**Objective:** Use middleware in an Express.js app for enhanced request handling and functionality

**Tools:** VS Code, Node.js, Express.js

**Prerequisites:** Knowledge of JavaScript and Node.js

---

## Overview

Middleware functions are the backbone of Express — they have access to the request object, the response object, and the `next` function in the request-response cycle. Every Express app is essentially a chain of middleware calls. There are four categories:

| Type | Bound To | Use Case |
|------|----------|----------|
| Application-level | `app.use()` / `app.get()` | Logging, auth checks, body parsing |
| Router-level | `router.use()` / `router.get()` | Route-group-specific logic |
| Error-handling | `app.use((err, req, res, next))` | Centralized error responses |
| Third-party | `app.use(thirdPartyFn())` | Cookies, CORS, compression, etc. |

---

## Step 1: Project Setup

> Skip this step if you already have the folder structure from a previous demo.

```bash
mkdir express-middleware-app
cd express-middleware-app
npm init -y
npm install express
touch index.js
```

Open the folder in VS Code.

---

## Step 2: Application-Level Middleware

Application-level middleware is bound directly to the `app` object. It runs on every request (or on specific routes) and is the right place for cross-cutting concerns like request logging, authentication, and rate limiting.

### 2.1 Add the following code to `index.js`

```js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware that runs on EVERY request — acts as a request logger
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    req.requestTime = timestamp; // Attach custom data for downstream handlers
    next();
});

// Middleware that simulates an auth check — only for /dashboard routes
const requireAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Authorization header required' });
    }
    console.log('Auth token received:', token);
    req.user = { name: 'Jane', role: 'admin' }; // In real apps, decode the token
    next();
};

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome — this route is public',
        requestTime: req.requestTime,
    });
});

app.get('/dashboard', requireAuth, (req, res) => {
    res.json({
        message: `Hello ${req.user.name}, welcome to the dashboard`,
        role: req.user.role,
        requestTime: req.requestTime,
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
```

### 2.2 Run the server

```bash
node index.js
```

### 2.3 Test the routes

**Public route** — visit `http://localhost:3000/` in a browser:

```json
{ "message": "Welcome — this route is public", "requestTime": "2025-01-15T..." }
```

**Protected route without token** — visit `http://localhost:3000/dashboard`:

```json
{ "error": "Authorization header required" }
```

**Protected route with token** — in Postman, send a GET to `http://localhost:3000/dashboard` with the header `Authorization: Bearer abc123`:

```json
{ "message": "Hello Jane, welcome to the dashboard", "role": "admin", "requestTime": "..." }
```

The terminal logs every request with a timestamp, regardless of route.

**What's happening:** The logging middleware runs on every request via `app.use()`. The `requireAuth` middleware only runs on `/dashboard` because it's passed as an argument to `app.get()`. Each middleware either ends the cycle (by sending a response) or calls `next()` to pass control to the next handler.

---

## Step 3: Router-Level Middleware

Router-level middleware works the same way as application-level, but is scoped to an `express.Router()` instance. This lets you apply middleware to a group of related routes without affecting the rest of the app.

### 3.1 Replace `index.js` with the following code

```js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// --- Admin router with its own middleware ---
const adminRouter = express.Router();

// This middleware only runs for routes under /admin
adminRouter.use((req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== 'admin-secret-key') {
        return res.status(403).json({ error: 'Invalid API key for admin routes' });
    }
    console.log('[admin] Authenticated via API key');
    next();
});

adminRouter.get('/stats', (req, res) => {
    res.json({ totalUsers: 1024, activeToday: 87, revenue: '$12,340' });
});

adminRouter.delete('/users/:id', (req, res) => {
    console.log(`[admin] Deleting user ${req.params.id}`);
    res.json({ message: `User ${req.params.id} deleted` });
});

// --- Public router with no auth ---
const publicRouter = express.Router();

publicRouter.use((req, res, next) => {
    console.log('[public] Request to public route');
    next();
});

publicRouter.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime().toFixed(1) + 's' });
});

publicRouter.get('/about', (req, res) => {
    res.json({ app: 'Middleware Demo', version: '1.0.0' });
});

// Mount routers — each carries its own middleware
app.use('/admin', adminRouter);
app.use('/', publicRouter);

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log('Public routes:  GET /health, GET /about');
    console.log('Admin routes:   GET /admin/stats, DELETE /admin/users/:id');
});
```

### 3.2 Run the server

```bash
node index.js
```

### 3.3 Test the routes

| Request | Expected Result |
|---------|-----------------|
| GET `http://localhost:3000/health` | `{ "status": "ok", "uptime": "..." }` |
| GET `http://localhost:3000/about` | `{ "app": "Middleware Demo", "version": "1.0.0" }` |
| GET `http://localhost:3000/admin/stats` (no header) | 403 — `Invalid API key` |
| GET `http://localhost:3000/admin/stats` (header `x-api-key: admin-secret-key`) | Stats JSON |

**What's happening:** The admin router's `use()` middleware acts as a gatekeeper — it rejects requests without a valid API key. Public routes are completely unaffected. This is the same pattern used in production to separate public APIs from internal admin endpoints.

---

## Step 4: Error-Handling Middleware

Error-handling middleware has **four** parameters: `(err, req, res, next)`. Express recognizes this signature and only calls it when an error is passed to `next(err)` or when an exception is thrown. This gives you a single, centralized place to format error responses.

### 4.1 Replace `index.js` with the following code

```js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Simulate a database lookup
const users = { 1: { name: 'Alice' }, 2: { name: 'Bob' } };

app.get('/api/users/:id', (req, res, next) => {
    const user = users[req.params.id];
    if (!user) {
        // Create an error and pass it to the error handler
        const err = new Error(`User ${req.params.id} not found`);
        err.status = 404;
        return next(err);
    }
    res.json(user);
});

app.post('/api/orders', (req, res, next) => {
    const { item, quantity } = req.body;
    if (!item || !quantity) {
        const err = new Error('Missing required fields: item and quantity');
        err.status = 400;
        return next(err);
    }
    res.status(201).json({ message: 'Order placed', item, quantity });
});

// Simulate an unexpected crash
app.get('/api/crash', (req, res, next) => {
    throw new Error('Unexpected server failure');
});

// Centralized error-handling middleware (must have 4 parameters)
app.use((err, req, res, next) => {
    const status = err.status || 500;
    console.error(`[ERROR] ${status} — ${err.message}`);

    res.status(status).json({
        error: {
            message: err.message,
            status,
            // Only include stack trace in development
            ...(app.get('env') === 'development' && { stack: err.stack }),
        },
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
```

### 4.2 Run the server

```bash
node index.js
```

### 4.3 Test the routes

| Request | Expected Result |
|---------|-----------------|
| GET `/api/users/1` | `{ "name": "Alice" }` |
| GET `/api/users/99` | 404 — `User 99 not found` |
| POST `/api/orders` (empty body) | 400 — `Missing required fields` |
| POST `/api/orders` (body: `{"item": "Laptop", "quantity": 2}`) | 201 — Order placed |
| GET `/api/crash` | 500 — `Unexpected server failure` (with stack trace) |

**What's happening:** Instead of handling errors inside every route, you call `next(err)` and let the centralized error handler format the response. This keeps routes clean and ensures a consistent error format across the entire API. The four-parameter signature `(err, req, res, next)` is how Express distinguishes error middleware from regular middleware.

---

## Step 5: Third-Party Middleware

Third-party middleware packages extend Express with functionality that would be tedious to write yourself. The npm ecosystem has middleware for cookies, CORS, compression, security headers, rate limiting, and much more.

### 5.1 Install third-party packages

```bash
npm install cookie-parser cors helmet morgan
```

| Package | Purpose |
|---------|---------|
| `cookie-parser` | Parse cookies from the `Cookie` header |
| `cors` | Enable Cross-Origin Resource Sharing |
| `helmet` | Set security-related HTTP headers |
| `morgan` | HTTP request logger |

### 5.2 Replace `index.js` with the following code

```js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Third-party middleware stack
app.use(helmet());            // Security headers (X-Content-Type-Options, etc.)
app.use(cors());              // Allow cross-origin requests
app.use(morgan('dev'));       // Log requests: "GET / 200 3ms"
app.use(cookieParser());      // Parse cookies
app.use(express.json());      // Parse JSON bodies

// Demonstrate cookie-parser
app.get('/api/set-cookie', (req, res) => {
    res.cookie('theme', 'dark', { maxAge: 86400000, httpOnly: true });
    res.cookie('lang', 'en', { maxAge: 86400000 });
    res.json({ message: 'Cookies set! Visit /api/read-cookie to see them.' });
});

app.get('/api/read-cookie', (req, res) => {
    res.json({
        message: 'Cookies parsed by cookie-parser',
        cookies: req.cookies,
    });
});

// Demonstrate CORS — this endpoint can be called from any origin
app.get('/api/data', (req, res) => {
    res.json({
        message: 'This response includes CORS headers',
        data: [1, 2, 3],
    });
});

// Show all active middleware in one place
app.get('/', (req, res) => {
    res.json({
        message: 'Express app with third-party middleware',
        middleware: ['helmet (security)', 'cors (cross-origin)', 'morgan (logging)', 'cookie-parser (cookies)'],
        tryRoutes: ['/api/set-cookie', '/api/read-cookie', '/api/data'],
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
```

### 5.3 Run the server

```bash
node index.js
```

### 5.4 Test the routes

1. Visit `http://localhost:3000/` — see the list of active middleware
2. Visit `http://localhost:3000/api/set-cookie` — sets `theme` and `lang` cookies
3. Visit `http://localhost:3000/api/read-cookie` — see parsed cookies in the response
4. Check the terminal — `morgan` logs every request in color-coded format:

```
GET / 200 5.123 ms - 241
GET /api/set-cookie 200 1.456 ms - 65
GET /api/read-cookie 200 0.789 ms - 82
```

5. Inspect response headers in Postman or browser dev tools — `helmet` adds security headers like `X-Content-Type-Options: nosniff` and `X-Frame-Options: SAMEORIGIN`

**What's happening:** Each `app.use()` call adds a middleware layer to the request pipeline. `helmet` hardens the app against common attacks, `cors` adds the `Access-Control-Allow-Origin` header so browsers allow cross-origin fetch calls, `morgan` provides formatted request logs, and `cookie-parser` makes `req.cookies` available as a JavaScript object. In production apps, you'd typically use all four.

---

## Summary

| Middleware Type | How to Register | Key Characteristic |
|----------------|-----------------|-------------------|
| Application-level | `app.use(fn)` or `app.get(path, fn, handler)` | Runs on every request or specific routes |
| Router-level | `router.use(fn)` | Scoped to a router — doesn't affect other route groups |
| Error-handling | `app.use((err, req, res, next) => {})` | Must have 4 parameters; only runs when `next(err)` is called |
| Third-party | `app.use(package())` | Installed via npm; extends Express with production features |
