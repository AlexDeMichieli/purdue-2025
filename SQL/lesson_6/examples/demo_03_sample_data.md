# Demo 03 - Sample Data and Query Examples

## Step 1: Create Database and Collection

In MongoDB Compass:
1. Click **+** to create a new database
2. Database Name: `library`
3. Collection Name: `books`
4. Click **Create Database**

---

## Step 2: Insert Sample Documents

Click **ADD DATA** → **Insert document** and add each of these documents one at a time:

### Document 1
```json
{
    "_id": 1001,
    "title": "Divine Comedy",
    "author": "Dante",
    "genre": "Poetry",
    "year": 1320,
    "copies": 5,
    "available": true
}
```

### Document 2
```json
{
    "_id": 1002,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "year": 1925,
    "copies": 12,
    "available": true
}
```

### Document 3
```json
{
    "_id": 1003,
    "title": "1984",
    "author": "George Orwell",
    "genre": "Fiction",
    "year": 1949,
    "copies": 8,
    "available": true
}
```

### Document 4
```json
{
    "_id": 1004,
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "genre": "Fantasy",
    "year": 1937,
    "copies": 3,
    "available": false
}
```

### Document 5
```json
{
    "_id": 1005,
    "title": "Pride and Prejudice",
    "author": "Jane Austen",
    "genre": "Fiction",
    "year": 1813,
    "copies": 6,
    "available": true
}
```

### Document 6
```json
{
    "_id": 1006,
    "title": "The Lord of the Rings",
    "author": "J.R.R. Tolkien",
    "genre": "Fantasy",
    "year": 1954,
    "copies": 2,
    "available": true
}
```

### Document 7
```json
{
    "_id": 1007,
    "title": "Hamlet",
    "author": "William Shakespeare",
    "genre": "Drama",
    "year": 1600,
    "copies": 10,
    "available": true
}
```

### Document 8
```json
{
    "_id": 1008,
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "genre": "Fiction",
    "year": 1960,
    "copies": 15,
    "available": false
}
```

---

## Step 3: Query Examples

Enter these queries in the **Filter** field and click **Find**.

### Query 1: Find books by a specific author
**Filter:**
```json
{"author": "J.R.R. Tolkien"}
```
**Result:** Returns 2 books (The Hobbit, The Lord of the Rings)

---

### Query 2: Find books with more than 5 copies
**Filter:**
```json
{"copies": {"$gt": 5}}
```
**Result:** Returns books with copies > 5 (Great Gatsby, 1984, Pride and Prejudice, Hamlet, To Kill a Mockingbird)

---

### Query 3: Find available Fiction books
**Filter:**
```json
{"genre": "Fiction", "available": true}
```
**Result:** Returns Fiction books that are available (Great Gatsby, 1984, Pride and Prejudice)

---

### Query 4: Find books published before 1900
**Filter:**
```json
{"year": {"$lt": 1900}}
```
**Result:** Returns older books (Divine Comedy, Pride and Prejudice, Hamlet)

---

## Bonus Queries to Try

### Find books NOT available
```json
{"available": false}
```

### Find books with 5 or fewer copies
```json
{"copies": {"$lte": 5}}
```

### Find Fantasy OR Drama books
```json
{"$or": [{"genre": "Fantasy"}, {"genre": "Drama"}]}
```

### Find books from 1900-1950
```json
{"year": {"$gte": 1900, "$lte": 1950}}
```

### Find books where ID is less than 1005
```json
{"_id": {"$lt": 1005}}
```

---

## Quick Reference: Comparison Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `$eq` | Equals | `{"copies": {"$eq": 5}}` |
| `$gt` | Greater than | `{"copies": {"$gt": 5}}` |
| `$gte` | Greater than or equal | `{"year": {"$gte": 1900}}` |
| `$lt` | Less than | `{"year": {"$lt": 1900}}` |
| `$lte` | Less than or equal | `{"copies": {"$lte": 5}}` |
| `$ne` | Not equal | `{"genre": {"$ne": "Fiction"}}` |
| `$in` | In array | `{"genre": {"$in": ["Fiction", "Fantasy"]}}` |
