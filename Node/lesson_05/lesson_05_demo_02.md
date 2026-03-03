# Lesson 05 Demo 02 — Parsing HTTP Requests

**Objective:** Parse different parts of an HTTP request — URL path, query parameters, headers, and request body.

**Tools:** VS Code, npm

**Prerequisites:** None

---

## What's in an HTTP Request?

When a browser or client sends a request, it includes:

- **Method** — GET, POST, PUT, DELETE, etc.
- **URL** — path + query string (e.g., `/search?q=node`)
- **Headers** — metadata like `Content-Type`, `User-Agent`, cookies
- **Body** — data sent with POST/PUT requests (forms, JSON)

This demo shows how to extract and use each part.

---

## Step 1: Parse the URL Path and Query String

```bash
mkdir parserDemo
cd parserDemo
touch index.js
code .
```

Write the following in `index.js`:

```js
const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Split URL into path and query string
    const [path, queryString] = req.url.split('?');

    // Parse query string into an object
    const query = Object.fromEntries(new URLSearchParams(queryString));

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        method: req.method,
        path: path,
        query: query
    }, null, 2));
});

server.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
```

```bash
node index.js
```

Test it: `http://127.0.0.1:3000/users?name=Alice&role=admin`

Returns:
```json
{
  "method": "GET",
  "path": "/users",
  "query": {
    "name": "Alice",
    "role": "admin"
  }
}
```

---

## Step 2: Read Request Headers

Headers contain useful metadata. Update `index.js`:

```js
const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    const [path, queryString] = req.url.split('?');
    const query = Object.fromEntries(new URLSearchParams(queryString));

    // Extract useful headers
    const headers = {
        userAgent: req.headers['user-agent'],
        host: req.headers['host'],
        accept: req.headers['accept'],
        contentType: req.headers['content-type'] || 'none'
    };

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        method: req.method,
        path: path,
        query: query,
        headers: headers
    }, null, 2));
});

server.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
```

```bash
node index.js
```

Refresh the browser to see your browser's headers in the response.

---

## Step 3: Parse the Request Body (POST Data)

GET requests don't have a body, but POST/PUT requests do. The body arrives in **chunks** — another callback pattern.

Replace `index.js`:

```js
const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    const [path] = req.url.split('?');

    // Collect body chunks
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        // Parse JSON body if present
        let parsedBody = null;
        if (body && req.headers['content-type'] === 'application/json') {
            try {
                parsedBody = JSON.parse(body);
            } catch (e) {
                parsedBody = { error: 'Invalid JSON' };
            }
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            method: req.method,
            path: path,
            bodyRaw: body || null,
            bodyParsed: parsedBody
        }, null, 2));
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
```

```bash
node index.js
```

Test with curl (or Postman):

```bash
curl -X POST http://127.0.0.1:3000/api \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "age": 30}'
```

Returns:
```json
{
  "method": "POST",
  "path": "/api",
  "bodyRaw": "{\"name\": \"Alice\", \"age\": 30}",
  "bodyParsed": {
    "name": "Alice",
    "age": 30
  }
}
```

---

## Step 4: Build a Simple API Router

Combine everything into a mini API that handles different methods and routes:

Replace `index.js`:

```js
const http = require('http');

const PORT = 3000;

// In-memory "database"
let users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
];

function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : null);
            } catch {
                resolve(null);
            }
        });
    });
}

const server = http.createServer(async (req, res) => {
    const [path] = req.url.split('?');
    const method = req.method;

    res.setHeader('Content-Type', 'application/json');

    // GET /users — list all users
    if (method === 'GET' && path === '/users') {
        return res.end(JSON.stringify(users));
    }

    // POST /users — add a user
    if (method === 'POST' && path === '/users') {
        const body = await parseBody(req);
        if (!body || !body.name) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Name is required' }));
        }
        const newUser = { id: users.length + 1, name: body.name };
        users.push(newUser);
        res.statusCode = 201;
        return res.end(JSON.stringify(newUser));
    }

    // DELETE /users?id=1 — remove a user
    if (method === 'DELETE' && path === '/users') {
        const query = Object.fromEntries(new URLSearchParams(req.url.split('?')[1]));
        const id = parseInt(query.id);
        const index = users.findIndex(u => u.id === id);
        if (index === -1) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'User not found' }));
        }
        users.splice(index, 1);
        return res.end(JSON.stringify({ message: `User ${id} deleted` }));
    }

    // 404 fallback
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
    console.log(`API running at http://127.0.0.1:${PORT}`);
});
```

```bash
node index.js
```

Test the API:

```bash
# List users
curl http://127.0.0.1:3000/users

# Add a user
curl -X POST http://127.0.0.1:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Charlie"}'

# List again (see Charlie)
curl http://127.0.0.1:3000/users

# Delete a user
curl -X DELETE "http://127.0.0.1:3000/users?id=2"
```

---

## Summary

| Concept | API | What it does |
|---|---|---|
| Get method | `req.method` | HTTP method (GET, POST, etc.) |
| Get URL | `req.url` | Full URL including query string |
| Parse query | `new URLSearchParams(str)` | Converts query string to key-value pairs |
| Get headers | `req.headers['header-name']` | Access request headers (lowercase) |
| Read body | `req.on('data')` + `req.on('end')` | Collect body chunks, process when complete |
| Parse JSON body | `JSON.parse(body)` | Convert JSON string to object |
| Set status | `res.statusCode = 201` | Set HTTP response status code |
