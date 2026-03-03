# Lesson 11 Demo 02 — Building an Express.js App with Routes, Locals, and Views

**Objective:** Demonstrate core Express.js features including routing, local variables, view rendering, and server initialization

**Tools:** VS Code, Node.js, Express.js

**Prerequisites:** Knowledge of JavaScript and Node.js

---

## Overview

In this demo, you'll learn about four essential Express.js features:

| Feature | Purpose | Use Case |
|---------|---------|----------|
| `app.route()` | Chain multiple HTTP methods on one path | RESTful APIs with shared route logic |
| `app.locals` | Store application-level variables | Share data across all views and routes |
| `app.render()` | Render views programmatically | Email templates, PDF generation |
| `app.listen()` | Start the HTTP server | Make your app accessible on a port |

---

## Step 1: Project Setup

> Skip this step if you already have the folder structure from a previous demo.

```bash
mkdir express-routes-views
cd express-routes-views
npm init -y
npm install express ejs
touch index.js
code .
```

---

## Step 2: Understanding `app.route()` — Method Chaining

`app.route()` lets you chain multiple HTTP method handlers for the same path. This keeps related operations together and avoids repeating the route path.

### 2.1 Add the following code to `index.js`

```js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Traditional approach (repetitive)
app.get('/users', (req, res) => {
    res.json({ message: 'Get all users' });
});

app.post('/users', (req, res) => {
    res.json({ message: 'Create a user' });
});

// Better approach — using app.route() to chain methods
app.route('/products')
    .get((req, res) => {
        console.log('GET request to /products');
        res.json({
            message: 'Get all products',
            products: ['Laptop', 'Phone', 'Tablet']
        });
    })
    .post((req, res) => {
        console.log('POST request to /products');
        const { name, price } = req.body;
        res.status(201).json({
            message: 'Product created',
            product: { name, price }
        });
    })
    .put((req, res) => {
        console.log('PUT request to /products');
        res.json({ message: 'Update all products' });
    })
    .delete((req, res) => {
        console.log('DELETE request to /products');
        res.json({ message: 'Delete all products' });
    });

app.listen(PORT, (err) => {
    if (err) console.log('Error starting server:', err);
    console.log(`Server listening on http://localhost:${PORT}`);
});
```

### 2.2 Run the server

```bash
node index.js
```

### 2.3 Test the routes

**Using curl:**

```bash
# GET request
curl http://localhost:3000/products

# POST request
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Keyboard","price":79}'

# DELETE request
curl -X DELETE http://localhost:3000/products
```

**Using a browser:** Visit `http://localhost:3000/products` for the GET request.

**What's happening:** All four HTTP methods (GET, POST, PUT, DELETE) share the same route path `/products`. Using `app.route()` keeps them organized and makes it clear they're related operations on the same resource.

### 2.4 Build a RESTful Resource with Route Chaining

Let's create a complete CRUD API. Update `index.js`:

```js
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Simulate a database
let tasks = [
    { id: 1, title: 'Learn Express', completed: false },
    { id: 2, title: 'Build an API', completed: false }
];

// RESTful routes for /tasks
app.route('/tasks')
    .get((req, res) => {
        res.json({ count: tasks.length, tasks });
    })
    .post((req, res) => {
        const newTask = {
            id: tasks.length + 1,
            title: req.body.title,
            completed: false
        };
        tasks.push(newTask);
        res.status(201).json({ message: 'Task created', task: newTask });
    });

// RESTful routes for /tasks/:id
app.route('/tasks/:id')
    .get((req, res) => {
        const task = tasks.find(t => t.id === parseInt(req.params.id));
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ task });
    })
    .put((req, res) => {
        const task = tasks.find(t => t.id === parseInt(req.params.id));
        if (!task) return res.status(404).json({ error: 'Task not found' });
        
        task.title = req.body.title || task.title;
        task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
        
        res.json({ message: 'Task updated', task });
    })
    .delete((req, res) => {
        const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
        if (index === -1) return res.status(404).json({ error: 'Task not found' });
        
        const deleted = tasks.splice(index, 1);
        res.json({ message: 'Task deleted', task: deleted[0] });
    });

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log('Routes:');
    console.log('  GET    /tasks        — List all tasks');
    console.log('  POST   /tasks        — Create a task');
    console.log('  GET    /tasks/:id    — Get a task');
    console.log('  PUT    /tasks/:id    — Update a task');
    console.log('  DELETE /tasks/:id    — Delete a task');
});
```

Test it:
```bash
# Get all tasks
curl http://localhost:3000/tasks

# Create a task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Master Node.js"}'

# Update a task
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete a task
curl -X DELETE http://localhost:3000/tasks/2
```

---

## Step 3: Understanding `app.locals` — Application-Level Variables

`app.locals` is an object that stores variables available throughout your entire application. These variables are accessible in all views and persist for the lifetime of the application.

### 3.1 Replace `index.js` with the following code

```js
const express = require('express');
const app = express();
const PORT = 3000;

// Set application-level variables
app.locals.appName = 'My Express App';
app.locals.version = '1.0.0';
app.locals.author = 'John Doe';
app.locals.supportEmail = 'support@example.com';

// You can also set objects
app.locals.config = {
    maxUploadSize: '10MB',
    allowedFileTypes: ['.jpg', '.png', '.pdf']
};

// Access locals in route handlers
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the app!',
        appName: app.locals.appName,
        version: app.locals.version,
        author: app.locals.author
    });
});

app.get('/config', (req, res) => {
    res.json({
        appName: app.locals.appName,
        config: app.locals.config
    });
});

// Log all locals
console.log('Application locals:', app.locals);

app.listen(PORT, () => {
    console.log(`${app.locals.appName} v${app.locals.version}`);
    console.log(`Server listening on http://localhost:${PORT}`);
});
```

Run and test:
```bash
node index.js
curl http://localhost:3000/
curl http://localhost:3000/config
```

**What's happening:** Variables stored in `app.locals` are available throughout the application. Unlike `res.locals` (which only exists for a single request), `app.locals` persists across all requests.

### 3.2 Using `app.locals` with Dynamic Data

```js
const express = require('express');
const app = express();
const PORT = 3000;

// Set static configuration
app.locals.appName = 'Task Manager';
app.locals.version = '2.0.0';

// Set dynamic statistics
app.locals.stats = {
    totalRequests: 0,
    startTime: new Date()
};

// Middleware to track statistics
app.use((req, res, next) => {
    app.locals.stats.totalRequests++;
    app.locals.stats.lastRequest = new Date();
    next();
});

app.get('/', (req, res) => {
    const uptime = Math.floor((Date.now() - app.locals.stats.startTime) / 1000);
    
    res.json({
        app: app.locals.appName,
        version: app.locals.version,
        uptime: `${uptime} seconds`,
        totalRequests: app.locals.stats.totalRequests,
        lastRequest: app.locals.stats.lastRequest
    });
});

app.listen(PORT, () => {
    console.log(`${app.locals.appName} started at ${app.locals.stats.startTime}`);
    console.log(`Server listening on http://localhost:${PORT}`);
});
```

Each time you refresh `http://localhost:3000/`, the request count increases!

---

## Step 4: Understanding `app.render()` — Programmatic View Rendering

`app.render()` renders a view template to HTML without sending it to the client. This is useful for generating emails, PDFs, or storing rendered HTML.

### 4.1 Set up a view engine

First, create the views directory structure:

```bash
mkdir views
touch views/index.ejs
touch views/email.ejs
```

Add this to `views/index.ejs`:

```html
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
</head>
<body>
    <h1><%= heading %></h1>
    <p><%= message %></p>
</body>
</html>
```

Add this to `views/email.ejs`:

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { background: #4CAF50; color: white; padding: 20px; }
        .content { padding: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome <%= username %>!</h1>
    </div>
    <div class="content">
        <p>Thanks for signing up for <%= appName %>.</p>
        <p>Your account has been created successfully.</p>
    </div>
</body>
</html>
```

### 4.2 Replace `index.js` with the following code

```js
const express = require('express');
const app = express();
const PORT = 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', './views');

// Set app locals
app.locals.appName = 'My Express App';

// Regular route — sends rendered HTML to client
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home Page',
        heading: 'Welcome to Express',
        message: 'This view is rendered with res.render()'
    });
});

// Programmatic rendering — doesn't send to client
app.get('/generate-email', (req, res) => {
    // Render the view to a string
    app.render('email', {
        username: 'Alice',
        appName: app.locals.appName
    }, (err, html) => {
        if (err) {
            console.error('Render error:', err);
            return res.status(500).json({ error: 'Failed to render template' });
        }
        
        console.log('Generated HTML:');
        console.log(html);
        
        // In a real app, you would:
        // - Send this HTML via email
        // - Save it to a file
        // - Convert it to PDF
        
        res.json({
            message: 'Email HTML generated (check console)',
            preview: html.substring(0, 100) + '...'
        });
    });
});

// Bulk email generation example
app.get('/generate-bulk-emails', (req, res) => {
    const users = [
        { username: 'Alice' },
        { username: 'Bob' },
        { username: 'Charlie' }
    ];
    
    const emails = [];
    let processed = 0;
    
    users.forEach(user => {
        app.render('email', {
            username: user.username,
            appName: app.locals.appName
        }, (err, html) => {
            if (!err) {
                emails.push({ user: user.username, html });
            }
            
            processed++;
            
            // When all are processed, send response
            if (processed === users.length) {
                console.log(`Generated ${emails.length} emails`);
                res.json({
                    message: `Generated ${emails.length} emails`,
                    users: emails.map(e => e.user)
                });
            }
        });
    });
});

app.listen(PORT, (err) => {
    if (err) console.log('Error in server setup:', err);
    console.log(`Server listening on http://localhost:${PORT}`);
});
```

### 4.3 Run and test

```bash
node index.js
```

Visit these URLs:
- `http://localhost:3000/` — Renders and displays the view
- `http://localhost:3000/generate-email` — Renders to string (check console)
- `http://localhost:3000/generate-bulk-emails` — Generates multiple emails

**What's happening:** `res.render()` renders and sends HTML to the client. `app.render()` renders to a string that you can manipulate — perfect for email templates, PDF generation, or caching rendered HTML.

---

## Step 5: Understanding `app.listen()` — Starting the Server

`app.listen()` starts the HTTP server and makes your app accessible on a specific port.

### 5.1 Basic server initialization

```js
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Basic listen
app.listen(PORT, (err) => {
    if (err) {
        console.log('Error in server setup:', err);
        return;
    }
    console.log(`Server listening on port ${PORT}`);
});
```

### 5.2 Advanced server initialization with environment variables

```js
const express = require('express');
const app = express();

// Use environment variable or default to 3000
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.get('/', (req, res) => {
    res.json({
        message: 'Server is running!',
        environment: process.env.NODE_ENV || 'development',
        port: PORT
    });
});

// Listen with host and port
const server = app.listen(PORT, HOST, () => {
    const addr = server.address();
    console.log(`Server listening on ${addr.address}:${addr.port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Visit: http://${HOST}:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});
```

Run with environment variables:
```bash
PORT=4000 node index.js
NODE_ENV=production PORT=8080 node index.js
```

### 5.3 Multiple servers on different ports

```js
const express = require('express');

// Create two separate apps
const mainApp = express();
const adminApp = express();

mainApp.get('/', (req, res) => {
    res.json({ message: 'Main app' });
});

adminApp.get('/', (req, res) => {
    res.json({ message: 'Admin app' });
});

// Start both servers
mainApp.listen(3000, () => {
    console.log('Main app listening on http://localhost:3000');
});

adminApp.listen(4000, () => {
    console.log('Admin app listening on http://localhost:4000');
});
```

---

## Step 6: Putting It All Together

Let's combine all four concepts in a complete application.

### 6.1 Create a full-featured app

```js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// View engine setup
app.set('view engine', 'ejs');

// Set app-wide locals
app.locals.appName = 'Task Management System';
app.locals.version = '1.0.0';
app.locals.author = 'Development Team';

// Statistics tracking
app.locals.stats = {
    totalRequests: 0,
    startTime: new Date()
};

app.use((req, res, next) => {
    app.locals.stats.totalRequests++;
    next();
});

// Simulate database
let tasks = [];
let idCounter = 1;

// RESTful routes using app.route()
app.route('/api/tasks')
    .get((req, res) => {
        res.json({
            count: tasks.length,
            tasks
        });
    })
    .post((req, res) => {
        const newTask = {
            id: idCounter++,
            title: req.body.title,
            completed: false,
            createdAt: new Date()
        };
        tasks.push(newTask);
        res.status(201).json({ message: 'Task created', task: newTask });
    });

app.route('/api/tasks/:id')
    .get((req, res) => {
        const task = tasks.find(t => t.id === parseInt(req.params.id));
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ task });
    })
    .put((req, res) => {
        const task = tasks.find(t => t.id === parseInt(req.params.id));
        if (!task) return res.status(404).json({ error: 'Task not found' });
        
        task.title = req.body.title || task.title;
        task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
        
        res.json({ message: 'Task updated', task });
    })
    .delete((req, res) => {
        const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
        if (index === -1) return res.status(404).json({ error: 'Task not found' });
        
        const deleted = tasks.splice(index, 1);
        res.json({ message: 'Task deleted', task: deleted[0] });
    });

// App info route using locals
app.get('/api/info', (req, res) => {
    const uptime = Math.floor((Date.now() - app.locals.stats.startTime) / 1000);
    
    res.json({
        app: app.locals.appName,
        version: app.locals.version,
        author: app.locals.author,
        uptime: `${uptime} seconds`,
        totalRequests: app.locals.stats.totalRequests,
        totalTasks: tasks.length
    });
});

// Start server with app.listen()
const server = app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`${app.locals.appName} v${app.locals.version}`);
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log('='.repeat(50));
    console.log('API Routes:');
    console.log('  GET    /api/tasks        — List all tasks');
    console.log('  POST   /api/tasks        — Create a task');
    console.log('  GET    /api/tasks/:id    — Get a task');
    console.log('  PUT    /api/tasks/:id    — Update a task');
    console.log('  DELETE /api/tasks/:id    — Delete a task');
    console.log('  GET    /api/info         — App information');
    console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
    });
});
```

---

## Summary

| Method | Purpose | Key Use Case |
|--------|---------|--------------|
| `app.route(path)` | Chain HTTP methods for same path | RESTful APIs, clean route organization |
| `app.locals` | Store app-wide variables | Configuration, stats, data shared across views |
| `app.render(view, data, callback)` | Render views to string | Email templates, PDF generation |
| `app.listen(port, [host], [callback])` | Start HTTP server | Make app accessible on network |

### Key Differences

| `res.render()` vs `app.render()` |
|----------------------------------|
| `res.render()` — Renders and **sends** HTML to client |
| `app.render()` — Renders to **string** for programmatic use |

| `app.locals` vs `res.locals` |
|------------------------------|
| `app.locals` — Available **across all requests** |
| `res.locals` — Only available **for current request** |

### Best Practices

✅ **Use `app.route()`** for RESTful endpoints with multiple methods  
✅ **Store configuration in `app.locals`** — version, app name, settings  
✅ **Use `app.render()`** for email templates and file generation  
✅ **Set `PORT` from environment variables** for deployment flexibility  
✅ **Implement graceful shutdown** for production servers  
✅ **Log server info on startup** for debugging

### Common Patterns

```js
// RESTful resource pattern with app.route()
app.route('/api/resource')
    .get(controller.list)
    .post(controller.create);

app.route('/api/resource/:id')
    .get(controller.get)
    .put(controller.update)
    .delete(controller.remove);

// Configuration pattern with app.locals
app.locals.config = {
    appName: process.env.APP_NAME || 'My App',
    maxUploadSize: process.env.MAX_UPLOAD || '10MB',
    allowedOrigins: (process.env.CORS_ORIGINS || '').split(',')
};

// Server initialization pattern
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});

process.on('SIGTERM', () => server.close());
```

---

## Challenge Exercise

Build a **Blog API** that uses all four concepts:

1. **Use `app.route()`** to create RESTful routes:
   - `GET/POST /api/posts`
   - `GET/PUT/DELETE /api/posts/:id`

2. **Use `app.locals`** to store:
   - Blog name and description
   - Total posts count
   - Request statistics

3. **Use `app.render()`** to generate:
   - Email notification when a new post is published
   - RSS feed from a template

4. **Use `app.listen()`** to:
   - Start server on configurable port
   - Log all available routes on startup
   - Implement graceful shutdown

**Bonus:** Add a view template that displays all posts using the stored `app.locals` data!
