# Lesson 08 Demo 03 - Updating Documents Using MongoDB Compass

## Exercise Summary

**Objective:** Update single and multiple documents in a MongoDB collection using the Edit Document button for individual changes and the Filter function for batch updates in MongoDB Compass

**Tools Required:** MongoDB Compass

**Prerequisites:** None

### What You'll Learn
- Connect to MongoDB using MongoDB Compass
- Create a database and collection
- Insert sample documents
- Update document fields using the GUI Edit Document function
- Filter documents before updating
- Perform batch updates on multiple documents

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

### Step 4: Update Documents Using Edit Document Function
1. Click the **Edit document** icon (pencil) on a document
2. Click the field that requires updating
3. Enter the updated value
4. Click **UPDATE** to save changes

### Using Filter to Find Documents Before Updating
1. Enter a query in the Filter field: `{ "author": "Dante" }`
2. Click **Find** to locate target documents
3. Edit each matching document individually

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

## Update Operations in MongoDB Shell

### 1. updateOne() - Update a Single Document
Updates the first document that matches the filter.

```javascript
// Update the copies count for Divine Comedy
db.Books.updateOne(
  { title: "Divine Comedy" },           // Filter
  { $set: { copies: 5 } }               // Update
)

// Update by _id
db.Books.updateOne(
  { _id: 1001 },
  { $set: { copies: 10, status: "available" } }
)
```

### 2. updateMany() - Update Multiple Documents
Updates all documents that match the filter.

```javascript
// Add "classic" status to all books published before 1700
db.Books.updateMany(
  { publishedYear: { $lt: 1700 } },
  { $set: { category: "classic" } }
)

// Update all books by a specific author
db.Books.updateMany(
  { author: "Homer" },
  { $set: { language: "Greek" } }
)
```

### 3. replaceOne() - Replace Entire Document
Replaces the entire document (except `_id`) with a new document.

```javascript
db.Books.replaceOne(
  { _id: 1001 },
  {
    title: "The Divine Comedy",
    author: "Dante Alighieri",
    copies: 8,
    publishedYear: 1320,
    language: "Italian",
    genre: "Epic Poetry"
  }
)
```

---

## Update Operators

### Field Update Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$set` | Sets the value of a field | `{ $set: { copies: 10 } }` |
| `$unset` | Removes a field | `{ $unset: { status: "" } }` |
| `$inc` | Increments a field by specified amount | `{ $inc: { copies: 1 } }` |
| `$mul` | Multiplies a field by specified amount | `{ $mul: { price: 1.1 } }` |
| `$min` | Updates if new value is less than current | `{ $min: { score: 50 } }` |
| `$max` | Updates if new value is greater than current | `{ $max: { score: 100 } }` |
| `$rename` | Renames a field | `{ $rename: { "copies": "stock" } }` |
| `$currentDate` | Sets field to current date | `{ $currentDate: { lastModified: true } }` |

### Examples with Field Operators

```javascript
// $set - Set or add field values
db.Books.updateOne(
  { _id: 1001 },
  { $set: {
      copies: 15,
      status: "in-stock",
      lastUpdated: new Date()
    }
  }
)

// $unset - Remove a field from document
db.Books.updateOne(
  { _id: 1001 },
  { $unset: { status: "" } }
)

// $inc - Increment numeric values
db.Books.updateOne(
  { _id: 1001 },
  { $inc: { copies: 5 } }       // Adds 5 to current copies
)

// $inc with negative value (decrement)
db.Books.updateOne(
  { _id: 1001 },
  { $inc: { copies: -2 } }      // Subtracts 2 from copies
)

// $mul - Multiply a value
db.Books.updateOne(
  { _id: 1001 },
  { $mul: { price: 1.10 } }     // Increase price by 10%
)

// $rename - Rename a field
db.Books.updateOne(
  { _id: 1001 },
  { $rename: { "copies": "quantity" } }
)

// $min - Only update if new value is lower
db.Books.updateOne(
  { _id: 1001 },
  { $min: { copies: 2 } }       // Sets copies to 2 only if current > 2
)

// $max - Only update if new value is higher
db.Books.updateOne(
  { _id: 1001 },
  { $max: { copies: 20 } }      // Sets copies to 20 only if current < 20
)

// $currentDate - Set to current timestamp
db.Books.updateOne(
  { _id: 1001 },
  { $currentDate: {
      lastModified: true,                    // Sets as Date
      "audit.timestamp": { $type: "timestamp" }  // Sets as Timestamp
    }
  }
)
```

---

## Array Update Operators

| Operator | Description |
|----------|-------------|
| `$push` | Adds element to array |
| `$pop` | Removes first (-1) or last (1) element |
| `$pull` | Removes elements matching condition |
| `$pullAll` | Removes all matching values |
| `$addToSet` | Adds element only if not already present |
| `$each` | Modifier to add multiple elements |
| `$position` | Specifies position for $push |
| `$slice` | Limits array size after $push |
| `$sort` | Orders array elements |

### Examples with Array Operators

```javascript
// Sample document with arrays
{
  "_id": 2001,
  "title": "Complete Works",
  "author": "Shakespeare",
  "genres": ["tragedy", "comedy"],
  "ratings": [4, 5, 3]
}

// $push - Add element to array
db.Books.updateOne(
  { _id: 2001 },
  { $push: { genres: "history" } }
)

// $push with $each - Add multiple elements
db.Books.updateOne(
  { _id: 2001 },
  { $push: { genres: { $each: ["romance", "drama"] } } }
)

// $addToSet - Add only if not exists (prevents duplicates)
db.Books.updateOne(
  { _id: 2001 },
  { $addToSet: { genres: "tragedy" } }    // Won't add - already exists
)

// $pop - Remove last element (1) or first element (-1)
db.Books.updateOne(
  { _id: 2001 },
  { $pop: { ratings: 1 } }                // Removes last rating
)

// $pull - Remove specific value
db.Books.updateOne(
  { _id: 2001 },
  { $pull: { genres: "comedy" } }
)

// $pull with condition - Remove elements matching criteria
db.Books.updateOne(
  { _id: 2001 },
  { $pull: { ratings: { $lt: 4 } } }      // Remove ratings below 4
)

// $pullAll - Remove multiple specific values
db.Books.updateOne(
  { _id: 2001 },
  { $pullAll: { genres: ["tragedy", "comedy"] } }
)

// $push with $position - Insert at specific index
db.Books.updateOne(
  { _id: 2001 },
  { $push: { genres: { $each: ["epic"], $position: 0 } } }
)

// $push with $slice - Keep array at max size
db.Books.updateOne(
  { _id: 2001 },
  { $push: { ratings: { $each: [5, 4], $slice: -5 } } }  // Keep last 5
)

// $push with $sort - Sort array after push
db.Books.updateOne(
  { _id: 2001 },
  { $push: { ratings: { $each: [2], $sort: -1 } } }     // Sort descending
)
```

---

## Update with Upsert Option

If no document matches the filter, insert a new document.

```javascript
// Upsert - Update if exists, Insert if not
db.Books.updateOne(
  { _id: 3001 },
  { $set: {
      title: "New Book",
      author: "New Author",
      copies: 1
    }
  },
  { upsert: true }              // Creates document if not found
)
```

---

## Updating Nested Documents

```javascript
// Sample document with nested object
{
  "_id": 4001,
  "title": "Modern Guide",
  "publisher": {
    "name": "Tech Books Inc",
    "city": "New York",
    "established": 1990
  }
}

// Update nested field using dot notation
db.Books.updateOne(
  { _id: 4001 },
  { $set: { "publisher.city": "Boston" } }
)

// Update multiple nested fields
db.Books.updateOne(
  { _id: 4001 },
  { $set: {
      "publisher.city": "Chicago",
      "publisher.zip": "60601"
    }
  }
)
```

---

## Combining Multiple Update Operators

```javascript
// Multiple operations in single update
db.Books.updateOne(
  { _id: 1001 },
  {
    $set: { status: "updated" },
    $inc: { copies: 3 },
    $currentDate: { lastModified: true },
    $push: { tags: "bestseller" }
  }
)
```

---

## Update Operations in MongoDB Compass (GUI)

### Edit Single Document
1. Locate the document in your collection
2. Click the **pencil icon** (Edit Document)
3. Click on any field value to modify it
4. Click **UPDATE** to save

### Batch Update Using Filter
1. Enter filter query in the Filter bar: `{ "author": "Dante" }`
2. Click **Find** to show matching documents
3. Edit each document individually using the Edit button

### Add New Field via GUI
1. Click Edit Document (pencil icon)
2. Click the **+** icon to add a new field
3. Enter field name and value
4. Click **UPDATE**

### Delete Field via GUI
1. Click Edit Document (pencil icon)
2. Hover over the field and click the **x** icon
3. Click **UPDATE**

---

## SQL vs MongoDB Update Comparison

| SQL | MongoDB |
|-----|---------|
| `UPDATE Books SET copies = 10 WHERE _id = 1001` | `db.Books.updateOne({ _id: 1001 }, { $set: { copies: 10 } })` |
| `UPDATE Books SET copies = copies + 1 WHERE author = 'Homer'` | `db.Books.updateMany({ author: "Homer" }, { $inc: { copies: 1 } })` |
| `UPDATE Books SET status = 'classic' WHERE year < 1700` | `db.Books.updateMany({ publishedYear: { $lt: 1700 } }, { $set: { status: "classic" } })` |
| `ALTER TABLE Books DROP COLUMN status` | `db.Books.updateMany({}, { $unset: { status: "" } })` |

---

## Update Method Return Values

```javascript
// updateOne() returns:
{
  acknowledged: true,
  matchedCount: 1,      // Documents that matched the filter
  modifiedCount: 1      // Documents actually modified
}

// updateMany() returns:
{
  acknowledged: true,
  matchedCount: 5,
  modifiedCount: 5
}
```

---

## Key Concepts

### updateOne() vs updateMany() vs replaceOne()

| Method | Behavior |
|--------|----------|
| `updateOne()` | Updates first matching document, uses update operators |
| `updateMany()` | Updates all matching documents, uses update operators |
| `replaceOne()` | Replaces entire document (except `_id`), no operators needed |

### Important Notes
- Always use update operators (`$set`, `$inc`, etc.) with `updateOne()` and `updateMany()`
- Without operators, the operation will fail or replace the entire document
- Use dot notation to update nested fields: `"address.city"`
- The `_id` field cannot be updated
- Updates are atomic at the document level

---

## Additional Notes

- MongoDB Compass provides visual editing for quick single-document updates
- For bulk updates, use the MongoDB Shell with `updateMany()`
- Use `{ upsert: true }` when you want to insert if no match is found
- Consider using `$inc` instead of `$set` for counters to avoid race conditions
- Field names are case-sensitive: `Copies` ≠ `copies`
