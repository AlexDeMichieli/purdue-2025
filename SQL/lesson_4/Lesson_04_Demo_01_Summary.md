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
- Use OUT parameters to return values from procedures
- Use INOUT parameters to pass and modify values

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

## Step 5: Create a Stored Procedure with OUT Parameter

### Create a Procedure with OUT Parameter
```sql
DELIMITER //

CREATE PROCEDURE GetCustomerCount(OUT totalCount INT)
BEGIN
    SELECT COUNT(*) INTO totalCount FROM customers;
END //

DELIMITER ;
```

### Call the Procedure with OUT Parameter
```sql
CALL GetCustomerCount(@count);
SELECT @count AS TotalCustomers;
```

**Result:** The procedure stores the count of customers into the `@count` variable, which you can then retrieve with a SELECT statement. Returns `3` for our sample data.

---

## Step 6: Create a Stored Procedure with INOUT Parameter

### Create a Procedure with INOUT Parameter
```sql
DELIMITER //

CREATE PROCEDURE DoubleValue(INOUT num INT)
BEGIN
    SET num = num * 2;
END //

DELIMITER ;
```

### Call the Procedure with INOUT Parameter
```sql
SET @myValue = 5;
CALL DoubleValue(@myValue);
SELECT @myValue AS DoubledValue;
```

**Result:** The variable `@myValue` is passed in with value `5`, modified inside the procedure, and returned as `10`.

### Practical INOUT Example with Customer Data
```sql
DELIMITER //

CREATE PROCEDURE AdjustAndCountCustomers(INOUT threshold INT)
BEGIN
    DECLARE customerCount INT;
    SELECT COUNT(*) INTO customerCount FROM customers WHERE id >= threshold;
    SET threshold = customerCount;
END //

DELIMITER ;
```

### Call the Practical INOUT Procedure
```sql
SET @minId = 2;
CALL AdjustAndCountCustomers(@minId);
SELECT @minId AS CustomersAboveThreshold;
```

**Result:** Passes in `2` as the minimum ID threshold, then overwrites the variable with the count of customers meeting that criteria. Returns `2` (Bob and Charlie).

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
