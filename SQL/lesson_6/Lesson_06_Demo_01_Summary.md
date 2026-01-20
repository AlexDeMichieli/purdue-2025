# Lesson 06 Demo 01 - Creating JSON and BSON Structures

## Exercise Summary

**Objective:** Develop a basic understanding of creating and handling JSON and BSON data structures using C programming for storing and managing data in MongoDB applications

**Tools Required:** Visual Studio Code

**Prerequisites:** Knowledge of JavaScript and the C language

### What You'll Learn
- Use the cJSON library to create JSON structures in C
- Define and populate JSON objects
- Convert JSON objects to strings for output
- Use the BSON library for MongoDB integration
- Define and populate BSON documents
- Insert BSON documents into MongoDB collections

### Libraries Used
- **cJSON** - Lightweight JSON parser for C
- **libbson** - BSON library for MongoDB
- **libmongoc** - MongoDB C driver

---

## Part 1: Creating JSON Structures

### Step 1: Include Required Libraries

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "cJSON.h"
```

**Note:** The cJSON library is not part of the standard C library and must be downloaded separately.

---

### Step 2: Define a JSON Object

```c
int main() {
    cJSON *root, *name, *age, *city;
    char *json_string;

    // Create a JSON object
    root = cJSON_CreateObject();
```

**Key Function:** `cJSON_CreateObject()` creates a new empty JSON object that can hold key-value pairs.

---

### Step 3: Add Data to the JSON Object

```c
    // Add some data to the object
    name = cJSON_CreateString("John");
    cJSON_AddItemToObject(root, "name", name);

    age = cJSON_CreateNumber(30);
    cJSON_AddItemToObject(root, "age", age);

    city = cJSON_CreateString("New York");
    cJSON_AddItemToObject(root, "city", city);
```

**Key Functions:**
- `cJSON_CreateString()` - Creates a JSON string value
- `cJSON_CreateNumber()` - Creates a JSON number value
- `cJSON_AddItemToObject()` - Adds a key-value pair to a JSON object

---

### Step 4: Convert JSON Object to String

```c
    // Convert JSON object to string
    json_string = cJSON_Print(root);

    // Print JSON string to console
    printf("%s\n", json_string);

    return 0;
}
```

**Key Function:** `cJSON_Print()` converts a cJSON object into its formatted JSON string representation.

### Expected Output

```json
{
    "name": "John",
    "age": 30,
    "city": "New York"
}
```

---

## Part 2: Creating BSON Structures

### Step 5: Include BSON and MongoDB Libraries

```c
#include <bson.h>
#include <mongoc.h>
```

**Note:** The BSON library requires linking the libbson library during compilation.

---

### Step 6: Define a BSON Object

```c
int main() {
    mongoc_client_t *client;
    mongoc_collection_t *collection;
    bson_error_t error;
    bson_t *doc;
    bson_oid_t oid;

    // Initialize the MongoDB driver
    mongoc_init();

    // Connect to the MongoDB server
    client = mongoc_client_new("mongodb://localhost:27017");

    // Select the database and collection
    collection = mongoc_client_get_collection(client, "mydb", "mycollection");

    // Create a new BSON document
    doc = bson_new();
    bson_oid_init(&oid, NULL);
```

**Key Functions:**
- `mongoc_init()` - Initializes the MongoDB C driver
- `mongoc_client_new()` - Creates a new connection to MongoDB
- `mongoc_client_get_collection()` - Gets a reference to a collection
- `bson_new()` - Creates a new empty BSON document
- `bson_oid_init()` - Generates a new ObjectId

---

### Step 7: Append Data to the BSON Document

```c
    // Add data to the BSON document
    BSON_APPEND_OID(doc, "_id", &oid);
    BSON_APPEND_UTF8(doc, "name", "John Doe");
    BSON_APPEND_INT32(doc, "age", 30);

    // Insert the document into the collection
    if (!mongoc_collection_insert_one(collection, doc, NULL, NULL, &error)) {
        fprintf(stderr, "Failed to insert document: %s\n", error.message);
    }

    return 0;
}
```

**Key Functions:**
- `BSON_APPEND_OID()` - Appends an ObjectId to a BSON document
- `BSON_APPEND_UTF8()` - Appends a UTF-8 string to a BSON document
- `BSON_APPEND_INT32()` - Appends a 32-bit integer to a BSON document
- `mongoc_collection_insert_one()` - Inserts a document into a MongoDB collection

---

## Complete Code Examples

### Complete JSON Example

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "cJSON.h"

int main() {
    cJSON *root, *name, *age, *city;
    char *json_string;

    // Create a JSON object
    root = cJSON_CreateObject();

    // Add some data to the object
    name = cJSON_CreateString("John");
    cJSON_AddItemToObject(root, "name", name);

    age = cJSON_CreateNumber(30);
    cJSON_AddItemToObject(root, "age", age);

    city = cJSON_CreateString("New York");
    cJSON_AddItemToObject(root, "city", city);

    // Convert JSON object to string
    json_string = cJSON_Print(root);

    // Print JSON string to console
    printf("%s\n", json_string);

    // Clean up
    cJSON_Delete(root);
    free(json_string);

    return 0;
}
```

### Complete BSON Example

```c
#include <bson.h>
#include <mongoc.h>

int main() {
    mongoc_client_t *client;
    mongoc_collection_t *collection;
    bson_error_t error;
    bson_t *doc;
    bson_oid_t oid;

    // Initialize the MongoDB driver
    mongoc_init();

    // Connect to the MongoDB server
    client = mongoc_client_new("mongodb://localhost:27017");

    // Select the database and collection
    collection = mongoc_client_get_collection(client, "mydb", "mycollection");

    // Create a new BSON document
    doc = bson_new();
    bson_oid_init(&oid, NULL);

    // Add data to the BSON document
    BSON_APPEND_OID(doc, "_id", &oid);
    BSON_APPEND_UTF8(doc, "name", "John Doe");
    BSON_APPEND_INT32(doc, "age", 30);

    // Insert the document into the collection
    if (!mongoc_collection_insert_one(collection, doc, NULL, NULL, &error)) {
        fprintf(stderr, "Failed to insert document: %s\n", error.message);
    }

    // Clean up
    bson_destroy(doc);
    mongoc_collection_destroy(collection);
    mongoc_client_destroy(client);
    mongoc_cleanup();

    return 0;
}
```

---

## Key Concepts

### JSON vs BSON

| Feature | JSON | BSON |
|---------|------|------|
| Format | Text-based | Binary |
| Readability | Human-readable | Machine-readable |
| Size | Larger (text) | Smaller (binary) |
| Speed | Slower to parse | Faster to parse |
| Data Types | Limited (string, number, boolean, null, array, object) | Extended (includes date, binary, ObjectId, etc.) |
| Use Case | Data interchange, APIs, config files | MongoDB storage and wire protocol |

### cJSON Library Functions

| Function | Purpose |
|----------|---------|
| `cJSON_CreateObject()` | Creates an empty JSON object |
| `cJSON_CreateArray()` | Creates an empty JSON array |
| `cJSON_CreateString()` | Creates a JSON string value |
| `cJSON_CreateNumber()` | Creates a JSON number value |
| `cJSON_CreateBool()` | Creates a JSON boolean value |
| `cJSON_AddItemToObject()` | Adds a key-value pair to an object |
| `cJSON_AddItemToArray()` | Adds an item to an array |
| `cJSON_Print()` | Converts JSON to formatted string |
| `cJSON_Delete()` | Frees memory used by JSON object |

### BSON Append Macros

| Macro | Purpose |
|-------|---------|
| `BSON_APPEND_UTF8()` | Appends a UTF-8 string |
| `BSON_APPEND_INT32()` | Appends a 32-bit integer |
| `BSON_APPEND_INT64()` | Appends a 64-bit integer |
| `BSON_APPEND_DOUBLE()` | Appends a double |
| `BSON_APPEND_BOOL()` | Appends a boolean |
| `BSON_APPEND_OID()` | Appends an ObjectId |
| `BSON_APPEND_DATE_TIME()` | Appends a date/time |
| `BSON_APPEND_ARRAY()` | Appends an array |
| `BSON_APPEND_DOCUMENT()` | Appends a subdocument |

---

## Additional Notes

- The cJSON library must be downloaded and included in your project separately
- The BSON library requires linking with `-lbson-1.0` and `-lmongoc-1.0`
- Always clean up allocated memory using `cJSON_Delete()` and `bson_destroy()`
- MongoDB must be running locally on port 27017 for the BSON example to work
- JSON is ideal for data interchange; BSON is optimized for MongoDB storage and retrieval
