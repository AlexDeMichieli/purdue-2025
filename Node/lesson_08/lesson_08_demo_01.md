# Lesson 08 Demo 01 — Installing Express.js and Creating a Hello World App

**Objective:** Install Express.js and run a Hello World server for basic server functionality

**Tools:** VS Code, Node.js

**Prerequisites:** Knowledge of JavaScript and Node.js

---

## Overview

Express.js is the most popular web framework for Node.js. It provides a minimal, flexible layer on top of Node.js that simplifies building web servers and APIs. In this demo, you'll set up Express from scratch and create a Hello World server.

---

## Step 1: Verify the Installation of Node.js

Open the terminal and run the following commands to verify Node.js and npm are installed:

```bash
node -v
npm -v
```

You should see version numbers for both (e.g., `v20.x.x` and `10.x.x`). If not, install Node.js from [https://nodejs.org](https://nodejs.org).

---

## Step 2: Set Up the Project and Install Express.js

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

Press **Enter** to accept the default value for each prompt. When asked `Is this OK? (yes)`, type `yes` to confirm. This generates a `package.json` file that tracks your project's metadata and dependencies.

Install Express:

```bash
npm install express
```

> **Note:** Running `npm install express` installs the Express module into `node_modules/` and automatically adds it to the `dependencies` section of `package.json`. This ensures anyone who clones the project can run `npm install` to get the same dependencies.

---

## Step 3: Create a Hello World Express App

In the `Expressjs` directory, create a file named `index.js` and add the following code:

```js
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
```

### How This Works

| Code | Purpose |
|---|---|
| `require('express')` | Imports the Express module |
| `express()` | Creates an Express application instance |
| `app.get('/', ...)` | Defines a route handler for GET requests to the root path (`/`) |
| `res.send('Hello World!')` | Sends "Hello World!" as the HTTP response body |
| `app.listen(port, ...)` | Starts the server and listens for connections on port 3000 |

### Express Request/Response Flow

1. The client (browser) sends an HTTP GET request to `http://localhost:3000/`
2. Express matches the request to the `app.get('/')` route
3. The callback function runs and calls `res.send('Hello World!')`
4. The server sends the response back to the client

---

## Step 4: Run the Server

Execute the following command in the terminal:

```bash
node index.js
```

You should see:

```
Example app listening on port 3000
```

---

## Step 5: Test in the Browser

Open a browser and visit:

```
http://localhost:3000/
```

You should see **Hello World!** displayed in the browser, confirming the Express server is running and responding to requests.

To stop the server, press `Ctrl + C` in the terminal.

---

## Key Concepts

### What is Express.js?

Express is a **web application framework** for Node.js. While Node.js has a built-in `http` module for creating servers, Express simplifies this by providing:

- **Routing** — map URLs to handler functions
- **Middleware** — plug in reusable request processing logic
- **Convenience methods** — `res.send()`, `res.json()`, `res.redirect()`, etc.

### Express vs. Raw Node.js

| Feature | Node.js `http` Module | Express.js |
|---|---|---|
| Routing | Manual URL parsing | Built-in `app.get()`, `app.post()`, etc. |
| Response helpers | `res.writeHead()` + `res.end()` | `res.send()`, `res.json()` |
| Middleware support | Manual | Built-in `app.use()` |
| Code complexity | More boilerplate | Concise and readable |

---

## Summary

### What You Learned

- How to verify Node.js and npm installation
- How to initialize a Node.js project with `npm init`
- How to install Express.js as a project dependency
- How to create a basic Express server with a route handler
- How to run and test an Express application in the browser
- How Express simplifies server creation compared to raw Node.js

### Next Steps

In the next demo, you'll learn how to handle different HTTP methods (GET and POST) and test them using Postman.
