# Lesson 10 Demo 02 — Working with Built-in Middleware Functions

**Objective:** Work with various built-in middleware functions in Express.js by setting up and testing different types of middleware and verifying responses using Postman

**Tools:** VS Code, Node.js, Postman

**Prerequisites:** Knowledge of JavaScript and Node.js

---

## Overview

Express ships with several built-in middleware functions that handle common tasks like parsing request bodies and serving files. Understanding these middlewares is essential because almost every Express app uses them — they sit between the incoming request and your route handler, transforming the raw HTTP data into something your code can easily work with.

| Middleware | What It Parses | `req.body` Type |
|------------|---------------|-----------------|
| `express.json()` | JSON payloads (`application/json`) | JavaScript object |
| `express.raw()` | Any payload as raw bytes | `Buffer` |
| `express.text()` | Plain text (`text/plain`) | `string` |
| `express.static()` | N/A — serves files from disk | N/A |
| `express.Router()` | N/A — modular route grouping | N/A |

---

## Step 1: Project Setup & Install Postman

### 1.1 Create the project

```bash
mkdir express-middleware-demo
cd express-middleware-demo
npm init -y
npm install express ejs
touch index.js
```

### 1.2 Install Postman

Download Postman from [https://www.postman.com/downloads](https://www.postman.com/downloads) or install via terminal:

```bash
# macOS (Homebrew)
brew install --cask postman

# Linux (Snap)
sudo snap install postman
```

Open Postman, sign in, go to the **Collections** tab, click **Create Collection**, and name it `Express Middleware`. You'll add requests here for each step.

---

## Step 2: Test `express.json()` Middleware

This is the most commonly used middleware in modern Express apps — it parses incoming JSON request bodies so you can access `req.body` as a JavaScript object. Any API that accepts JSON (which is nearly all of them) needs this.

### 2.1 Add the following code to `index.js`

```js
const express = require('express');
const app = express();
const PORT = 3000;

// Parse JSON bodies — needed for any API that accepts JSON input
app.use(express.json());

// Simulate creating a new user
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    console.log('New user request:', { name, email });

    // In a real app, you'd save to a database here
    res.status(201).json({
        message: 'User created',
        user: { id: Date.now(), name, email },
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

### 2.3 Test with Postman

1. Inside your collection, click **Add a request** and name it `Create User`
2. Set the method to **POST** and the URL to `http://localhost:3000/api/users`
3. Go to the **Body** tab, select **raw**, choose **JSON** from the dropdown
4. Enter the following payload:

```json
{
    "name": "Jane Doe",
    "email": "jane@example.com"
}
```

5. Click **Send**

**Expected response (201 Created):**

```json
{
    "message": "User created",
    "user": {
        "id": 1708901234567,
        "name": "Jane Doe",
        "email": "jane@example.com"
    }
}
```

The terminal also logs: `New user request: { name: 'Jane Doe', email: 'jane@example.com' }`

**What's happening:** `express.json()` reads the `Content-Type: application/json` header, parses the raw body bytes into a JavaScript object, and attaches it to `req.body`. Without this middleware, `req.body` would be `undefined`.

---

## Step 3: Test `express.raw()` Middleware

`express.raw()` gives you the request body as a raw `Buffer`. This is useful when you need to process binary data — for example, receiving webhook payloads that require signature verification (like Stripe or GitHub webhooks), or accepting file uploads.

### 3.1 Replace `index.js` with the following code

```js
const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

const WEBHOOK_SECRET = 'my-secret-key';

// Parse body as raw Buffer — needed for signature verification
app.use(express.raw({ type: 'application/json' }));

// Simulate a webhook endpoint that verifies payload signatures
app.post('/webhook', (req, res) => {
    const rawBody = req.body; // This is a Buffer
    console.log('Body type:', typeof rawBody, '| Is Buffer:', Buffer.isBuffer(rawBody));
    console.log('Raw bytes:', rawBody.length, 'bytes');

    // Compute an HMAC signature from the raw bytes
    const signature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

    console.log('Computed signature:', signature);

    // Parse the buffer into JSON after verification
    const payload = JSON.parse(rawBody.toString());
    console.log('Parsed payload:', payload);

    res.json({
        received: true,
        event: payload.event,
        signature,
    });
});

app.listen(PORT, () => {
    console.log(`Webhook server listening on http://localhost:${PORT}`);
});
```

### 3.2 Run the server

```bash
node index.js
```

### 3.3 Test with Postman

1. Create a new **POST** request to `http://localhost:3000/webhook`
2. Go to the **Body** tab, select **raw**, choose **JSON**
3. Enter:

```json
{
    "event": "payment.completed",
    "amount": 49.99
}
```

4. Click **Send**

**Expected terminal output:**

```
Body type: object | Is Buffer: true
Raw bytes: 52 bytes
Computed signature: <hex string>
Parsed payload: { event: 'payment.completed', amount: 49.99 }
```

**What's happening:** `express.raw()` skips JSON parsing and hands you the raw `Buffer`. This is critical for webhook verification — services like Stripe sign the raw bytes, so if you parse to JSON first (losing exact byte ordering and whitespace), the signature check fails.

---

## Step 4: Test `express.Router()` for Modular Routing

`express.Router()` creates a mini-application with its own routes and middleware. Real apps use it to organize routes into separate files — one router for users, another for products, etc.

### 4.1 Replace `index.js` with the following code

```js
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// --- User routes ---
const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    res.json({ users: ['Alice', 'Bob', 'Charlie'] });
});

userRouter.get('/:id', (req, res) => {
    res.json({ user: `User ${req.params.id}` });
});

// --- Product routes ---
const productRouter = express.Router();

productRouter.get('/', (req, res) => {
    res.json({ products: ['Laptop', 'Phone', 'Tablet'] });
});

productRouter.post('/', (req, res) => {
    console.log('New product:', req.body);
    res.status(201).json({ message: 'Product created', product: req.body });
});

// Mount routers at different base paths
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);

app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`);
    console.log('Routes:');
    console.log('  GET  /api/users');
    console.log('  GET  /api/users/:id');
    console.log('  GET  /api/products');
    console.log('  POST /api/products');
});
```

### 4.2 Run the server

```bash
node index.js
```

### 4.3 Test with Postman (or browser for GET requests)

| Method | URL | Expected Result |
|--------|-----|-----------------|
| GET | `http://localhost:3000/api/users` | List of users |
| GET | `http://localhost:3000/api/users/42` | `{ user: "User 42" }` |
| GET | `http://localhost:3000/api/products` | List of products |
| POST | `http://localhost:3000/api/products` (body: `{"name": "Monitor"}`) | 201 Created |

**What's happening:** Each `express.Router()` is an isolated group of routes. `app.use('/api/users', userRouter)` mounts the user router so that `userRouter.get('/')` actually responds to `/api/users/`. This keeps route files small, testable, and organized — the same pattern used by every large Express codebase.

---

## Step 5: Test `express.static()` with EJS Template

`express.static()` serves files directly from a folder — CSS, JavaScript, images — without writing any route handlers. Combined with a template engine, this is how Express serves full web pages.

### 5.1 Install EJS (if not already installed)

```bash
npm install ejs
```

### 5.2 Replace `index.js` with the following code

```js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve CSS, JS, and images from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Use EJS for server-side templates
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Middleware Demo',
        features: ['express.json()', 'express.raw()', 'express.text()', 'express.static()'],
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
```

### 5.3 Create the public folder with a CSS file

```bash
mkdir -p public/css
```

Create `public/css/style.css`:

```css
body {
    font-family: system-ui, -apple-system, sans-serif;
    max-width: 600px;
    margin: 40px auto;
    padding: 0 20px;
    background: #f5f5f5;
}
h1 { color: #333; }
ul { line-height: 1.8; }
li code { background: #e0e0e0; padding: 2px 6px; border-radius: 3px; }
```

### 5.4 Create the EJS template

Create `views/index.ejs`:

```html
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <h1><%= title %></h1>
    <p>Express built-in middleware functions covered in this demo:</p>
    <ul>
        <% features.forEach(function(feature) { %>
            <li><code><%= feature %></code></li>
        <% }); %>
    </ul>
</body>
</html>
```

### 5.5 Run the server and test

```bash
node index.js
```

Browse to `http://localhost:3000/`. You should see a styled page listing all the middleware functions. The CSS is served automatically by `express.static()` — no route handler needed.

**What's happening:** `express.static()` maps a folder on disk to a URL path. Any file in `public/` is accessible by its relative path (e.g., `public/css/style.css` becomes `http://localhost:3000/css/style.css`). Express checks for matching files *before* hitting your routes, so static assets are served fast with no extra code.

---

## Step 6: Test `express.text()` Middleware

`express.text()` parses incoming request bodies with a `Content-Type` of `text/plain` and makes `req.body` available as a string. This is useful for endpoints that accept plain text — log ingestion, simple form data, or plain-text APIs.

### 6.1 Replace `index.js` with the following code

```js
const express = require('express');
const app = express();
const PORT = 3000;

// Parse plain text bodies
app.use(express.text());

// Simulate a note-taking endpoint
app.post('/api/notes', (req, res) => {
    const noteText = req.body; // This is a string
    console.log('Type:', typeof noteText);
    console.log('Received note:', noteText);

    const wordCount = noteText.split(/\s+/).filter(Boolean).length;

    res.json({
        message: 'Note saved',
        wordCount,
        preview: noteText.length > 50 ? noteText.substring(0, 50) + '...' : noteText,
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
```

### 6.2 Run the server

```bash
node index.js
```

### 6.3 Test with Postman

1. Create a new **POST** request to `http://localhost:3000/api/notes`
2. Go to the **Body** tab, select **raw**, choose **Text** from the dropdown
3. Enter some plain text:

```
Meeting notes: Discussed the new API design. Need to finalize authentication strategy by Friday.
```

4. Click **Send**

**Expected response:**

```json
{
    "message": "Note saved",
    "wordCount": 14,
    "preview": "Meeting notes: Discussed the new API design. Need..."
}
```

**Terminal output:**

```
Type: string
Received note: Meeting notes: Discussed the new API design. Need to finalize authentication strategy by Friday.
```

**What's happening:** `express.text()` reads the raw body and sets `req.body` to a plain string (instead of a Buffer or parsed object). The `Content-Type` must be `text/plain` for this middleware to activate — if you send JSON content-type, it won't parse it.

---

## Summary

| Middleware | Parses | `req.body` Type | Real-World Use Case |
|------------|--------|-----------------|---------------------|
| `express.json()` | `application/json` | Object | REST API endpoints accepting JSON |
| `express.raw()` | Configurable | `Buffer` | Webhook signature verification |
| `express.text()` | `text/plain` | `string` | Log ingestion, plain-text APIs |
| `express.static()` | Serves files | N/A | CSS, JS, images, downloads |
| `express.Router()` | N/A | N/A | Modular route organization |
