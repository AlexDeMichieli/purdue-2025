# Lesson 05 Demo 01 — HTTP Server and Callbacks

**Objective:** Build an HTTP server that serves different content types and understand the callback pattern through async file operations.

**Tools:** VS Code, npm

**Prerequisites:** None

---

## Why Callbacks?

Node.js is single-threaded but handles thousands of concurrent connections through **asynchronous I/O**. Instead of waiting for a file to load or a database to respond, Node registers a **callback** — a function to run when the operation completes — and moves on to other work. This is the foundation of Node's performance.

---

## Step 1: Create a Basic HTTP Server

```bash
mkdir httpDemo
cd httpDemo
touch index.js
code .
```

Write the following in `index.js`:

```js
const http = require('http');

const PORT = 3000;
const server = http.createServer();

// Event: server started successfully
server.on('listening', () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});

// Event: something went wrong (port in use, permissions, etc.)
server.on('error', (err) => {
    console.error('Server error:', err.message);
});

// Event: incoming request from a client
server.on('request', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        platform: process.platform,
        nodeVersion: process.version,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
    }));
});

server.listen(PORT);
```

```bash
node index.js
```

Open `http://127.0.0.1:3000` in your browser. You'll see a JSON response with system info.

The `server.on('request', callback)` pattern is a callback — Node calls your function every time a request arrives.

---

## Step 2: Serve Different Content Types

Replace `index.js` to handle multiple routes with different response types:

```js
const http = require('http');

const PORT = 3000;
const server = http.createServer();

server.on('request', (req, res) => {
    const path = req.url;

    // JSON response
    if (path === '/api') {
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ message: 'Hello from the API', time: Date.now() }));
    }

    // HTML response
    if (path === '/') {
        res.setHeader('Content-Type', 'text/html');
        return res.end(`
            <html>
                <body>
                    <h1>Welcome</h1>
                    <p>Try <a href="/api">/api</a> for JSON</p>
                </body>
            </html>
        `);
    }

    // 404 for unknown routes
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
});

server.listen(PORT, () => console.log(`Server running at http://127.0.0.1:${PORT}`));
```

```bash
node index.js
```

Test both routes:
- `http://127.0.0.1:3000/` — HTML page
- `http://127.0.0.1:3000/api` — JSON response

---

## Step 3: Callbacks with File Reading

Now let's see callbacks in action with file I/O. Create a data file:

```bash
touch greeting.txt
```

Add text to `greeting.txt`:

```
Hello! This message was loaded from a file on the server.
```

Replace `index.js`:

```js
const http = require('http');
const fs = require('fs');

const PORT = 3000;

// Callback #1: Read the file before starting the server
fs.readFile('./greeting.txt', 'utf8', (err, greeting) => {
    if (err) {
        console.error('Failed to load greeting:', err.message);
        greeting = 'Hello! (default message)';
    }

    console.log('Greeting loaded:', greeting);

    const server = http.createServer();

    // Callback #2: Handle each incoming request
    server.on('request', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            greeting: greeting.trim(),
            loadedAt: new Date().toISOString(),
            requestedPath: req.url
        }));
    });

    // Callback #3: Server started
    server.listen(PORT, () => {
        console.log(`Server running at http://127.0.0.1:${PORT}`);
    });
});

console.log('This prints FIRST — file is still being read...');
```

```bash
node index.js
```

Notice the output order:
1. "This prints FIRST" — runs immediately
2. "Greeting loaded" — runs when file read completes
3. "Server running" — runs when server starts

This demonstrates non-blocking I/O: Node doesn't wait for the file — it schedules a callback and keeps running.

---

## Step 4: Nested Callbacks (Callback Hell Preview)

What if you need to read multiple files? Callbacks can nest:

Create another file:

```bash
touch config.json
```

Add to `config.json`:

```json
{ "siteName": "My Node App", "version": "1.0.0" }
```

Replace `index.js`:

```js
const http = require('http');
const fs = require('fs');

const PORT = 3000;

// Read config first...
fs.readFile('./config.json', 'utf8', (err, configData) => {
    if (err) return console.error('Config error:', err.message);

    const config = JSON.parse(configData);
    console.log('Config loaded:', config.siteName);

    // ...then read greeting...
    fs.readFile('./greeting.txt', 'utf8', (err, greeting) => {
        if (err) return console.error('Greeting error:', err.message);

        console.log('Greeting loaded');

        // ...then start server
        const server = http.createServer((req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                site: config.siteName,
                version: config.version,
                greeting: greeting.trim()
            }));
        });

        server.listen(PORT, () => {
            console.log(`${config.siteName} running at http://127.0.0.1:${PORT}`);
        });
    });
});
```

```bash
node index.js
```

This works but nesting gets ugly fast — this is called **callback hell**. Later lessons cover Promises and async/await which solve this problem.

---

## Summary

| Concept | Example | What it does |
|---|---|---|
| Create server | `http.createServer()` | Creates an HTTP server instance |
| Handle requests | `server.on('request', callback)` | Callback fires for each incoming request |
| Send JSON | `res.end(JSON.stringify(obj))` | Sends JSON response to client |
| Read file async | `fs.readFile(path, encoding, callback)` | Reads file, calls back when done |
| Error-first callback | `(err, data) => { ... }` | Node convention: first arg is error, second is result |
| Non-blocking | Code after async call runs immediately | Node doesn't wait — schedules callback instead |
