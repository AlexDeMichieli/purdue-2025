# Lesson 08 Demo 04 - Performing a Delete Operation in MongoDB Compass

## Exercise Summary

**Objective:** Perform delete operations on documents within a MongoDB collection using MongoDB Compass by establishing a database connection, selecting the appropriate collection, applying document filters, and confirming the deletion

**Tools Required:** MongoDB Compass

**Prerequisites:** None

### What You'll Learn
- Connect to MongoDB using MongoDB Compass
- Create a database and collection
- Insert sample documents
- Delete individual documents using the GUI
- Delete documents using filters
- Perform bulk delete operations

---

## Steps Performed

### Step 1: Connect to MongoDB Compass
1. Navigate to MongoDB Compass and click **+ Add new connection**
2. Click **Save & Connect**
3. You will be connected to localhost

### Step 2: Create a New Database
1. Click the **+** icon on localhost
2. Enter Database Name and Collection Name
3. Click **Create Database**

### Step 3: Insert Sample Documents
1. Select the collection and click **ADD DATA**
2. Click **Insert document**
3. Enter document data and click **Insert**
4. Repeat with multiple documents

### Step 4: Delete Documents
1. Click the **Delete icon** (trash can) beside the document
2. Click **DELETE** to confirm the deletion

---

## Sample Data Used

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

## Delete Operations in MongoDB Shell

### 1. deleteOne() - Delete a Single Document
Deletes the first document that matches the filter.

```javascript
// Delete by _id
db.Books.deleteOne({ _id: 1001 })

// Delete by title
db.Books.deleteOne({ title: "Divine Comedy" })

// Delete first book by author
db.Books.deleteOne({ author: "Homer" })
```

### 2. deleteMany() - Delete Multiple Documents
Deletes all documents that match the filter.

```javascript
// Delete all books by a specific author
db.Books.deleteMany({ author: "Homer" })

// Delete all books published before year 0
db.Books.deleteMany({ publishedYear: { $lt: 0 } })

// Delete all books with fewer than 5 copies
db.Books.deleteMany({ copies: { $lt: 5 } })

// Delete ALL documents in collection (use with caution!)
db.Books.deleteMany({})
```

### 3. findOneAndDelete() - Delete and Return Document
Deletes a document and returns the deleted document.

```javascript
// Delete and return the deleted document
db.Books.findOneAndDelete({ _id: 1001 })

// Returns:
{
  "_id": 1001,
  "title": "Divine Comedy",
  "author": "Dante",
  "copies": 3,
  "publishedYear": 1320
}
```

---

## Delete with Query Operators

### Using Comparison Operators

```javascript
// Delete books published after 1500
db.Books.deleteMany({ publishedYear: { $gt: 1500 } })

// Delete books with exactly 3 copies
db.Books.deleteMany({ copies: { $eq: 3 } })

// Delete books with 5 or fewer copies
db.Books.deleteMany({ copies: { $lte: 5 } })

// Delete books NOT by Shakespeare
db.Books.deleteMany({ author: { $ne: "Shakespeare" } })

// Delete books by specific authors
db.Books.deleteMany({ author: { $in: ["Homer", "Dante"] } })

// Delete books NOT in the list
db.Books.deleteMany({ author: { $nin: ["Shakespeare", "Homer"] } })
```

### Using Logical Operators

```javascript
// Delete books by Dante AND published before 1400
db.Books.deleteMany({
  $and: [
    { author: "Dante" },
    { publishedYear: { $lt: 1400 } }
  ]
})

// Delete books by Homer OR with fewer than 3 copies
db.Books.deleteMany({
  $or: [
    { author: "Homer" },
    { copies: { $lt: 3 } }
  ]
})

// Implicit AND (multiple conditions)
db.Books.deleteMany({
  author: "Shakespeare",
  publishedYear: { $gt: 1500 }
})

// Delete where NONE of the conditions are true
db.Books.deleteMany({
  $nor: [
    { author: "Homer" },
    { author: "Dante" }
  ]
})
```

### Using Element Operators

```javascript
// Delete documents where 'status' field exists
db.Books.deleteMany({ status: { $exists: true } })

// Delete documents where 'status' field does NOT exist
db.Books.deleteMany({ status: { $exists: false } })

// Delete documents where 'copies' is a string (data cleanup)
db.Books.deleteMany({ copies: { $type: "string" } })
```

---

## Delete with Array Conditions

```javascript
// Sample document with arrays
{
  "_id": 2001,
  "title": "Anthology",
  "genres": ["poetry", "drama", "history"],
  "ratings": [3, 4, 5, 2]
}

// Delete documents containing specific genre
db.Books.deleteMany({ genres: "poetry" })

// Delete documents with ALL specified genres
db.Books.deleteMany({ genres: { $all: ["poetry", "drama"] } })

// Delete documents with exactly 3 genres
db.Books.deleteMany({ genres: { $size: 3 } })

// Delete documents with any rating below 3
db.Books.deleteMany({ ratings: { $elemMatch: { $lt: 3 } } })
```

---

## Delete with Nested Document Conditions

```javascript
// Sample document with nested object
{
  "_id": 3001,
  "title": "Tech Guide",
  "publisher": {
    "name": "Tech Books",
    "city": "New York",
    "country": "USA"
  }
}

// Delete by nested field using dot notation
db.Books.deleteMany({ "publisher.city": "New York" })

// Delete by multiple nested conditions
db.Books.deleteMany({
  "publisher.country": "USA",
  "publisher.city": { $ne: "Boston" }
})
```

---

## Delete with Regular Expressions

```javascript
// Delete books with titles starting with "The"
db.Books.deleteMany({ title: /^The/ })

// Delete books with titles containing "Comedy"
db.Books.deleteMany({ title: /Comedy/ })

// Delete books by authors ending with "e" (case-insensitive)
db.Books.deleteMany({ author: /e$/i })

// Using $regex operator
db.Books.deleteMany({ title: { $regex: "^Divine", $options: "i" } })
```

---

## findOneAndDelete() Options

```javascript
// Delete with sort - delete the oldest book
db.Books.findOneAndDelete(
  { author: "Homer" },
  { sort: { publishedYear: 1 } }      // 1 = ascending (oldest first)
)

// Delete with projection - only return specific fields
db.Books.findOneAndDelete(
  { _id: 1001 },
  { projection: { title: 1, author: 1 } }
)

// Returns only:
{
  "_id": 1001,
  "title": "Divine Comedy",
  "author": "Dante"
}
```

---

## Bulk Delete Operations

```javascript
// Using bulkWrite for multiple delete operations
db.Books.bulkWrite([
  { deleteOne: { filter: { _id: 1001 } } },
  { deleteOne: { filter: { _id: 1002 } } },
  { deleteMany: { filter: { author: "Homer" } } }
])

// Returns:
{
  acknowledged: true,
  deletedCount: 5,
  // ... other stats
}
```

---

## Delete Operations in MongoDB Compass (GUI)

### Delete Single Document
1. Locate the document in your collection
2. Click the **trash can icon** (Delete Document) on the right
3. Click **DELETE** in the confirmation dialog

### Delete with Filter
1. Enter a filter query in the Filter bar:
   ```json
   { "author": "Homer" }
   ```
2. Click **Find** to show matching documents
3. Delete each document individually using the trash icon

### Delete Collection (All Documents)
1. Right-click on the collection name
2. Select **Drop Collection**
3. Confirm the deletion

⚠️ **Warning:** This removes the entire collection, not just documents

### Delete Database
1. Right-click on the database name
2. Select **Drop Database**
3. Type the database name to confirm
4. Click **Drop Database**

⚠️ **Warning:** This is irreversible and removes all collections

---

## Delete Method Return Values

```javascript
// deleteOne() returns:
{
  acknowledged: true,
  deletedCount: 1        // 0 if no match found
}

// deleteMany() returns:
{
  acknowledged: true,
  deletedCount: 5        // Number of documents deleted
}

// findOneAndDelete() returns:
// The actual deleted document, or null if no match
{
  "_id": 1001,
  "title": "Divine Comedy",
  ...
}
```

---

## SQL vs MongoDB Delete Comparison

| SQL | MongoDB |
|-----|---------|
| `DELETE FROM Books WHERE _id = 1001` | `db.Books.deleteOne({ _id: 1001 })` |
| `DELETE FROM Books WHERE author = 'Homer'` | `db.Books.deleteMany({ author: "Homer" })` |
| `DELETE FROM Books WHERE year < 1500` | `db.Books.deleteMany({ publishedYear: { $lt: 1500 } })` |
| `DELETE FROM Books` | `db.Books.deleteMany({})` |
| `DROP TABLE Books` | `db.Books.drop()` |
| `TRUNCATE TABLE Books` | `db.Books.deleteMany({})` |

---

## Safe Delete Practices

### 1. Always Preview Before Deleting
```javascript
// First, find what will be deleted
db.Books.find({ author: "Homer" })

// Then delete if results are correct
db.Books.deleteMany({ author: "Homer" })
```

### 2. Use Specific Filters
```javascript
// BAD - Too broad, might delete unintended documents
db.Books.deleteMany({ copies: { $lt: 10 } })

// BETTER - More specific filter
db.Books.deleteMany({
  copies: { $lt: 10 },
  status: "discontinued",
  lastUpdated: { $lt: new Date("2023-01-01") }
})
```

### 3. Delete by _id When Possible
```javascript
// Most precise - targets exact document
db.Books.deleteOne({ _id: 1001 })
```

### 4. Count Before Bulk Delete
```javascript
// Check how many documents will be affected
db.Books.countDocuments({ author: "Homer" })
// Returns: 3

// Now you know exactly what to expect
db.Books.deleteMany({ author: "Homer" })
// deletedCount: 3
```

---

## Drop vs Delete

| Operation | Command | Effect |
|-----------|---------|--------|
| Delete documents | `deleteMany({})` | Removes all documents, keeps collection and indexes |
| Drop collection | `db.Books.drop()` | Removes collection entirely, including indexes |
| Drop database | `db.dropDatabase()` | Removes entire database and all collections |

```javascript
// Delete all documents (keeps collection structure)
db.Books.deleteMany({})

// Drop entire collection
db.Books.drop()

// Drop entire database
use myDatabase
db.dropDatabase()
```

---

## Key Concepts

### deleteOne() vs deleteMany() vs findOneAndDelete()

| Method | Behavior | Returns |
|--------|----------|---------|
| `deleteOne()` | Deletes first matching document | `{ deletedCount: 1 }` |
| `deleteMany()` | Deletes all matching documents | `{ deletedCount: n }` |
| `findOneAndDelete()` | Deletes first match and returns it | The deleted document |

### Important Notes
- Delete operations are **permanent** - there is no undo
- `deleteOne({})` with empty filter deletes the first document found
- `deleteMany({})` with empty filter deletes ALL documents
- Deleting a document does NOT affect related documents (no cascading delete)
- The `_id` index remains even after deleting all documents
- Use `findOneAndDelete()` when you need the deleted document's data

---

## Additional Notes

- Always **backup important data** before bulk delete operations
- In production, consider **soft deletes** (adding a `deleted: true` field) instead of permanent deletion
- MongoDB Compass shows a confirmation dialog before deleting - use it to verify
- Deleted documents cannot be recovered unless you have backups
- For large collections, `deleteMany()` is more efficient than multiple `deleteOne()` calls
- Consider using **TTL (Time-To-Live) indexes** for automatic document expiration
