# Lesson 08 Demo 02 - Performing Read Operation Using MongoDB Compass

## Exercise Summary

**Objective:** Perform read operations on documents within a MongoDB collection using MongoDB Compass, covering database selection, collection access, and querying with the `find()` command

**Tools Required:** MongoDB Compass

**Prerequisites:** None

### What You'll Learn
- Connect to MongoDB using MongoDB Compass
- Create a database and collection
- Insert sample documents
- Perform read operations using the MongoDB Shell (mongosh)
- Filter documents using query operators

---

## Steps Performed

### Step 1: Connect to MongoDB Compass
1. Navigate to MongoDB Compass and click **+ Add new connection**
2. Click **Save & Connect**
3. You will be connected to localhost

### Step 2: Create a New Database
1. Click the **+** icon on localhost
2. Enter Database Name and Collection Name (e.g., `Books`)
3. Click **Create Database**

### Step 3: Insert Sample Documents
1. Select the **Books** collection and click **ADD DATA**
2. Click **Insert document**
3. Enter document data and click **Insert**
4. Repeat with multiple documents

### Step 4: Perform Read Operations Using MongoDB Shell
1. Select the collection and click **Open MongoDB shell**
2. Use `find()` method to query documents

---

## Sample Data Inserted

```javascript
// Document 1
{
  "_id": 1001,
  "title": "Divine Comedy",
  "author": "Dante",
  "copies": 3,
  "publishedYear": 1320
}

// Document 2
{
  "_id": 1002,
  "title": "Iliad",
  "author": "Homer",
  "copies": 5,
  "publishedYear": -750
}

// Document 3
{
  "_id": 1003,
  "title": "Hamlet",
  "author": "Shakespeare",
  "copies": 10,
  "publishedYear": 1600
}
```

---

## Read Operations & Examples

### 1. find() - Retrieve All Documents
Returns all documents in a collection.

```javascript
db.Books.find()
```

### 2. find() with Filter - Query by Field Value
Returns documents matching specific criteria.

```javascript
// Find books by a specific author
db.Books.find({ author: "Homer" })

// Find a specific book by title
db.Books.find({ title: "Hamlet" })

// Find books by published year
db.Books.find({ publishedYear: 1320 })
```

### 3. findOne() - Retrieve Single Document
Returns only the first matching document.

```javascript
db.Books.findOne({ author: "Dante" })
```

---

## Comparison Query Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equal to | `{ copies: { $eq: 5 } }` |
| `$ne` | Not equal to | `{ author: { $ne: "Homer" } }` |
| `$gt` | Greater than | `{ publishedYear: { $gt: 1500 } }` |
| `$gte` | Greater than or equal | `{ copies: { $gte: 5 } }` |
| `$lt` | Less than | `{ publishedYear: { $lt: 1400 } }` |
| `$lte` | Less than or equal | `{ copies: { $lte: 3 } }` |
| `$in` | Matches any value in array | `{ author: { $in: ["Homer", "Dante"] } }` |
| `$nin` | Matches none in array | `{ author: { $nin: ["Homer"] } }` |

### Examples with Comparison Operators

```javascript
// Books published after 1500
db.Books.find({ publishedYear: { $gt: 1500 } })

// Books with 5 or more copies
db.Books.find({ copies: { $gte: 5 } })

// Books published before 1400
db.Books.find({ publishedYear: { $lt: 1400 } })

// Books by Homer or Dante
db.Books.find({ author: { $in: ["Homer", "Dante"] } })
```

---

## Logical Query Operators

| Operator | Description |
|----------|-------------|
| `$and` | Matches all conditions |
| `$or` | Matches at least one condition |
| `$not` | Inverts the query expression |
| `$nor` | Matches none of the conditions |

### Examples with Logical Operators

```javascript
// Books by Dante AND published before 1400
db.Books.find({
  $and: [
    { author: "Dante" },
    { publishedYear: { $lt: 1400 } }
  ]
})

// Books by Homer OR published after 1500
db.Books.find({
  $or: [
    { author: "Homer" },
    { publishedYear: { $gt: 1500 } }
  ]
})

// Books NOT by Shakespeare
db.Books.find({
  author: { $not: { $eq: "Shakespeare" } }
})

// Implicit AND (comma-separated conditions)
db.Books.find({
  author: "Shakespeare",
  copies: { $gte: 5 }
})
```

---

## Projection - Selecting Specific Fields

Control which fields are returned in the results.

```javascript
// Return only title and author (exclude _id)
db.Books.find({}, { title: 1, author: 1, _id: 0 })

// Return all fields except copies
db.Books.find({}, { copies: 0 })

// Filter by author, return only title
db.Books.find({ author: "Homer" }, { title: 1, _id: 0 })
```

| Value | Meaning |
|-------|---------|
| `1` | Include this field |
| `0` | Exclude this field |

---

## Sorting, Limiting & Skipping

### sort() - Order Results
```javascript
// Sort by publishedYear ascending (oldest first)
db.Books.find().sort({ publishedYear: 1 })

// Sort by publishedYear descending (newest first)
db.Books.find().sort({ publishedYear: -1 })

// Sort by author (A-Z), then by title
db.Books.find().sort({ author: 1, title: 1 })
```

### limit() - Restrict Number of Results
```javascript
// Return only first 2 documents
db.Books.find().limit(2)

// Top 3 newest books
db.Books.find().sort({ publishedYear: -1 }).limit(3)
```

### skip() - Skip Documents (Pagination)
```javascript
// Skip first 2 documents
db.Books.find().skip(2)

// Pagination: Page 2 with 5 items per page
db.Books.find().skip(5).limit(5)
```

### Chaining Methods
```javascript
// Find books after 1300, sort by year desc, return top 3
db.Books.find({ publishedYear: { $gt: 1300 } })
  .sort({ publishedYear: -1 })
  .limit(3)
```

---

## Element Query Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$exists` | Field exists or not | `{ copies: { $exists: true } }` |
| `$type` | Field is of specified type | `{ title: { $type: "string" } }` |

```javascript
// Find documents where 'copies' field exists
db.Books.find({ copies: { $exists: true } })

// Find documents where 'publishedYear' is a number
db.Books.find({ publishedYear: { $type: "number" } })
```

---

## Array Query Operators

For querying documents with array fields:

```javascript
// Sample document with array
{
  "_id": 2001,
  "title": "Complete Works",
  "genres": ["tragedy", "comedy", "history"],
  "ratings": [4, 5, 3, 5, 4]
}
```

| Operator | Description |
|----------|-------------|
| `$all` | Array contains all specified elements |
| `$elemMatch` | At least one element matches all conditions |
| `$size` | Array has specified number of elements |

```javascript
// Find books with both "tragedy" and "comedy" genres
db.Books.find({ genres: { $all: ["tragedy", "comedy"] } })

// Find books with exactly 3 genres
db.Books.find({ genres: { $size: 3 } })

// Find where any rating is greater than 4
db.Books.find({ ratings: { $elemMatch: { $gt: 4 } } })
```

---

## Counting Documents

```javascript
// Count all documents
db.Books.countDocuments()

// Count documents matching a filter
db.Books.countDocuments({ author: "Homer" })

// Count books published after 1500
db.Books.countDocuments({ publishedYear: { $gt: 1500 } })
```

---

## Read Operations in MongoDB Compass (GUI)

### Using the Filter Bar
1. Select your collection
2. In the **Filter** field, enter a query document:
   ```json
   { "author": "Homer" }
   ```
3. Click **Find** or press Enter

### Using Options in Compass
- **Project** - Select which fields to display
- **Sort** - Order results by field
- **Max Time MS** - Set query timeout
- **Collation** - Specify language-specific rules

---

## Key Concepts

### find() vs findOne()
| Method | Returns |
|--------|---------|
| `find()` | Cursor to all matching documents |
| `findOne()` | First matching document only |

### Query Document Structure
```javascript
db.collection.find(
  { <filter> },      // Which documents to find
  { <projection> }   // Which fields to return
)
```

### SQL vs MongoDB Query Comparison
| SQL | MongoDB |
|-----|---------|
| `SELECT * FROM Books` | `db.Books.find()` |
| `SELECT * FROM Books WHERE author = 'Homer'` | `db.Books.find({ author: "Homer" })` |
| `SELECT title, author FROM Books` | `db.Books.find({}, { title: 1, author: 1 })` |
| `SELECT * FROM Books WHERE year > 1500` | `db.Books.find({ publishedYear: { $gt: 1500 } })` |
| `SELECT * FROM Books ORDER BY year DESC` | `db.Books.find().sort({ publishedYear: -1 })` |
| `SELECT * FROM Books LIMIT 5` | `db.Books.find().limit(5)` |
| `SELECT COUNT(*) FROM Books` | `db.Books.countDocuments()` |

---

## Additional Notes

- The `find()` method returns a **cursor**, which can be iterated over
- Queries are case-sensitive by default
- Use `.pretty()` in the shell for formatted output: `db.Books.find().pretty()`
- Empty filter `{}` matches all documents
- MongoDB Shell (mongosh) uses JavaScript syntax
