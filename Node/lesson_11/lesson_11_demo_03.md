# Lesson 11 Demo 03 — Demonstrating CRUD Operations

**Objective:** Build a RESTful API with full CRUD (Create, Read, Update, Delete) operations using Express.js

**Tools:** VS Code, Node.js, Express.js

**Prerequisites:** Knowledge of JavaScript and Node.js

---

## Overview

CRUD operations are the foundation of any data-driven application:

| Operation | HTTP Method | Purpose | Example |
|-----------|-------------|---------|---------|
| **C**reate | POST | Add new resource | Add a new course |
| **R**ead | GET | Retrieve resource(s) | Get all courses or one course |
| **U**pdate | PUT / PATCH | Modify existing resource | Update course details |
| **D**elete | DELETE | Remove resource | Delete a course |

In this demo, you'll build a complete RESTful API for managing courses.

---

## Step 1: Project Setup

Create a directory and initialize the project:

```bash
mkdir crud-operations
cd crud-operations
npm init -y
npm install express
npm install --save-dev nodemon
touch index.js
code .
```

### 1.1 Configure nodemon for auto-restart

Open `package.json` and add a start script:

```json
{
  "name": "crud-operations",
  "version": "1.0.0",
  "scripts": {
    "start": "nodemon index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

**What's nodemon?** It automatically restarts your server when you save changes — no need to manually stop and restart.

---

## Step 2: Set Up the Express Server

Add the following to `index.js`:

```js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the CRUD Operations API!',
        endpoints: {
            courses: '/courses',
            course: '/courses/:id'
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

### 2.1 Start the server

```bash
npm start
```

Visit `http://localhost:3000/` in your browser — you should see the welcome message!

**What's happening:** `app.use(express.json())` is middleware that parses incoming JSON request bodies, making `req.body` available in your routes.

---

## Step 3: Implement In-Memory Data Storage

Add this code below the middleware and above the routes:

```js
// In-memory data storage (simulating a database)
let courses = [
    { id: 1, name: 'JavaScript Basics', tech: 'JavaScript', duration: '4 weeks' },
    { id: 2, name: 'Node.js Introduction', tech: 'Node.js', duration: '3 weeks' },
    { id: 3, name: 'React Fundamentals', tech: 'React', duration: '5 weeks' }
];

// Counter for generating new IDs
let nextId = 4;
```

**Note:** In production, you'd use a real database (MongoDB, PostgreSQL, etc.). For learning CRUD operations, an in-memory array is perfect.

---

## Step 4: Implement READ Operations (GET)

### 4.1 Get all courses

Add this route after the welcome route:

```js
// READ - Get all courses
app.get('/courses', (req, res) => {
    res.json({
        count: courses.length,
        courses: courses
    });
});
```

Test it:
```bash
curl http://localhost:3000/courses
```

### 4.2 Get a single course by ID

```js
// READ - Get a course by ID
app.get('/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
        return res.status(404).json({
            error: 'Course not found',
            id: courseId
        });
    }
    
    res.json({ course });
});
```

Test it:
```bash
curl http://localhost:3000/courses/1
curl http://localhost:3000/courses/99  # Should return 404
```

**What's happening:** `req.params.id` extracts the ID from the URL path. We convert it to a number with `parseInt()` and search the array with `find()`.

---

## Step 5: Implement CREATE Operation (POST)

Add this route:

```js
// CREATE - Add a new course
app.post('/courses', (req, res) => {
    const { name, tech, duration } = req.body;
    
    // Validate required fields
    if (!name || !tech) {
        return res.status(400).json({
            error: 'Missing required fields',
            required: ['name', 'tech']
        });
    }
    
    // Create new course
    const newCourse = {
        id: nextId++,
        name,
        tech,
        duration: duration || 'Not specified'
    };
    
    courses.push(newCourse);
    
    res.status(201).json({
        message: 'Course created successfully',
        course: newCourse
    });
});
```

Test it:
```bash
curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -d '{"name":"Express.js Fundamentals","tech":"Express.js","duration":"4 weeks"}'
```

**What's happening:** 
- We extract data from `req.body` (parsed by `express.json()` middleware)
- Validate required fields
- Create a new object with a unique ID
- Add it to the array
- Return 201 (Created) status with the new resource

---

## Step 6: Implement UPDATE Operations (PUT and PATCH)

### 6.1 Full update with PUT

```js
// UPDATE - Replace entire course (PUT)
app.put('/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const { name, tech, duration } = req.body;
    
    // Validate required fields
    if (!name || !tech) {
        return res.status(400).json({
            error: 'Missing required fields for full update',
            required: ['name', 'tech']
        });
    }
    
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (courseIndex === -1) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    // Replace the entire course
    courses[courseIndex] = {
        id: courseId,
        name,
        tech,
        duration: duration || 'Not specified'
    };
    
    res.json({
        message: 'Course updated successfully',
        course: courses[courseIndex]
    });
});
```

### 6.2 Partial update with PATCH

```js
// UPDATE - Modify specific fields (PATCH)
app.patch('/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    // Update only provided fields
    if (req.body.name !== undefined) {
        course.name = req.body.name;
    }
    if (req.body.tech !== undefined) {
        course.tech = req.body.tech;
    }
    if (req.body.duration !== undefined) {
        course.duration = req.body.duration;
    }
    
    res.json({
        message: 'Course updated successfully',
        course
    });
});
```

Test PUT (full replacement):
```bash
curl -X PUT http://localhost:3000/courses/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Advanced JavaScript","tech":"JavaScript","duration":"6 weeks"}'
```

Test PATCH (partial update):
```bash
curl -X PATCH http://localhost:3000/courses/1 \
  -H "Content-Type: application/json" \
  -d '{"duration":"8 weeks"}'
```

**Key difference:** 
- **PUT** replaces the entire resource (requires all fields)
- **PATCH** updates only specified fields (partial update)

---

## Step 7: Implement DELETE Operation

Add this route:

```js
// DELETE - Remove a course
app.delete('/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (courseIndex === -1) {
        return res.status(404).json({
            error: 'Course not found',
            id: courseId
        });
    }
    
    const deletedCourse = courses.splice(courseIndex, 1)[0];
    
    res.json({
        message: 'Course deleted successfully',
        course: deletedCourse
    });
});
```

Test it:
```bash
curl -X DELETE http://localhost:3000/courses/1
```

**What's happening:** `splice()` removes the course from the array and returns it. We send back the deleted course so the client knows what was removed.

---

## Step 8: Add Advanced Features

### 8.1 Query parameters for filtering and searching

Update the GET all courses route:

```js
// READ - Get all courses with filtering
app.get('/courses', (req, res) => {
    let filtered = [...courses];
    
    // Filter by technology
    if (req.query.tech) {
        filtered = filtered.filter(c => 
            c.tech.toLowerCase() === req.query.tech.toLowerCase()
        );
    }
    
    // Search by name
    if (req.query.search) {
        filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(req.query.search.toLowerCase())
        );
    }
    
    // Sort by name or duration
    if (req.query.sort) {
        filtered.sort((a, b) => {
            if (req.query.sort === 'name') {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });
    }
    
    res.json({
        count: filtered.length,
        filters: req.query,
        courses: filtered
    });
});
```

Test filtering:
```bash
# Filter by technology
curl "http://localhost:3000/courses?tech=JavaScript"

# Search by name
curl "http://localhost:3000/courses?search=react"

# Sort by name
curl "http://localhost:3000/courses?sort=name"

# Combine filters
curl "http://localhost:3000/courses?tech=JavaScript&sort=name"
```

### 8.2 Add pagination

```js
// READ - Get all courses with pagination
app.get('/courses', (req, res) => {
    let filtered = [...courses];
    
    // ... (filtering code from above)
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginated = filtered.slice(startIndex, endIndex);
    
    res.json({
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
        courses: paginated
    });
});
```

Test pagination:
```bash
curl "http://localhost:3000/courses?page=1&limit=2"
```

### 8.3 Add validation middleware

Create a validation function:

```js
// Validation middleware
const validateCourse = (req, res, next) => {
    const { name, tech } = req.body;
    const errors = [];
    
    if (!name || name.trim().length === 0) {
        errors.push('Name is required and cannot be empty');
    }
    
    if (!tech || tech.trim().length === 0) {
        errors.push('Tech is required and cannot be empty');
    }
    
    if (name && name.length < 3) {
        errors.push('Name must be at least 3 characters long');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    
    next();
};

// Use it in POST and PUT routes
app.post('/courses', validateCourse, (req, res) => {
    // ... course creation logic
});

app.put('/courses/:id', validateCourse, (req, res) => {
    // ... course update logic
});
```

---

## Step 9: Complete Working Example

Here's the full `index.js` with all CRUD operations:

```js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// In-memory data storage
let courses = [
    { id: 1, name: 'JavaScript Basics', tech: 'JavaScript', duration: '4 weeks' },
    { id: 2, name: 'Node.js Introduction', tech: 'Node.js', duration: '3 weeks' },
    { id: 3, name: 'React Fundamentals', tech: 'React', duration: '5 weeks' }
];

let nextId = 4;

// Validation middleware
const validateCourse = (req, res, next) => {
    const { name, tech } = req.body;
    const errors = [];
    
    if (!name || name.trim().length === 0) {
        errors.push('Name is required');
    }
    if (!tech || tech.trim().length === 0) {
        errors.push('Tech is required');
    }
    if (name && name.length < 3) {
        errors.push('Name must be at least 3 characters');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    
    next();
};

// Routes

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the CRUD Operations API!',
        endpoints: {
            'GET /courses': 'Get all courses',
            'GET /courses/:id': 'Get course by ID',
            'POST /courses': 'Create new course',
            'PUT /courses/:id': 'Replace course',
            'PATCH /courses/:id': 'Update course fields',
            'DELETE /courses/:id': 'Delete course'
        }
    });
});

// READ - Get all courses
app.get('/courses', (req, res) => {
    let filtered = [...courses];
    
    // Filter by tech
    if (req.query.tech) {
        filtered = filtered.filter(c => 
            c.tech.toLowerCase() === req.query.tech.toLowerCase()
        );
    }
    
    // Search by name
    if (req.query.search) {
        filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(req.query.search.toLowerCase())
        );
    }
    
    res.json({
        count: filtered.length,
        courses: filtered
    });
});

// READ - Get course by ID
app.get('/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json({ course });
});

// CREATE - Add new course
app.post('/courses', validateCourse, (req, res) => {
    const { name, tech, duration } = req.body;
    
    const newCourse = {
        id: nextId++,
        name,
        tech,
        duration: duration || 'Not specified'
    };
    
    courses.push(newCourse);
    
    res.status(201).json({
        message: 'Course created successfully',
        course: newCourse
    });
});

// UPDATE - Replace course (PUT)
app.put('/courses/:id', validateCourse, (req, res) => {
    const courseId = parseInt(req.params.id);
    const { name, tech, duration } = req.body;
    
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (courseIndex === -1) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    courses[courseIndex] = {
        id: courseId,
        name,
        tech,
        duration: duration || 'Not specified'
    };
    
    res.json({
        message: 'Course replaced successfully',
        course: courses[courseIndex]
    });
});

// UPDATE - Modify fields (PATCH)
app.patch('/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    if (req.body.name !== undefined) course.name = req.body.name;
    if (req.body.tech !== undefined) course.tech = req.body.tech;
    if (req.body.duration !== undefined) course.duration = req.body.duration;
    
    res.json({
        message: 'Course updated successfully',
        course
    });
});

// DELETE - Remove course
app.delete('/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (courseIndex === -1) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    const deletedCourse = courses.splice(courseIndex, 1)[0];
    
    res.json({
        message: 'Course deleted successfully',
        course: deletedCourse
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('CRUD API is ready!');
});
```

---

## Step 10: Testing Your API

### Using curl

```bash
# CREATE
curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -d '{"name":"Express.js Advanced","tech":"Express.js","duration":"6 weeks"}'

# READ all
curl http://localhost:3000/courses

# READ one
curl http://localhost:3000/courses/1

# UPDATE (PUT)
curl -X PUT http://localhost:3000/courses/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"JavaScript Pro","tech":"JavaScript","duration":"10 weeks"}'

# UPDATE (PATCH)
curl -X PATCH http://localhost:3000/courses/1 \
  -H "Content-Type: application/json" \
  -d '{"duration":"12 weeks"}'

# DELETE
curl -X DELETE http://localhost:3000/courses/1

# FILTER
curl "http://localhost:3000/courses?tech=Node.js"

# SEARCH
curl "http://localhost:3000/courses?search=react"
```

### Using VS Code REST Client

Install the "REST Client" extension and create a file `test.http`:

```http
### Create a course
POST http://localhost:3000/courses
Content-Type: application/json

{
  "name": "TypeScript Basics",
  "tech": "TypeScript",
  "duration": "4 weeks"
}

### Get all courses
GET http://localhost:3000/courses

### Get course by ID
GET http://localhost:3000/courses/1

### Update course (PATCH)
PATCH http://localhost:3000/courses/1
Content-Type: application/json

{
  "duration": "8 weeks"
}

### Delete course
DELETE http://localhost:3000/courses/2
```

Click "Send Request" above each request to test!

---

## Summary

### CRUD Operations Mapping

| CRUD | HTTP Method | Route | Description |
|------|-------------|-------|-------------|
| Create | POST | `/courses` | Add new course |
| Read | GET | `/courses` | Get all courses |
| Read | GET | `/courses/:id` | Get one course |
| Update | PUT | `/courses/:id` | Replace course |
| Update | PATCH | `/courses/:id` | Modify course |
| Delete | DELETE | `/courses/:id` | Remove course |

### HTTP Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid or missing data |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Unexpected server error |

### Key Concepts

✅ **In-memory storage** is simple for demos but not persistent  
✅ **Validation** prevents bad data from entering your system  
✅ **PUT vs PATCH** — PUT replaces, PATCH modifies  
✅ **Status codes** communicate success or failure clearly  
✅ **Query parameters** enable filtering and searching  
✅ **Middleware** keeps code DRY (validation, parsing, logging)

### Best Practices

✅ Use proper HTTP status codes  
✅ Validate all user input  
✅ Return meaningful error messages  
✅ Use descriptive route paths  
✅ Handle 404 errors for missing resources  
✅ Keep route handlers focused and simple  
✅ Use middleware for shared logic

### Next Steps

- Connect to a real database (MongoDB, PostgreSQL)
- Add authentication and authorization
- Implement error handling middleware
- Add request logging
- Write unit tests for routes
- Document API with Swagger/OpenAPI

---

## Challenge Exercise

Build a **Library Management API** with CRUD operations for books:

**Requirements:**

1. Each book should have: `id`, `title`, `author`, `isbn`, `publishedYear`, `available`

2. Implement these endpoints:
   - `GET /books` — List all books (with filtering by author and availability)
   - `GET /books/:id` — Get book by ID
   - `POST /books` — Add new book
   - `PUT /books/:id` — Replace book
   - `PATCH /books/:id` — Update book fields
   - `DELETE /books/:id` — Delete book

3. Add validation:
   - Title and author are required
   - ISBN must be 13 characters
   - Published year must be between 1000 and current year

4. Add these query parameters for `GET /books`:
   - `?author=name` — Filter by author
   - `?available=true` — Filter by availability
   - `?sort=title` — Sort by title or year

**Bonus:** Add a `POST /books/:id/checkout` route that marks a book as unavailable!
