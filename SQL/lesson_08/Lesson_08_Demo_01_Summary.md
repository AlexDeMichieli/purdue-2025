# Lesson 08 Demo 01 - Inserting a Document Using MongoDB Compass

## Exercise Summary

**Objective:** Construct and insert a document into a MongoDB collection using MongoDB Compass by performing connection setup, creating a database and collection, defining document structure, and executing data insertion

**Tools Required:** MongoDB Compass

**Prerequisites:** None

### What You'll Learn
- Connect to MongoDB using MongoDB Compass
- Create a new database
- Create a collection within the database
- Insert a document into the collection

---

## Steps Performed

### Step 1: Connect to MongoDB Compass
1. Navigate to MongoDB Compass and click **+ Add new connection**
2. Click **Save & Connect**
3. You will be connected to localhost

### Step 2: Create a New Database
1. Click the **+** icon on localhost to create a new database
2. Enter your preferred **Database Name** and **Collection Name**
3. Click **Create Database**

### Step 3: Create a Collection Within the Database
1. Click on **+ Create collection**
2. Enter your preferred **Collection Name**
3. Click **Create Collection**

### Step 4: Insert a Document into the Collection
1. Click **ADD DATA**
2. Click **Insert document**
3. Enter the document in JSON format
4. Click **Insert** to save the document

---

## Sample Document Inserted

```json
{
  "_id": 101,
  "name": "Alice Johnson",
  "subject": "Physics",
  "grade": "A",
  "score": 92
}
```

---

## Insertion Methods & Examples

### 1. insertOne() - Insert a Single Document
Inserts one document into a collection.

```javascript
db.students.insertOne({
  "_id": 102,
  "name": "Bob Smith",
  "subject": "Chemistry",
  "grade": "B",
  "score": 85
})
```

### 2. insertMany() - Insert Multiple Documents
Inserts an array of documents in a single operation.

```javascript
db.students.insertMany([
  {
    "_id": 103,
    "name": "Carol White",
    "subject": "Mathematics",
    "grade": "A",
    "score": 95
  },
  {
    "_id": 104,
    "name": "David Brown",
    "subject": "Biology",
    "grade": "B+",
    "score": 88
  },
  {
    "_id": 105,
    "name": "Emma Davis",
    "subject": "English",
    "grade": "A-",
    "score": 91
  }
])
```

### 3. Insert Document with Auto-Generated ObjectId
If you omit the `_id` field, MongoDB automatically generates a unique ObjectId.

```javascript
db.students.insertOne({
  "name": "Frank Miller",
  "subject": "History",
  "grade": "B",
  "score": 82
})
// Result: _id will be something like ObjectId("507f1f77bcf86cd799439011")
```

### 4. Insert Document with Nested Objects
Documents can contain embedded/nested objects for related data.

```javascript
db.students.insertOne({
  "_id": 106,
  "name": "Grace Lee",
  "subject": "Computer Science",
  "grade": "A",
  "score": 97,
  "contact": {
    "email": "grace.lee@email.com",
    "phone": "555-1234",
    "address": {
      "street": "123 Main St",
      "city": "Boston",
      "zip": "02101"
    }
  }
})
```

### 5. Insert Document with Arrays
Documents can contain arrays for multiple values in a single field.

```javascript
db.students.insertOne({
  "_id": 107,
  "name": "Henry Wilson",
  "subjects": ["Physics", "Chemistry", "Mathematics"],
  "grades": [
    { "subject": "Physics", "score": 89 },
    { "subject": "Chemistry", "score": 92 },
    { "subject": "Mathematics", "score": 95 }
  ],
  "tags": ["honors", "science-club", "tutor"]
})
```

### 6. Insert with Different Data Types
MongoDB supports various data types within documents.

```javascript
db.students.insertOne({
  "_id": 108,
  "name": "Ivy Chen",                          // String
  "age": 20,                                   // Integer
  "gpa": 3.85,                                 // Double
  "isActive": true,                            // Boolean
  "enrollmentDate": new Date("2024-09-01"),   // Date
  "courses": ["CS101", "MATH201"],            // Array
  "advisor": null,                             // Null
  "metadata": {                                // Nested Object
    "lastLogin": new Date(),
    "preferences": { "theme": "dark" }
  }
})
```

---

## Insertion in MongoDB Compass (GUI)

### Single Document Insert
1. Click **ADD DATA** → **Insert document**
2. Enter JSON in the editor
3. Click **Insert**

### Multiple Documents Insert
1. Click **ADD DATA** → **Insert document**
2. Enter an array of JSON objects:
```json
[
  { "_id": 201, "name": "Student A", "score": 85 },
  { "_id": 202, "name": "Student B", "score": 90 },
  { "_id": 203, "name": "Student C", "score": 78 }
]
```
3. Click **Insert**

### Import from File
1. Click **ADD DATA** → **Import JSON or CSV file**
2. Select your file
3. Configure import options
4. Click **Import**

---

## Key Concepts

### MongoDB vs SQL Terminology
| SQL Term | MongoDB Term |
|----------|--------------|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |

### Document Structure
- **_id** - Unique identifier for the document (can be auto-generated or manually assigned)
- Documents are stored in **JSON-like format** (BSON internally)
- Fields can contain various data types: strings, numbers, arrays, nested objects

### MongoDB Compass Features Used
- **Connection Manager** - Add and manage database connections
- **Database Browser** - Navigate databases and collections
- **Document Editor** - Insert, view, and modify documents
- **ADD DATA** - Insert single or multiple documents

---

## Additional Notes

- MongoDB is a **NoSQL document database** (different from relational SQL databases)
- Collections don't require a predefined schema - documents can have different structures
- The `_id` field is required for every document; if not provided, MongoDB auto-generates an ObjectId
- MongoDB Compass provides a GUI alternative to the MongoDB shell (mongosh) for database operations
