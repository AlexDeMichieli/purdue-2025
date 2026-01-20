# Lesson 06 Demo 04 - Accessing Collections in MongoDB

## Exercise Summary

**Objective:** Access a collection in MongoDB as a document database and execute the CRUD (Create, Read, Update, Delete) workflow using MongoDB Compass

**Tools Required:** MongoDB Compass

**Prerequisites:** Knowledge of DBMS and JavaScript

### What You'll Learn
- Connect to MongoDB using MongoDB Compass
- Create databases and collections
- Insert documents with complex nested structures
- Work with embedded documents and arrays
- View and manage documents in a collection

---

## Step 1: Connect to MongoDB Compass

1. Open MongoDB Compass in your practice lab
2. Click **New connection +**
3. Click **Connect**

**Result:** Connection is established to the localhost MongoDB server.

---

## Step 2: Create a Database in MongoDB Compass

1. Click the **+** icon to create a new database
2. Enter the **Database Name** (e.g., `customerDB`)
3. Enter the **Collection Name** (e.g., `customers`)
4. Click **Create Database**

**Result:** The database is created successfully.

---

## Step 3: Create a Collection in the Database

1. Select your database
2. Click **+ Create collection**
3. Enter the **Collection Name** (e.g., `contacts`)
4. Click **Create Collection**

**Result:** The collection is created inside the database.

---

## Step 4: Insert and View Documents in the Collection

### Insert a Document

1. Open the collection and click the **Documents** tab
2. Click **ADD DATA** and select **Insert document**
3. Enter the document data:

```json
{
    "_id": ObjectId("615a9f9f1b8a080a0416d53f"),
    "name": "John Doe",
    "age": 30,
    "email": "johndoe@example.com",
    "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zip": "12345"
    },
    "phoneNumbers": [
        {
            "type": "home",
            "number": "555-555-1234"
        },
        {
            "type": "work",
            "number": "555-555-5678"
        }
    ]
}
```

4. Click **Insert**

**Result:** The document is added successfully and appears in the collection.

### View Documents

All inserted documents are visible in the **Documents** view of the selected collection.

---

## Key Concepts

### CRUD Operations in MongoDB

| Operation | Description | MongoDB Method |
|-----------|-------------|----------------|
| **Create** | Insert new documents | `insertOne()`, `insertMany()` |
| **Read** | Query and retrieve documents | `find()`, `findOne()` |
| **Update** | Modify existing documents | `updateOne()`, `updateMany()` |
| **Delete** | Remove documents | `deleteOne()`, `deleteMany()` |

### Document Structure Explained

The sample document demonstrates several MongoDB features:

```json
{
    "_id": ObjectId("615a9f9f1b8a080a0416d53f"),  // Unique identifier
    "name": "John Doe",                            // String field
    "age": 30,                                     // Number field
    "email": "johndoe@example.com",                // String field
    "address": {                                   // Embedded document
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zip": "12345"
    },
    "phoneNumbers": [                              // Array of documents
        {
            "type": "home",
            "number": "555-555-1234"
        },
        {
            "type": "work",
            "number": "555-555-5678"
        }
    ]
}
```

### MongoDB Data Types

| Type | Description | Example |
|------|-------------|---------|
| **String** | UTF-8 text | `"John Doe"` |
| **Number** | Integer or floating-point | `30`, `99.99` |
| **Boolean** | True or false | `true`, `false` |
| **ObjectId** | Unique 12-byte identifier | `ObjectId("615a9f...")` |
| **Array** | Ordered list of values | `[1, 2, 3]` or `[{...}, {...}]` |
| **Object** | Embedded document | `{"street": "123 Main St"}` |
| **Date** | Date/time value | `ISODate("2023-01-15")` |
| **Null** | Null or missing value | `null` |

---

## CRUD Operations in MongoDB Compass

### Create (Insert)

**Using Compass GUI:**
1. Click **ADD DATA** > **Insert document**
2. Enter JSON document
3. Click **Insert**

**Using mongosh (MongoDB Shell):**
```javascript
db.contacts.insertOne({
    name: "Jane Smith",
    age: 28,
    email: "jane@example.com"
})
```

### Read (Query)

**Using Compass GUI:**
1. Enter filter in the **Filter** field
2. Click **Find**

**Filter Examples:**
```json
// Find by name
{"name": "John Doe"}

// Find by age range
{"age": {$gte: 25, $lte: 35}}

// Find by nested field
{"address.city": "Anytown"}

// Find by array element
{"phoneNumbers.type": "work"}
```

### Update

**Using Compass GUI:**
1. Hover over a document
2. Click the **Edit** (pencil) icon
3. Modify the fields
4. Click **Update**

**Using mongosh:**
```javascript
db.contacts.updateOne(
    { name: "John Doe" },
    { $set: { age: 31 } }
)
```

### Delete

**Using Compass GUI:**
1. Hover over a document
2. Click the **Delete** (trash) icon
3. Confirm deletion

**Using mongosh:**
```javascript
db.contacts.deleteOne({ name: "John Doe" })
```

---

## Working with Embedded Documents

### Querying Nested Fields

Use dot notation to query embedded documents:

```json
// Find by city
{"address.city": "Anytown"}

// Find by state
{"address.state": "CA"}

// Find by zip code
{"address.zip": "12345"}
```

### Updating Nested Fields

```javascript
// Update just the city
db.contacts.updateOne(
    { name: "John Doe" },
    { $set: { "address.city": "New City" } }
)
```

---

## Working with Arrays of Documents

### Querying Array Elements

```json
// Find documents with a home phone
{"phoneNumbers.type": "home"}

// Find documents with specific phone number
{"phoneNumbers.number": "555-555-1234"}
```

### Adding to Arrays

```javascript
// Add a new phone number
db.contacts.updateOne(
    { name: "John Doe" },
    { $push: { phoneNumbers: { type: "mobile", number: "555-555-9999" } } }
)
```

### Removing from Arrays

```javascript
// Remove work phone
db.contacts.updateOne(
    { name: "John Doe" },
    { $pull: { phoneNumbers: { type: "work" } } }
)
```

---

## MongoDB Compass Document Actions

| Icon | Action | Description |
|------|--------|-------------|
| **Pencil** | Edit | Modify document fields |
| **Copy** | Clone | Duplicate the document |
| **Trash** | Delete | Remove the document |
| **Expand** | View | Expand nested structures |

---

## Additional Notes

- MongoDB is a document database - data is stored as JSON-like documents (BSON)
- Documents in the same collection can have different structures (schema-flexible)
- The `_id` field is required and must be unique within a collection
- Embedded documents reduce the need for joins (unlike relational databases)
- Arrays allow storing multiple related values in a single document
- Use dot notation (`field.subfield`) to access nested data
- MongoDB Compass provides a visual interface for all CRUD operations
