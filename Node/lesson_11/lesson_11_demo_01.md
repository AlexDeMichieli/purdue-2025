# Lesson 11 Demo 01 — Working with Request Handlers

**Objective:** Understand request handling in Express.js by working with query parameters, route parameters, and request headers

**Tools:** VS Code, Node.js, Express.js

**Prerequisites:** Knowledge of JavaScript and Node.js

---

## Overview

Express provides several ways to extract data from incoming HTTP requests:

| Property/Method | Purpose | Example |
|----------------|---------|---------|
| `req.query` | Access URL query string parameters | `?title=hello&author=john` |
| `req.params` | Access route parameters from URL path | `/users/:id` |
| `req.headers` | Access HTTP request headers | `req.headers['content-type']` |
| `req.get()` | Get specific header value | `req.get('Authorization')` |
| `req.body` | Access request body (needs middleware) | JSON or form data |

---

## Step 1: Project Setup

> Skip this step if you already have the folder structure from a previous demo.

```bash
mkdir expressjs-request-handlers
cd expressjs-request-handlers
npm init -y
npm install express
touch index.js
code .
```

---

## Step 2: Working with Query Parameters (`req.query`)

Query parameters are part of the URL after the `?` symbol. They're commonly used for filtering, searching, and pagination.

### 2.1 Add the following code to `index.js`

```js
const express = require('express');
const app = express();
const PORT = 3000;

// Route to demonstrate req.query
app.get('/request-query', (req, res) => {
    console.log('Query parameters:', req.query);
    
    res.json({
        message: 'Request Query Demo',
        title: req.query.title || 'No title provided',
        author: req.query.author || 'No author provided',
        allParams: req.query
    });
});

app.listen(PORT, (err) => {
    if (err) {
        console.log('There was a problem:', err);
        return;
    }
    console.log(`Server listening on http://localhost:${PORT}`);
});
```

### 2.2 Run the server

```bash
node index.js
```

### 2.3 Test with different query strings

Open your browser and try these URLs:

| URL | Result |
|-----|--------|
| `http://localhost:3000/request-query?title=Express` | Shows title: "Express" |
| `http://localhost:3000/request-query?title=Express&author=John` | Shows both parameters |
| `http://localhost:3000/request-query` | Shows default values |

**Example output in browser:**

```json
{
  "message": "Request Query Demo",
  "title": "Express",
  "author": "John",
  "allParams": {
    "title": "Express",
    "author": "John"
  }
}
```

**What's happening:** Query parameters are automatically parsed by Express and made available in `req.query` as an object. You can access individual parameters using dot notation (`req.query.title`) or bracket notation (`req.query['title']`).

### 2.4 Build a Search Endpoint

Let's make it more practical. Update `index.js`:

```js
const express = require('express');
const app = express();
const PORT = 3000;

// Simulate a database of products
const products = [
    { id: 1, name: 'Laptop', category: 'electronics', price: 999 },
    { id: 2, name: 'Desk Chair', category: 'furniture', price: 199 },
    { id: 3, name: 'Coffee Maker', category: 'appliances', price: 79 },
    { id: 4, name: 'Monitor', category: 'electronics', price: 299 },
    { id: 5, name: 'Desk Lamp', category: 'furniture', price: 49 }
];

app.get('/api/products', (req, res) => {
    const { category, minPrice, maxPrice, search } = req.query;
    
    let filtered = [...products];
    
    // Filter by category
    if (category) {
        filtered = filtered.filter(p => p.category === category);
    }
    
    // Filter by price range
    if (minPrice) {
        filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
        filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    // Search by name
    if (search) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    res.json({
        count: filtered.length,
        filters: { category, minPrice, maxPrice, search },
        products: filtered
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log('Try: /api/products?category=electronics');
    console.log('     /api/products?minPrice=100&maxPrice=500');
    console.log('     /api/products?search=desk');
});
```

Test these URLs:
- `http://localhost:3000/api/products?category=electronics`
- `http://localhost:3000/api/products?minPrice=100&maxPrice=500`
- `http://localhost:3000/api/products?search=desk`

---

## Step 3: Working with Route Parameters (`req.params`)

Route parameters are part of the URL path itself, defined using `:paramName` in the route. They're ideal for identifying specific resources.

### 3.1 Replace `index.js` with the following code

```js
const express = require('express');
const app = express();
const PORT = 3000;

// Simulate a user database
const users = {
    1: { id: 1, name: 'Alice', email: 'alice@example.com' },
    2: { id: 2, name: 'Bob', email: 'bob@example.com' },
    3: { id: 3, name: 'Charlie', email: 'charlie@example.com' }
};

// Single route parameter
app.get('/users/:id', (req, res) => {
    console.log('Route parameter ID:', req.params.id);
    
    const user = users[req.params.id];
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
});

// Multiple route parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
    console.log('User ID:', req.params.userId);
    console.log('Post ID:', req.params.postId);
    
    res.json({
        message: 'Fetching post for user',
        userId: req.params.userId,
        postId: req.params.postId,
        url: req.url
    });
});

// Route with wildcard — matches /files/documents/report.pdf
app.get('/files/*', (req, res) => {
    const filepath = req.params[0]; // Everything after /files/
    console.log('File path:', filepath);
    
    res.json({
        message: 'File request',
        path: filepath
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log('Routes:');
    console.log('  GET /users/:id');
    console.log('  GET /users/:userId/posts/:postId');
    console.log('  GET /files/*');
});
```

### 3.2 Run the server

```bash
node index.js
```

### 3.3 Test the routes

| URL | Response |
|-----|----------|
| `http://localhost:3000/users/1` | Alice's user data |
| `http://localhost:3000/users/99` | 404 — User not found |
| `http://localhost:3000/users/2/posts/42` | Shows userId: 2, postId: 42 |
| `http://localhost:3000/files/documents/report.pdf` | Shows path: documents/report.pdf |

**What's happening:** Route parameters are defined in the route path using `:paramName` and are extracted into the `req.params` object. Unlike query parameters (which are optional), route parameters are part of the URL structure and typically represent resource identifiers.

---

## Step 4: Combining Query and Route Parameters

In real applications, you often use both route parameters and query parameters together.

### 4.1 Update `index.js`

```js
const express = require('express');
const app = express();
const PORT = 3000;

// Simulate a blog database
const posts = {
    1: [
        { id: 101, title: 'First Post', published: true },
        { id: 102, title: 'Draft Post', published: false },
        { id: 103, title: 'Another Post', published: true }
    ],
    2: [
        { id: 201, title: 'Hello World', published: true }
    ]
};

// Get posts for a specific user with optional filtering
app.get('/users/:userId/posts', (req, res) => {
    const userId = req.params.userId;
    const { published, limit } = req.query;
    
    let userPosts = posts[userId] || [];
    
    // Filter by published status
    if (published !== undefined) {
        const isPublished = published === 'true';
        userPosts = userPosts.filter(post => post.published === isPublished);
    }
    
    // Limit results
    if (limit) {
        userPosts = userPosts.slice(0, parseInt(limit));
    }
    
    res.json({
        userId,
        filters: { published, limit },
        count: userPosts.length,
        posts: userPosts
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log('Examples:');
    console.log('  /users/1/posts');
    console.log('  /users/1/posts?published=true');
    console.log('  /users/1/posts?published=false&limit=1');
});
```

Test these URLs:
- `http://localhost:3000/users/1/posts` — All posts for user 1
- `http://localhost:3000/users/1/posts?published=true` — Only published posts
- `http://localhost:3000/users/1/posts?published=false&limit=1` — Only drafts, limited to 1

---

## Step 5: Working with Request Headers

HTTP headers contain metadata about the request. Common uses include authentication tokens, content type negotiation, and client information.

### 5.1 Replace `index.js` with the following code

```js
const express = require('express');
const app = express();
const PORT = 3000;

// Demonstrate req.headers and req.get()
app.get('/api/headers', (req, res) => {
    console.log('All headers:', req.headers);
    
    res.json({
        message: 'Request Headers Demo',
        userAgent: req.get('User-Agent'),
        contentType: req.get('Content-Type') || 'Not specified',
        host: req.get('Host'),
        authorization: req.get('Authorization') || 'No auth token',
        customHeader: req.get('X-Custom-Header') || 'Not provided',
        allHeaders: req.headers
    });
});

// Authentication check using headers
app.get('/api/protected', (req, res) => {
    const token = req.get('Authorization');
    
    if (!token || token !== 'Bearer secret-token-123') {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Valid Authorization header required'
        });
    }
    
    res.json({
        message: 'Access granted',
        data: { secret: 'This is protected data' }
    });
});

// Content negotiation based on Accept header
app.get('/api/data', (req, res) => {
    const acceptHeader = req.get('Accept');
    
    const data = { name: 'Express', version: '4.18' };
    
    if (acceptHeader && acceptHeader.includes('application/xml')) {
        res.type('application/xml');
        res.send(`<data><name>${data.name}</name><version>${data.version}</version></data>`);
    } else {
        res.json(data);
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log('Routes:');
    console.log('  GET /api/headers');
    console.log('  GET /api/protected (requires Authorization header)');
    console.log('  GET /api/data (content negotiation)');
});
```

### 5.2 Run the server

```bash
node index.js
```

### 5.3 Test with curl or Postman

**Basic header inspection:**
```bash
curl http://localhost:3000/api/headers
```

**With custom header:**
```bash
curl -H "X-Custom-Header: MyValue" http://localhost:3000/api/headers
```

**Protected route without token:**
```bash
curl http://localhost:3000/api/protected
# Returns 401 Unauthorized
```

**Protected route with token:**
```bash
curl -H "Authorization: Bearer secret-token-123" http://localhost:3000/api/protected
# Returns protected data
```

**Content negotiation:**
```bash
# Get JSON (default)
curl http://localhost:3000/api/data

# Get XML
curl -H "Accept: application/xml" http://localhost:3000/api/data
```

---

## Step 6: Understanding Response Headers

While `req` contains request data, `res.headersSent` tells you whether response headers have been sent yet.

### 6.1 Add this code to demonstrate `res.headersSent`

```js
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    console.log('Before res.send(), headersSent:', res.headersSent);
    
    res.send('OK');
    
    console.log('After res.send(), headersSent:', res.headersSent);
    
    // This would cause an error because headers were already sent:
    // res.send('Another response'); // ERROR!
});

app.get('/api/stream', (req, res) => {
    console.log('Initial headersSent:', res.headersSent);
    
    res.write('Chunk 1\n');
    console.log('After first write, headersSent:', res.headersSent);
    
    setTimeout(() => {
        res.write('Chunk 2\n');
        res.end('Done');
    }, 1000);
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
```

When you visit `http://localhost:3000/`, the console shows:
```
Before res.send(), headersSent: false
After res.send(), headersSent: true
```

**What's happening:** Once you call `res.send()`, `res.json()`, or `res.end()`, headers are sent to the client and you can't send another response. The `res.headersSent` property helps you check whether headers have already been sent, which is useful in error-handling middleware.

---

## Summary

| Method/Property | Type | Use Case | Example |
|----------------|------|----------|---------|
| `req.query` | Object | URL query parameters | `?search=express&page=2` |
| `req.params` | Object | Route parameters | `/users/:id` → `req.params.id` |
| `req.headers` | Object | All HTTP headers | `req.headers['content-type']` |
| `req.get(name)` | Method | Get specific header | `req.get('Authorization')` |
| `res.headersSent` | Boolean | Check if response started | Prevents double-send errors |

### Key Differences

| Feature | Query Params | Route Params |
|---------|-------------|-------------|
| Optional | ✅ Yes | ❌ No (part of route) |
| Syntax | `?key=value&key2=value2` | `/path/:param/:param2` |
| Use case | Filtering, searching, options | Resource identification |

### Best Practices

✅ **Use route parameters** for resource identifiers (`/users/:id`)  
✅ **Use query parameters** for optional filters (`?status=active&sort=date`)  
✅ **Validate parameters** before using them (check types, ranges, etc.)  
✅ **Use `req.get()`** instead of `req.headers[name]` for cleaner code  
✅ **Check `res.headersSent`** in error handlers to avoid double-send errors  
❌ **Never trust user input** — always sanitize and validate

### Common Patterns

```js
// RESTful route design
GET    /api/users          // List users (with ?page=1&limit=10)
GET    /api/users/:id      // Get specific user
POST   /api/users          // Create user (data in req.body)
PUT    /api/users/:id      // Update user
DELETE /api/users/:id      // Delete user
```

---

## Challenge Exercise

Build a **Library API** with the following routes:

1. `GET /api/books` — List all books
   - Query params: `?genre=fiction&available=true`
   
2. `GET /api/books/:id` — Get a specific book by ID

3. `GET /api/authors/:authorId/books` — Get all books by an author
   - Query params: `?published=2024`

4. `GET /api/protected` — Protected route
   - Requires `Authorization: Bearer token123` header

**Bonus:** Add the ability to sort results using `?sort=title` or `?sort=year`.
