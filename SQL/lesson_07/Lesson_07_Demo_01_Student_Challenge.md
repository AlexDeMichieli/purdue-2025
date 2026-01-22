# Lesson 07 - Student Challenge: MongoDB Schema Validation for a Library System

## Scenario
You've been hired to build a MongoDB database for a local library called **"BookHaven Library"**. The library manager wants to ensure data quality by implementing schema validation rules for their collections.

---

## Part 1: Setup and Connection

### Task 1.1: Connect to MongoDB Compass
1. Open MongoDB Compass
2. Click **+ Add new connection**
3. Leave the connection string as `mongodb://localhost:27017` (default)
4. Click **Save & Connect**

### Task 1.2: Create the Database
Create a new database called `library_db` with an initial collection called `books`.

**Steps:**
1. Click **Create database**
2. Enter `library_db` as the Database Name
3. Enter `books` as the Collection Name
4. Click **Create Database**

---

## Part 2: Create Additional Collections

### Task 2.1: Create a Members Collection
Create a new collection called `members` in the `library_db` database.

### Task 2.2: Create a Loans Collection
Create a new collection called `loans` in the `library_db` database.

---

## Part 3: Add Schema Validation Rules

**How to add validation in MongoDB Compass:**
1. Select your collection in the left sidebar
2. Click the **Validation** tab
3. Click **Add Rule**
4. Paste the JSON validation code
5. Click **Update**

### Task 3.1: Add Validation to the Books Collection
Navigate to the `books` collection and add the following schema validation rule:

```json
{
    "bsonType": "object",
    "required": ["title", "author", "isbn"],
    "properties": {
        "title": {
            "bsonType": "string",
            "description": "Title is required and must be a string"
        },
        "author": {
            "bsonType": "string",
            "description": "Author is required and must be a string"
        },
        "isbn": {
            "bsonType": "string",
            "description": "ISBN is required and must be a string"
        },
        "published_year": {
            "bsonType": "int",
            "description": "Published year must be an integer"
        },
        "available": {
            "bsonType": "bool",
            "description": "Availability must be a boolean"
        }
    }
}
```

### Task 3.2: Add Validation to the Members Collection
Navigate to the `members` collection and add the following schema validation rule:

```json
{
    "bsonType": "object",
    "required": ["first_name", "last_name", "email"],
    "properties": {
        "first_name": {
            "bsonType": "string",
            "description": "First name is required and must be a string"
        },
        "last_name": {
            "bsonType": "string",
            "description": "Last name is required and must be a string"
        },
        "email": {
            "bsonType": "string",
            "description": "Email is required and must be a string"
        },
        "phone": {
            "bsonType": "string",
            "description": "Phone must be a string"
        },
        "membership_date": {
            "bsonType": "date",
            "description": "Membership date must be a date"
        }
    }
}
```

### Task 3.3: Add Validation to the Loans Collection
Navigate to the `loans` collection and add the following schema validation rule:

```json
{
    "bsonType": "object",
    "required": ["member_id", "book_id", "loan_date", "due_date"],
    "properties": {
        "member_id": {
            "bsonType": "string",
            "description": "Member ID is required"
        },
        "book_id": {
            "bsonType": "string",
            "description": "Book ID is required"
        },
        "loan_date": {
            "bsonType": "date",
            "description": "Loan date is required"
        },
        "due_date": {
            "bsonType": "date",
            "description": "Due date is required"
        },
        "returned": {
            "bsonType": "bool",
            "description": "Returned status must be a boolean"
        }
    }
}
```

---

## Part 4: Test Your Validation

### Task 4.1: Insert a Valid Document
In the `books` collection, insert a document that meets all validation requirements:
```json
{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0743273565",
    "published_year": 1925,
    "available": true
}
```

### Task 4.2: Test Validation Failure
Try to insert an invalid document that is missing the required `title` field:
```json
{
    "author": "Harper Lee",
    "isbn": "978-0446310789"
}
```
Observe and document the error message you receive.

### Task 4.3: Insert a Valid Member
Insert a valid member document:
```json
{
    "first_name": "John",
    "last_name": "Smith",
    "email": "john.smith@email.com",
    "phone": "555-1234",
    "membership_date": { "$date": "2024-01-15" }
}
```

---

## Part 5: Advanced Validation (Challenge)

### Task 5.1: Add Additional Constraints to Books
Modify the `books` collection validation to include additional constraints. Update the validation with this enhanced schema:

```json
{
    "bsonType": "object",
    "required": ["title", "author", "isbn"],
    "properties": {
        "title": {
            "bsonType": "string"
        },
        "author": {
            "bsonType": "string"
        },
        "isbn": {
            "bsonType": "string",
            "minLength": 10,
            "description": "ISBN must be at least 10 characters"
        },
        "published_year": {
            "bsonType": "int",
            "minimum": 1450,
            "maximum": 2030,
            "description": "Published year must be between 1450 and 2030"
        },
        "available": {
            "bsonType": "bool"
        }
    }
}
```

### Task 5.2: Add Enum Validation
Create a new collection called `book_categories` and add validation that restricts the `category` field to specific values:

```json
{
    "bsonType": "object",
    "required": ["name", "category"],
    "properties": {
        "name": {
            "bsonType": "string"
        },
        "category": {
            "bsonType": "string",
            "enum": ["Fiction", "Non-Fiction", "Science", "History", "Biography"],
            "description": "Category must be one of the predefined values"
        }
    }
}
```

---

## Bonus Challenge (Optional)

### Bonus 1: Nested Object Validation
Modify the `members` collection to include an `address` object with nested validation:

```json
{
    "bsonType": "object",
    "required": ["first_name", "last_name", "email"],
    "properties": {
        "first_name": {
            "bsonType": "string"
        },
        "last_name": {
            "bsonType": "string"
        },
        "email": {
            "bsonType": "string"
        },
        "phone": {
            "bsonType": "string"
        },
        "membership_date": {
            "bsonType": "date"
        },
        "address": {
            "bsonType": "object",
            "required": ["city"],
            "properties": {
                "street": {
                    "bsonType": "string"
                },
                "city": {
                    "bsonType": "string",
                    "description": "City is required"
                },
                "state": {
                    "bsonType": "string",
                    "minLength": 2,
                    "maxLength": 2,
                    "description": "State must be exactly 2 characters"
                },
                "zip": {
                    "bsonType": "string"
                }
            }
        }
    }
}
```

### Bonus 2: Array Validation
Modify the `books` collection to include a `genres` field that is an array of strings:

```json
{
    "bsonType": "object",
    "required": ["title", "author", "isbn", "genres"],
    "properties": {
        "title": {
            "bsonType": "string"
        },
        "author": {
            "bsonType": "string"
        },
        "isbn": {
            "bsonType": "string"
        },
        "published_year": {
            "bsonType": "int"
        },
        "available": {
            "bsonType": "bool"
        },
        "genres": {
            "bsonType": "array",
            "minItems": 1,
            "items": {
                "bsonType": "string"
            },
            "description": "At least one genre is required"
        }
    }
}
```

---

## Expected Results Checklist

When you're done, verify your work:

- [ ] Connected successfully to MongoDB Compass on localhost
- [ ] Database `library_db` exists
- [ ] Collection `books` exists with schema validation
- [ ] Collection `members` exists with schema validation
- [ ] Collection `loans` exists with schema validation
- [ ] Valid book document inserted successfully
- [ ] Invalid book document (missing title) was rejected
- [ ] Valid member document inserted successfully
- [ ] Validation tab shows your JSON schema rules for each collection

---

## Solution Reference

<details>
<summary>Click to reveal solutions (try on your own first!)</summary>

### Part 3 Solutions

**Task 3.1: Books Collection Validation**
```json
{
    "bsonType": "object",
    "required": ["title", "author", "isbn"],
    "properties": {
        "title": {
            "bsonType": "string",
            "description": "Title is required and must be a string"
        },
        "author": {
            "bsonType": "string",
            "description": "Author is required and must be a string"
        },
        "isbn": {
            "bsonType": "string",
            "description": "ISBN is required and must be a string"
        },
        "published_year": {
            "bsonType": "int",
            "description": "Published year must be an integer"
        },
        "available": {
            "bsonType": "bool",
            "description": "Availability must be a boolean"
        }
    }
}
```

**Task 3.2: Members Collection Validation**
```json
{
    "bsonType": "object",
    "required": ["first_name", "last_name", "email"],
    "properties": {
        "first_name": {
            "bsonType": "string",
            "description": "First name is required and must be a string"
        },
        "last_name": {
            "bsonType": "string",
            "description": "Last name is required and must be a string"
        },
        "email": {
            "bsonType": "string",
            "description": "Email is required and must be a string"
        },
        "phone": {
            "bsonType": "string",
            "description": "Phone must be a string"
        },
        "membership_date": {
            "bsonType": "date",
            "description": "Membership date must be a date"
        }
    }
}
```

**Task 3.3: Loans Collection Validation**
```json
{
    "bsonType": "object",
    "required": ["member_id", "book_id", "loan_date", "due_date"],
    "properties": {
        "member_id": {
            "bsonType": "string",
            "description": "Member ID is required"
        },
        "book_id": {
            "bsonType": "string",
            "description": "Book ID is required"
        },
        "loan_date": {
            "bsonType": "date",
            "description": "Loan date is required"
        },
        "due_date": {
            "bsonType": "date",
            "description": "Due date is required"
        },
        "returned": {
            "bsonType": "bool",
            "description": "Returned status must be a boolean"
        }
    }
}
```

### Part 5 Solutions

**Task 5.1: Books with Additional Constraints**
```json
{
    "bsonType": "object",
    "required": ["title", "author", "isbn"],
    "properties": {
        "title": {
            "bsonType": "string"
        },
        "author": {
            "bsonType": "string"
        },
        "isbn": {
            "bsonType": "string",
            "minLength": 10,
            "description": "ISBN must be at least 10 characters"
        },
        "published_year": {
            "bsonType": "int",
            "minimum": 1450,
            "maximum": 2030,
            "description": "Published year must be between 1450 and 2030"
        },
        "available": {
            "bsonType": "bool"
        }
    }
}
```

**Task 5.2: Book Categories with Enum**
```json
{
    "bsonType": "object",
    "required": ["name", "category"],
    "properties": {
        "name": {
            "bsonType": "string"
        },
        "category": {
            "bsonType": "string",
            "enum": ["Fiction", "Non-Fiction", "Science", "History", "Biography"],
            "description": "Category must be one of the predefined values"
        }
    }
}
```

### Bonus Solutions

**Bonus 1: Members with Nested Address**
```json
{
    "bsonType": "object",
    "required": ["first_name", "last_name", "email"],
    "properties": {
        "first_name": {
            "bsonType": "string"
        },
        "last_name": {
            "bsonType": "string"
        },
        "email": {
            "bsonType": "string"
        },
        "phone": {
            "bsonType": "string"
        },
        "membership_date": {
            "bsonType": "date"
        },
        "address": {
            "bsonType": "object",
            "required": ["city"],
            "properties": {
                "street": {
                    "bsonType": "string"
                },
                "city": {
                    "bsonType": "string",
                    "description": "City is required"
                },
                "state": {
                    "bsonType": "string",
                    "minLength": 2,
                    "maxLength": 2,
                    "description": "State must be exactly 2 characters"
                },
                "zip": {
                    "bsonType": "string"
                }
            }
        }
    }
}
```

**Bonus 2: Books with Genre Array**
```json
{
    "bsonType": "object",
    "required": ["title", "author", "isbn", "genres"],
    "properties": {
        "title": {
            "bsonType": "string"
        },
        "author": {
            "bsonType": "string"
        },
        "isbn": {
            "bsonType": "string"
        },
        "published_year": {
            "bsonType": "int"
        },
        "available": {
            "bsonType": "bool"
        },
        "genres": {
            "bsonType": "array",
            "minItems": 1,
            "items": {
                "bsonType": "string"
            },
            "description": "At least one genre is required"
        }
    }
}
```

</details>

---

Good luck!
