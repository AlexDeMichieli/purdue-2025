# Lesson 03 Demo 02 - Performing DML Commands

## Exercise Summary

**Objective:** Use DML commands for inserting, updating, retrieving, and deleting data in a MySQL database

**Tools Required:** MySQL Workbench

**Prerequisites:** Basic knowledge of SQL syntax and database schema structure

### What You'll Learn
- Insert data into multiple tables
- Retrieve data using SELECT queries
- Update existing records
- Delete specific records
- Work with foreign key relationships

### Database Structure Created
- **Database:** `school_db`
- **Tables:**
  - `students` - stores student information
  - `courses` - stores course details
  - `enrollments` - stores enrollment records linking students to courses with grades

---

## DML Commands Used

### 1. INSERT INTO
Adds new records to tables

**Insert into Students Table:**
```sql
INSERT INTO students (name, email)
VALUES ('John Doe', 'john@example.com'),
       ('Emma Watson', 'emma@example.com');
```

**Insert into Courses Table:**
```sql
INSERT INTO courses (title, credits)
VALUES ('Mathematics', 3),
       ('Physics', 4),
       ('Computer Science', 3);
```

**Insert into Enrollments Table:**
```sql
INSERT INTO enrollments (student_id, course_id, grade)
VALUES (1, 1, 'A'),
       (1, 3, 'B'),
       (2, 2, 'A');
```

### 2. SELECT
Retrieves data from tables

**Select Specific Columns:**
```sql
SELECT student_id, name, email
FROM students;
```

**Select All Columns:**
```sql
SELECT * FROM enrollments;
```

### 3. UPDATE
Modifies existing records
```sql
UPDATE enrollments
SET grade = 'A'
WHERE student_id = 1 AND course_id = 3;
```

### 4. DELETE
Removes specific records from a table
```sql
DELETE FROM enrollments
WHERE enrollment_id = 3;
```

---

## Database Schema

### Students Table
```sql
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE
);
```

### Courses Table
```sql
CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    credits INT
);
```

### Enrollments Table
```sql
CREATE TABLE enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    course_id INT,
    grade CHAR(1),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);
```

---

## Key Concepts

### DML vs DDL
- **DDL (Data Definition Language)** - Defines database structure (CREATE, ALTER, DROP)
- **DML (Data Manipulation Language)** - Manipulates data within tables (INSERT, SELECT, UPDATE, DELETE)

### Important Points

**INSERT Command:**
- Can insert single or multiple rows in one statement
- Use comma-separated VALUES for multiple rows
- AUTO_INCREMENT fields don't need to be specified

**SELECT Command:**
- Use `*` to select all columns
- Specify column names for specific columns
- Always includes FROM clause to specify the table

**UPDATE Command:**
- Always use WHERE clause to specify which records to update
- Without WHERE, ALL records will be updated
- Can update multiple columns in one statement

**DELETE Command:**
- Always use WHERE clause to specify which records to delete
- Without WHERE, ALL records will be deleted
- Cannot delete records referenced by foreign keys unless handled properly

### Data Types Used
- **INT** - Integer numbers
- **VARCHAR(n)** - Variable-length character string
- **CHAR(1)** - Fixed-length character (single character for grade)

### Constraints
- **PRIMARY KEY** - Uniquely identifies records
- **FOREIGN KEY** - Creates relationships between tables
- **UNIQUE** - Ensures no duplicate values (email addresses)
- **AUTO_INCREMENT** - Automatically generates sequential IDs

---

## Sample Data Overview

**Students:**
- John Doe (student_id: 1)
- Emma Watson (student_id: 2)

**Courses:**
- Mathematics (3 credits)
- Physics (4 credits)
- Computer Science (3 credits)

**Enrollments:**
- John Doe enrolled in Mathematics with grade A
- John Doe enrolled in Computer Science with grade B (later updated to A)
- Emma Watson enrolled in Physics with grade A

---

## Best Practices

1. **Always verify changes** - Use SELECT after UPDATE or DELETE operations
2. **Use WHERE clauses carefully** - Prevents accidental modification of all records
3. **Insert related data in order** - Insert parent records before child records with foreign keys
4. **Test with SELECT first** - Before UPDATE/DELETE, test your WHERE clause with SELECT
