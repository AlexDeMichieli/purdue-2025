# Lesson 09 Demo 01 — Working with Express.js Frameworks

**Objective:** Work with the Express.js framework for a comprehensive understanding of web development

**Tools:** VS Code, Postman, Express.js, Node.js

**Prerequisites:** Knowledge of JavaScript and Node.js

---

## Overview

This demo walks through core Express.js features: routing, URL building, templating (Pug and EJS), serving static files, error handling, and debugging. Each step builds a small standalone example to illustrate a different capability of the framework.

---

## Step 1: Perform Routing in Express.js

### 1.1 Create the project folder

```bash
mkdir ExpressJS
cd ExpressJS
npm init -y
npm install express
```

### 1.2 Create `index.js` and add the following code

```js
var express = require('express');
var app = express();
var PORT = 3000;

// Single routing
var router = express.Router();

router.get('/', function (req, res, next) {
    console.log("express.Router() is Working");
    res.end();
});

app.use(router);

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});
```

### 1.3 Run the server

```bash
node index.js
```

### 1.4 Test the route

Make a GET request to `http://localhost:3000/` using Postman or a browser. The terminal should print:

```
express.Router() is Working
```

**What's happening:** `express.Router()` creates a modular, mountable route handler. The `router.get('/')` callback fires on GET requests to the root path, and `app.use(router)` mounts it into the application.

---

## Step 2: Build a URL in Express.js

### 2.1 Replace `index.js` with the following code

```js
const express = require('express');
const app = express();
const PORT = 3000;

app.get('*', function (req, res) {
    const protocol = req.protocol;
    const host = req.hostname;
    const url = req.originalUrl;
    const port = process.env.PORT || PORT;

    const fullUrl = `${protocol}://${host}:${port}${url}`;

    const responseString = `Full URL is: ${fullUrl}`;
    res.send(responseString);
});

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    else
        console.log("Error occurred, server can't start", error);
});
```

### 2.2 Run the server

```bash
node index.js
```

### 2.3 Test in the browser

Navigate to `http://localhost:3000/`. The page should display:

```
Full URL is: http://localhost:3000/
```

Try different paths like `http://localhost:3000/test/page` to see the full URL reflected back.

**What's happening:** Express exposes `req.protocol`, `req.hostname`, and `req.originalUrl` so you can reconstruct the full request URL. The `'*'` wildcard route matches any path.

---

## Step 3: Templating with Pug in Express.js

### 3.1 Install Pug

```bash
npm install pug --save
```

### 3.2 Replace `index.js` with the following code

```js
const express = require('express');
const app = express();

app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index', { title: 'Hey', message: 'Hello there!' });
});

app.listen(3000, () => {
    console.log("server is running on port 3000");
});
```

### 3.3 Create the template

Create a `views` folder and inside it create `index.pug`:

```pug
html
  head
    title= title
  body
    h1= message
```

### 3.4 Run the server and test

```bash
node index.js
```

Browse to `http://localhost:3000/`. You should see **Hello there!** rendered as an `<h1>` heading.

**What's happening:** `app.set('view engine', 'pug')` tells Express to use the Pug templating engine. `res.render('index', { ... })` compiles `views/index.pug` with the provided data and sends the resulting HTML to the client.

---

## Step 4: Create Static Files in Express.js

### 4.1 Install EJS

```bash
npm install ejs
```

### 4.2 Replace `index.js` with the following code

```js
var express = require('express');
var app = express();
var path = require('path');
var PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res, next) {
    res.render('index.ejs');
});

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});
```

### 4.3 Create the EJS template

Create a `views` folder (if it doesn't already exist) and add `index.ejs`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Express JS Framework</title>
</head>
<body>
    <h1>express.static() is working</h1>
</body>
</html>
```

### 4.4 Create the public folder

```bash
mkdir public
```

This folder is where you would place CSS, JavaScript, and image files that should be served directly to the client.

### 4.5 Run the server and test

```bash
node index.js
```

Browse to `http://localhost:3000/`. You should see **express.static() is working**.

**What's happening:** `express.static()` is built-in middleware that serves files from a directory (here, `public/`). Any file placed in `public/` is accessible by its filename in the browser (e.g., `http://localhost:3000/style.css`).

---

## Step 5: Handle Error States in Express.js

### 5.1 Replace `index.js` with the following code

```js
var express = require('express');
var app = express();
var PORT = 3000;

// View engine setup
app.set('view engine', 'ejs');

app.render('index', function (err, html) {
    if (err) console.log(err);
    console.log(html);
});

app.listen(PORT, function (err) {
    if (err) console.log("Error in server setup");
    console.log("Server listening on Port", PORT);
});
```

### 5.2 Create the EJS template

Ensure `views/index.ejs` exists with the following content:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Handling Error States</title>
</head>
<body>
    <h1>app.render() is working</h1>
</body>
</html>
```

### 5.3 Run the server

```bash
node index.js
```

The terminal should print the rendered HTML string. If the template is missing or has errors, the `err` callback captures and logs them.

**What's happening:** `app.render()` renders a view without sending it to the client — it passes the result (or error) to a callback. This is useful for generating HTML server-side (e.g., for emails) or for testing that templates compile correctly.

---

## Step 6: Debug in Express.js

### 6.1 Replace `index.js` with the following code

```js
var express = require('express');
var app = express();
var PORT = 3000;

app.listen(PORT, function (err) {
    if (err) console.log("Error in server setup");
    console.log("Server listening on Port", PORT);
});
```

### 6.2 Run with debug logging enabled

```bash
DEBUG=express:* node index.js
```

This outputs detailed internal Express debug information — every route match, middleware call, and response — which is invaluable when troubleshooting.

**What's happening:** Express uses the `debug` module internally. Setting `DEBUG=express:*` activates all Express-related debug namespaces, giving you visibility into the framework's internals without adding any logging code yourself.

---

## Summary

| Step | Feature | Key API / Concept |
|------|---------|-------------------|
| 1 | Routing | `express.Router()`, `router.get()` |
| 2 | URL Building | `req.protocol`, `req.hostname`, `req.originalUrl` |
| 3 | Pug Templating | `app.set('view engine', 'pug')`, `res.render()` |
| 4 | Static Files | `express.static()`, `path.join()` |
| 5 | Error Handling | `app.render()` with error callback |
| 6 | Debugging | `DEBUG=express:*` environment variable |
