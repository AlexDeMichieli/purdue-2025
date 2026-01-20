# Lesson 06 Demo 03 - Accessing Documents Using NoSQL Commands

## Exercise Summary

**Objective:** Retrieve targeted documents from a MongoDB collection using NoSQL queries for efficient data access and analysis

**Tools Required:** MongoDB Compass

**Prerequisites:** Knowledge of JavaScript and SQL

### What You'll Learn
- Connect to MongoDB using MongoDB Compass
- Create databases and collections
- Insert multiple documents into a collection
- Use NoSQL filter queries to retrieve specific documents
- Apply comparison operators in MongoDB queries

---

## Step 1: Connect to MongoDB Compass

1. Open MongoDB Compass in your practice lab
2. Click **New connection +**
3. Click **Connect**

**Result:** Connection is established to the localhost MongoDB server.

---

## Step 2: Create a Database in MongoDB Compass

1. Click the **+** icon to create a new database
2. Enter the **Database Name** (e.g., `library`)
3. Enter the **Collection Name** (e.g., `books`)
4. Click **Create Database**

**Result:** The database is created successfully.

---

## Step 3: Create a Collection in the Database

1. Select your database
2. Click **+ Create collection**
3. Enter the **Collection Name** (e.g., `users`)
4. Click **Create Collection**

**Result:** The collection is created inside the database.

---

## Step 4: Insert Documents into the Collection

### Insert First Document

1. Select the collection where you want to perform operations
2. Click the **Documents** tab
3. Click **ADD DATA** and select **Insert document**
4. Enter the document data:

```json
{
    "_id": 8752,
    "title": "Divine Comedy",
    "author": "Dante",
    "copies": 1
}
```

5. Click **Insert**

### Insert Additional Document

```json
{
    "_id": {
        "$oid": "5e349915cebace490877d561d"
    },
    "name": "radha",
    "email": "andrea_le@gmail.com",
    "version": 5,
    "scores": [85, 95, 75],
    "dateCreated": {
        "$date": "2003-03-26"
    }
}
```

**Result:** All inserted documents are visible in the Documents view.

---

## Step 5: Access Documents Using NoSQL Commands

### Using the Filter Field

1. Click on the **Filter** field in MongoDB Compass
2. Enter a NoSQL query:

```json
{"_id": {$lt: 7000}}
```

3. Click the **Find** button to execute the query

**Result:** Only documents where `_id` is less than 7000 are displayed.

---

## Key Concepts

### MongoDB Query Syntax

MongoDB queries use JSON-like syntax to filter documents:

```json
{ field: value }
```

### Comparison Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equal to | `{"age": {$eq: 25}}` |
| `$ne` | Not equal to | `{"status": {$ne: "inactive"}}` |
| `$gt` | Greater than | `{"price": {$gt: 100}}` |
| `$gte` | Greater than or equal | `{"quantity": {$gte: 10}}` |
| `$lt` | Less than | `{"_id": {$lt: 7000}}` |
| `$lte` | Less than or equal | `{"age": {$lte: 30}}` |
| `$in` | Matches any value in array | `{"category": {$in: ["A", "B"]}}` |
| `$nin` | Matches none of the values | `{"status": {$nin: ["deleted"]}}` |

### Logical Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$and` | Logical AND | `{$and: [{age: {$gt: 18}}, {status: "active"}]}` |
| `$or` | Logical OR | `{$or: [{age: {$lt: 18}}, {age: {$gt: 65}}]}` |
| `$not` | Logical NOT | `{age: {$not: {$gt: 30}}}` |
| `$nor` | Logical NOR | `{$nor: [{price: 1.99}, {sale: true}]}` |

---

## Common Query Examples

### Find by Exact Match
```json
{"author": "Dante"}
```

### Find with Multiple Conditions (AND)
```json
{"author": "Dante", "copies": {$gt: 0}}
```

### Find with OR Condition
```json
{$or: [{"author": "Dante"}, {"author": "Homer"}]}
```

### Find Documents with Array Contains
```json
{"scores": 85}
```
Returns documents where the `scores` array contains the value 85.

### Find by Range
```json
{"copies": {$gte: 1, $lte: 10}}
```

### Find Documents with Field Exists
```json
{"email": {$exists: true}}
```

### Find with Regular Expression
```json
{"name": {$regex: "^rad", $options: "i"}}
```
Finds names starting with "rad" (case-insensitive).

---

## SQL vs MongoDB Query Comparison

| SQL | MongoDB |
|-----|---------|
| `SELECT * FROM books` | `{}` (empty filter) |
| `SELECT * FROM books WHERE author = 'Dante'` | `{"author": "Dante"}` |
| `SELECT * FROM books WHERE copies > 5` | `{"copies": {$gt: 5}}` |
| `SELECT * FROM books WHERE _id < 7000` | `{"_id": {$lt: 7000}}` |
| `SELECT * FROM books WHERE author = 'Dante' AND copies > 0` | `{"author": "Dante", "copies": {$gt: 0}}` |
| `SELECT * FROM books WHERE author = 'Dante' OR author = 'Homer'` | `{$or: [{"author": "Dante"}, {"author": "Homer"}]}` |
| `SELECT * FROM books WHERE copies BETWEEN 1 AND 10` | `{"copies": {$gte: 1, $lte: 10}}` |
| `SELECT * FROM books WHERE author IN ('Dante', 'Homer')` | `{"author": {$in: ["Dante", "Homer"]}}` |

---

## MongoDB Compass Filter Interface

### Filter Options in Compass

| Field | Purpose |
|-------|---------|
| **Filter** | Enter query conditions |
| **Project** | Specify fields to return |
| **Sort** | Order results by field |
| **Max Time MS** | Set query timeout |
| **Collation** | Language-specific string comparison |
| **Skip** | Skip N documents |
| **Limit** | Limit results to N documents |

### Example: Combined Query Options

**Filter:**
```json
{"copies": {$gt: 0}}
```

**Project:**
```json
{"title": 1, "author": 1, "_id": 0}
```

**Sort:**
```json
{"title": 1}
```

**Limit:** `10`

---

## Additional Notes

- MongoDB queries are case-sensitive by default
- Use `$options: "i"` with `$regex` for case-insensitive matching
- Empty filter `{}` returns all documents
- The `_id` field is always returned unless explicitly excluded
- Queries on indexed fields are significantly faster
- Use the **Explain Plan** tab in Compass to analyze query performance
