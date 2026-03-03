# Lesson 06 Demo 02 — HTTP Routing

**Objective:** Build an HTTP server with multiple routes that handle different request methods and return various response types.

**Tools:** VS Code, npm

**Prerequisites:** None

---

## What is Routing?

Routing means responding differently based on the **URL path** and **HTTP method**. When a user visits `/about`, you serve the about page. When they POST to `/api/users`, you create a user. This demo builds routing from scratch to understand how frameworks like Express work under the hood.

---

## Step 1: Basic Route Handling

```bash
mkdir routingDemo
cd routingDemo
touch index.js
code .
```

Write the following in `index.js`:

```js
const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    const url = req.url;

    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body><h1>Welcome to My App</h1></body></html>');
        return;
    }

    if (url === '/about') {
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body><h1>About Us</h1><p>We build cool stuff.</p></body></html>');
        return;
    }

    if (url === '/api/status') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
        return;
    }

    // 404 fallback
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('404 Not Found');
});

server.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
```

```bash
node index.js
```

Test the routes:
- `http://127.0.0.1:3000/` — HTML welcome page
- `http://127.0.0.1:3000/about` — About page
- `http://127.0.0.1:3000/api/status` — JSON status
- `http://127.0.0.1:3000/anything-else` — 404

---

## Step 2: Handle Different HTTP Methods

Real APIs need to distinguish between GET, POST, PUT, DELETE. Replace `index.js`:

```js
const http = require('http');

const PORT = 3000;

// Simple in-memory data store
let todos = [
    { id: 1, task: 'Learn Node.js', done: false },
    { id: 2, task: 'Build an API', done: false }
];

const server = http.createServer((req, res) => {
    const { url, method } = req;

    // Set JSON header for all API routes
    if (url.startsWith('/api')) {
        res.setHeader('Content-Type', 'application/json');
    }

    // GET /api/todos — list all todos
    if (method === 'GET' && url === '/api/todos') {
        return res.end(JSON.stringify(todos));
    }

    // POST /api/todos — create a todo
    if (method === 'POST' && url === '/api/todos') {
        let body = '';
        req.on('data', (chunk) => body += chunk);
        req.on('end', () => {
            const { task } = JSON.parse(body);
            const newTodo = { id: todos.length + 1, task, done: false };
            todos.push(newTodo);
            res.statusCode = 201;
            res.end(JSON.stringify(newTodo));
        });
        return;
    }

    // DELETE /api/todos/:id — delete a todo
    if (method === 'DELETE' && url.startsWith('/api/todos/')) {
        const id = parseInt(url.split('/')[3]);
        const index = todos.findIndex((t) => t.id === id);
        if (index === -1) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'Todo not found' }));
        }
        todos.splice(index, 1);
        return res.end(JSON.stringify({ message: `Todo ${id} deleted` }));
    }

    // Home page
    if (method === 'GET' && url === '/') {
        res.setHeader('Content-Type', 'text/html');
        return res.end(`
            <html>
            <body>
                <h1>Todo API</h1>
                <p>Endpoints:</p>
                <ul>
                    <li>GET /api/todos</li>
                    <li>POST /api/todos</li>
                    <li>DELETE /api/todos/:id</li>
                </ul>
            </body>
            </html>
        `);
    }

    // 404
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
```

```bash
node index.js
```

Test with curl:

```bash
# List todos
curl http://127.0.0.1:3000/api/todos

# Create a todo
curl -X POST http://127.0.0.1:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"task": "Write documentation"}'

# Delete a todo
curl -X DELETE http://127.0.0.1:3000/api/todos/1

# List again
curl http://127.0.0.1:3000/api/todos
```

---

## Step 3: Extract a Simple Router

The `if` chain gets messy fast. Let's build a simple router pattern:

Replace `index.js`:

```js
const http = require('http');

const PORT = 3000;

// Route registry
const routes = {
    'GET /': (req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Home</h1><p><a href="/about">About</a> | <a href="/api/time">API</a></p>');
    },

    'GET /about': (req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>About</h1><p>A simple Node.js router.</p>');
    },

    'GET /api/time': (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            time: new Date().toISOString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }));
    },

    'GET /api/info': (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            platform: process.platform,
            nodeVersion: process.version,
            uptime: Math.floor(process.uptime()) + 's'
        }));
    },

    'POST /api/echo': async (req, res) => {
        let body = '';
        for await (const chunk of req) body += chunk;

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ echo: body }));
    }
};

const server = http.createServer((req, res) => {
    const key = `${req.method} ${req.url.split('?')[0]}`;
    const handler = routes[key];

    if (handler) {
        handler(req, res);
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Route not found', tried: key }));
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
    console.log('Routes:', Object.keys(routes).join(', '));
});
```

```bash
node index.js
```

Test the routes:

```bash
curl http://127.0.0.1:3000/api/time
curl http://127.0.0.1:3000/api/info
curl -X POST http://127.0.0.1:3000/api/echo -d "Hello World"
```

---

## Step 4: Add Route Parameters

Real apps need dynamic routes like `/users/:id`. Here's a simple pattern matcher:

Replace `index.js`:

```js
const http = require('http');

const PORT = 3000;

// Mock database
const users = [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' },
    { id: 3, name: 'Charlie', role: 'user' }
];

// Simple pattern matching for :param syntax
function matchRoute(pattern, url) {
    const patternParts = pattern.split('/');
    const urlParts = url.split('/');

    if (patternParts.length !== urlParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
            params[patternParts[i].slice(1)] = urlParts[i];
        } else if (patternParts[i] !== urlParts[i]) {
            return null;
        }
    }
    return params;
}

const server = http.createServer((req, res) => {
    const { method, url } = req;
    const path = url.split('?')[0];

    res.setHeader('Content-Type', 'application/json');

    // GET /users — list all
    if (method === 'GET' && path === '/users') {
        return res.end(JSON.stringify(users));
    }

    // GET /users/:id — get one
    const userParams = matchRoute('/users/:id', path);
    if (method === 'GET' && userParams) {
        const user = users.find((u) => u.id === parseInt(userParams.id));
        if (!user) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'User not found' }));
        }
        return res.end(JSON.stringify(user));
    }

    // GET /users/:id/posts — nested resource
    const postsParams = matchRoute('/users/:id/posts', path);
    if (method === 'GET' && postsParams) {
        const userId = parseInt(postsParams.id);
        const user = users.find((u) => u.id === userId);
        if (!user) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'User not found' }));
        }
        // Mock posts
        const posts = [
            { id: 1, userId, title: `${user.name}'s first post` },
            { id: 2, userId, title: `${user.name}'s second post` }
        ];
        return res.end(JSON.stringify(posts));
    }

    // Home
    if (method === 'GET' && path === '/') {
        res.setHeader('Content-Type', 'text/html');
        return res.end(`
            <h1>User API</h1>
            <ul>
                <li><a href="/users">/users</a> — list all</li>
                <li><a href="/users/1">/users/1</a> — get user 1</li>
                <li><a href="/users/1/posts">/users/1/posts</a> — user 1's posts</li>
            </ul>
        `);
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
```

```bash
node index.js
```

Test:

```bash
curl http://127.0.0.1:3000/users
curl http://127.0.0.1:3000/users/2
curl http://127.0.0.1:3000/users/2/posts
curl http://127.0.0.1:3000/users/999  # 404
```

---

## Summary

| Concept | Example | What it does |
|---|---|---|
| Basic routing | `if (url === '/about')` | Match exact URL paths |
| Method routing | `if (method === 'POST' && url === ...)` | Different handlers for GET/POST/etc. |
| Route registry | `routes['GET /path'] = handler` | Clean lookup table for routes |
| Dynamic params | `/users/:id` → `{ id: '123' }` | Extract values from URL |
| Nested routes | `/users/:id/posts` | Related resources |
| 404 fallback | `res.statusCode = 404` | Handle unknown routes |

> This is exactly what Express does internally — just with more features like middleware, better pattern matching, and `req.params`. Understanding the basics makes frameworks less magical.
