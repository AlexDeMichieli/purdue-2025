# Lesson 06 Demo 02 - Accessing Structured Data with Arrays

## Exercise Summary

**Objective:** Access and manage structured data using arrays in MongoDB by creating a database, adding collections, inserting documents with arrays, and retrieving data using MongoDB Compass for efficient and organized data handling

**Tools Required:** MongoDB Compass

**Prerequisites:** Knowledge of JavaScript and arrays

### What You'll Learn
- Connect to MongoDB using MongoDB Compass
- Create databases in MongoDB Compass
- Create collections within a database
- Insert documents containing arrays
- Access and view document data

---

## Step 1: Connect to MongoDB Compass

1. Open MongoDB Compass in your practice lab
2. Click **+ Add new connection**
3. Click **Save & Connect**

**Result:** Connection is established to the localhost MongoDB server.

**Default Connection String:**
```
mongodb://localhost:27017
```

---

## Step 2: Create a Database in MongoDB Compass

1. Click the **Create database** button
2. In the pop-up window:
   - Enter the **Database Name** (e.g., `myDatabase`)
   - Enter the **Collection Name** (e.g., `users`)
3. Click **Create Database**

**Result:** The new database appears in the database list.

---

## Step 3: Create a Collection in the Database

1. Select your database from the list
2. Click **Create collection**
3. Enter the **Collection Name** (e.g., `profiles`)
4. Click **Create Collection**

**Result:** The new collection appears within the database.

---

## Step 4: Insert Data into the Collection

1. Click the collection name to open it
2. Click the **Documents** tab
3. Click the **ADD DATA** button
4. Select **Insert document**
5. Enter the document data:

```json
{
    "_id": {
        "$oid": "6408b89af71cfb3ef2d866d75"
    },
    "name": "John Doe",
    "age": 35,
    "hobbies": ["reading", "cooking", "hiking"]
}
```

6. Click **Insert**

**Result:** The document is inserted into the collection with the array of hobbies.

---

## Step 5: Access the Document from the Collection

1. The document will be displayed in the **Documents** tab
2. Click on the specified `_id` field to view the full document details
3. Expand the `hobbies` array to see individual array elements

**Result:** You can view and interact with the structured data, including the array contents.

---

## Key Concepts

### MongoDB Document Structure

A MongoDB document is a JSON-like structure (BSON) that can contain:
- **Scalar values** - strings, numbers, booleans
- **Arrays** - ordered lists of values
- **Embedded documents** - nested objects
- **ObjectId** - unique document identifier

### Arrays in MongoDB

Arrays allow you to store multiple values in a single field:

```json
{
    "name": "John Doe",
    "hobbies": ["reading", "cooking", "hiking"],
    "scores": [85, 90, 78, 92],
    "tags": ["developer", "mentor", "speaker"]
}
```

### Document with Arrays - Example Variations

**Simple Array:**
```json
{
    "name": "Jane Smith",
    "skills": ["JavaScript", "Python", "MongoDB"]
}
```

**Array of Numbers:**
```json
{
    "product": "Widget",
    "ratings": [4.5, 5.0, 4.8, 4.2]
}
```

**Array of Objects (Embedded Documents):**
```json
{
    "name": "John Doe",
    "addresses": [
        {
            "type": "home",
            "city": "New York",
            "zip": "10001"
        },
        {
            "type": "work",
            "city": "Boston",
            "zip": "02101"
        }
    ]
}
```

---

## MongoDB Compass Interface Overview

| Tab/Section | Purpose |
|-------------|---------|
| **Databases** | Lists all databases on the server |
| **Collections** | Lists all collections within a database |
| **Documents** | View and edit documents in a collection |
| **Aggregations** | Build aggregation pipelines |
| **Schema** | Analyze document structure |
| **Indexes** | View and create indexes |
| **Validation** | Set document validation rules |

### Document View Options

| View | Description |
|------|-------------|
| **List View** | Shows documents as expandable JSON |
| **JSON View** | Raw JSON format |
| **Table View** | Spreadsheet-like format |

---

## Common Array Operations (Preview)

While this demo focuses on inserting and viewing arrays, MongoDB provides powerful array operations:

| Operation | Description |
|-----------|-------------|
| `$push` | Adds an element to an array |
| `$pull` | Removes elements matching a condition |
| `$addToSet` | Adds element only if it doesn't exist |
| `$pop` | Removes first or last element |
| `$elemMatch` | Matches documents with array elements meeting criteria |
| `$size` | Matches arrays of a specific length |
| `$all` | Matches arrays containing all specified elements |

---

## Additional Notes

- MongoDB Compass provides a GUI for interacting with MongoDB without writing code
- The `_id` field is automatically generated if not provided
- Arrays can contain mixed data types (strings, numbers, objects)
- Arrays maintain insertion order
- MongoDB indexes can be created on array fields for efficient querying
- Use the **Schema** tab to analyze the structure of your documents
