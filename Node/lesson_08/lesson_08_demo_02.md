# Lesson 08 Demo 02 — Handling GET and POST Requests

**Objective:** Demonstrate GET and POST requests in an Express.js application using Postman to verify server functionality and HTTP responses

**Tools:** VS Code, Postman, Express, Node.js

**Prerequisites:** Knowledge of JavaScript and Node.js

---

## Overview

HTTP methods define what action a client wants to perform on a server resource. The two most common methods are:

- **GET** — retrieve data from the server
- **POST** — send data to the server

In this demo, you'll build an Express app that handles both GET and POST requests on the same route, then use Postman to test each method.

---

## Step 1: Verify the Installation of Node.js

Open the terminal and run the following commands to verify Node.js and npm are installed:

```bash
node -v
npm -v
```

You should see version numbers for both. If Node.js is not installed, download it from [https://nodejs.org](https://nodejs.org).

---

## Step 2: Create an Express Application

Create a new project directory and navigate into it:

```bash
mkdir Expressjs
cd Expressjs
```

Open the directory in VS Code:

```bash
code .
```

Initialize a new Node.js project in the terminal:

```bash
npm init
```

Press **Enter** to accept the default values for each prompt. When asked `Is this OK? (yes)`, type `yes` to confirm and generate the `package.json` file.

Install Express:

```bash
npm install express
```

> **Note:** This installs Express and automatically adds it to the `dependencies` section of `package.json`.

---

## Step 3: Install and Configure Postman

### What is Postman?

Postman is a tool for testing APIs. It lets you send HTTP requests (GET, POST, PUT, DELETE, etc.) to a server and inspect the responses — without needing to write client-side code or use a browser.

### Install Postman

**Option 1 — Linux (snap):**

```bash
sudo snap install postman
```

**Option 2 — macOS / Windows:**

Download from [https://www.postman.com/downloads/](https://www.postman.com/downloads/) and install.

### Set Up a Collection

1. Open Postman
2. Click **Collections** in the left panel
3. Click the **+** button to create a new collection
4. Name it **Expressjs**

Collections help you organize related API requests together for easy access and testing.

### Quick Test

1. Select **GET** from the request type dropdown
2. Enter a URL (e.g., `http://localhost:3000`)
3. Click **Send**

> You'll get an error for now since we haven't started the server yet — that's expected.

---

## Step 4: Handle GET and POST Requests

### Write the Server Code

Inside your `Expressjs` folder, create (or open) `index.js` and add the following code:

```js
var express = require('express');
var app = express();
var PORT = 3000;

app.route('/routerexample')
    .get((req, res, next) => {
        console.log('GET request called');
        res.send('GET request called');
    })
    .post((req, res, next) => {
        console.log('POST request called');
        res.send('POST request called');
    });

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log('Server listening on PORT', PORT);
});
```

### How This Works

| Code | Purpose |
|---|---|
| `app.route('/routerexample')` | Defines a single route path that can handle multiple HTTP methods |
| `.get(...)` | Handles GET requests to `/routerexample` |
| `.post(...)` | Handles POST requests to `/routerexample` |
| `req` | The incoming request object (contains headers, query params, body, etc.) |
| `res` | The response object (used to send data back to the client) |
| `next` | A callback to pass control to the next middleware (not used here, but available) |

> **Why `app.route()`?** — It lets you chain multiple HTTP method handlers on the same path, keeping the code DRY (Don't Repeat Yourself) instead of writing separate `app.get()` and `app.post()` calls.

### Start the Server

Run the following command:

```bash
node index.js
```

You should see:

```
Server listening on PORT 3000
```

---

## Step 5: Test with Postman

### Test the GET Request

1. Open Postman
2. Select **GET** from the method dropdown
3. Enter the URL: `http://localhost:3000/routerexample`
4. Click **Send**

You should see `GET request called` in the response body, and the terminal will log:

```
GET request called
```

### Test the POST Request

1. Change the method dropdown from **GET** to **POST**
2. Keep the same URL: `http://localhost:3000/routerexample`
3. Click **Send**

You should see `POST request called` in the response body, and the terminal will log:

```
POST request called
```

Both the Postman response and the terminal output confirm that the Express server correctly handles GET and POST requests on the same route.

---

## Key Concepts

### Common HTTP Methods

| Method | Purpose | Example Use Case |
|---|---|---|
| **GET** | Retrieve data | Fetching a list of users |
| **POST** | Create/send data | Submitting a form or creating a new user |
| **PUT** | Update existing data | Updating a user's profile |
| **DELETE** | Remove data | Deleting a user account |

### `app.route()` vs. Individual Methods

```js
// Using app.route() — grouped and clean
app.route('/users')
    .get((req, res) => { /* get users */ })
    .post((req, res) => { /* create user */ });

// Using individual methods — equivalent but more verbose
app.get('/users', (req, res) => { /* get users */ });
app.post('/users', (req, res) => { /* create user */ });
```

Both approaches work identically. `app.route()` is preferred when a single path handles multiple methods.

### Why Use Postman?

- **Test without a frontend** — send requests directly to your API
- **Inspect responses** — view status codes, headers, and body
- **Save requests** — organize tests in collections for reuse
- **Share with teams** — export collections for collaboration

---

## Summary

### What You Learned

- How to set up and use Postman for API testing
- How to define multiple HTTP method handlers on a single route using `app.route()`
- How to handle GET and POST requests in Express
- How to verify server responses using both Postman and terminal logs
- The difference between common HTTP methods (GET, POST, PUT, DELETE)

### Next Steps

- Add PUT and DELETE handlers to `app.route()`
- Use `express.json()` middleware to parse JSON request bodies in POST requests
- Build a full CRUD API with Express
