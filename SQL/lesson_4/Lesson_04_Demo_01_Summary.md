# Lesson 04 Demo 01 - Creating and Executing Stored Procedures

## Exercise Summary

**Objective:** Create and execute a stored procedure that retrieves data from a sample table, helping you encapsulate SQL queries for improved manageability and reuse

**Tools Required:** MySQL Workbench

**Prerequisites:** Basic understanding of SQL syntax

### What You'll Learn
- Create a database and sample table
- Create and execute a basic stored procedure
- Modify stored procedures to use input parameters
- Update stored procedure logic with additional conditions

### Database Structure Created
- **Database:** `demo_db`
- **Tables:**
  - `customers` - stores customer information (id, name, email)

---

## Step 1: Create Database and Table

### Create the Database and Table
```sql
CREATE DATABASE demo_db;
USE demo_db;

CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100)
);

INSERT INTO customers (name, email) VALUES
('Alice Johnson', 'alice@example.com'),
('Bob Smith', 'bob@example.com'),
('Charlie Lee', 'charlie@example.com');
```

---

## Step 2: Create and Execute a Basic Stored Procedure

### Create the Procedure
```sql
DELIMITER //

CREATE PROCEDURE GetAllCustomers()
BEGIN
    SELECT * FROM customers;
END //

DELIMITER ;
```

### Call the Procedure
```sql
CALL GetAllCustomers();
```

**Result:** Returns all customers (Alice, Bob, Charlie) with their email addresses.

---

## Step 3: Create a Stored Procedure with Input Parameters

### Create a Parameterized Procedure
```sql
DELIMITER //

CREATE PROCEDURE GetCustomerByName(IN custName VARCHAR(100))
BEGIN
    SELECT * FROM customers WHERE name LIKE CONCAT('%', custName, '%');
END //

DELIMITER ;
```

### Call the Parameterized Procedure
```sql
CALL GetCustomerByName('Bob');
```

**Result:** Returns only the customer whose name contains "Bob".

---

## Step 4: Update Stored Procedure Logic

### Create a Procedure with Additional Conditions
```sql
DELIMITER //

CREATE PROCEDURE GetNamedCustomersWithEmail(IN custName VARCHAR(100))
BEGIN
    SELECT * FROM customers
    WHERE name LIKE CONCAT('%', custName, '%') AND email IS NOT NULL;
END //

DELIMITER ;
```

### Call the Modified Procedure
```sql
CALL GetNamedCustomersWithEmail('Alice');
```

**Result:** Returns customers matching the name pattern who also have an email address.

---

## Key Concepts

### What is a Stored Procedure?
A stored procedure is a prepared SQL code that you can save and reuse. It allows you to:
- Encapsulate complex SQL logic
- Reduce network traffic
- Improve security by limiting direct table access
- Promote code reuse

### DELIMITER Statement
- Changes the statement delimiter temporarily
- Required because procedures contain semicolons inside them
- `DELIMITER //` changes delimiter to `//`
- `DELIMITER ;` resets it back to semicolon

### Parameter Types
- **IN** - Input parameter (passed into procedure)
- **OUT** - Output parameter (returned from procedure)
- **INOUT** - Both input and output

### Syntax Structure
```sql
DELIMITER //

CREATE PROCEDURE procedure_name(parameter_list)
BEGIN
    -- SQL statements
END //

DELIMITER ;
```

---

## Additional Notes

- Stored procedures are stored in the database and can be called by name
- Use `CALL procedure_name()` to execute a stored procedure
- The `LIKE` clause with `CONCAT('%', value, '%')` enables partial matching
- Always reset the DELIMITER back to `;` after creating procedures
