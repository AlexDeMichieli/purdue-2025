# Lesson 04 Demo 02 - Building Parameterized Procedures with IN and OUT

## Exercise Summary

**Objective:** Build and execute stored procedures using IN and OUT parameters to perform data lookups and calculations, demonstrating procedural data manipulation in MySQL

**Tools Required:** MySQL Workbench

**Prerequisites:** Basic understanding of SQL syntax

### What You'll Learn
- Create a database and insert sample employee data
- Create procedures with IN/OUT parameters
- Use session variables to capture OUT parameter values
- Calculate values (annual salary, bonus) within procedures
- Clean up procedures and databases

### Database Structure Created
- **Database:** `demo_db`
- **Tables:**
  - `employees` - stores employee information (id, name, salary)

---

## Step 1: Create Database and Insert Sample Data

```sql
CREATE DATABASE demo_db;
USE demo_db;

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    salary DECIMAL(10,2)
);

INSERT INTO employees (name, salary) VALUES
('Alice', 55000),
('Bob', 70000),
('Charlie', 65000);
```

---

## Step 2: Create a Procedure with IN/OUT Parameters

### Create the Procedure
```sql
DELIMITER //

CREATE PROCEDURE GetSalaryByName(
    IN empName VARCHAR(100),
    OUT empSalary DECIMAL(10,2)
)
BEGIN
    SELECT salary INTO empSalary
    FROM employees
    WHERE name = empName;
END //

DELIMITER ;
```

### Call the Procedure Using a Variable
```sql
SET @salary_out = 0;
CALL GetSalaryByName('Bob', @salary_out);
SELECT @salary_out AS Salary;
```

**Result:** Returns Bob's salary (70000).

---

## Step 3: Create a Procedure to Calculate Annual Salary

### Create the Calculation Procedure
```sql
DELIMITER //

CREATE PROCEDURE CalcAnnualSalary(
    IN monthly DECIMAL(10,2),
    OUT annual DECIMAL(10,2)
)
BEGIN
    SET annual = monthly * 12;
END //

DELIMITER ;
```

### Call the Procedure
```sql
SET @annual = 0;
CALL CalcAnnualSalary(5000, @annual);
SELECT @annual AS AnnualSalary;
```

**Result:** Returns 60000 (5000 × 12).

---

## Step 4: Add Bonus Calculation to the Procedure

### Create Enhanced Procedure with Multiple OUT Parameters
```sql
DELIMITER //

CREATE PROCEDURE CalcAnnualSalaryWithBonus(
    IN monthly DECIMAL(10,2),
    OUT annual DECIMAL(10,2),
    OUT bonus DECIMAL(10,2)
)
BEGIN
    SET annual = monthly * 12;
    SET bonus = annual * 0.10;
END //

DELIMITER ;
```

### Call the Procedure with Multiple OUT Variables
```sql
SET @a = 0;
SET @b = 0;
CALL CalcAnnualSalaryWithBonus(6000, @a, @b);
SELECT @a AS AnnualSalary, @b AS Bonus;
```

**Result:** Returns AnnualSalary = 72000 and Bonus = 7200.

---

## Step 5: Clean Up Procedures and Database

```sql
DROP PROCEDURE IF EXISTS GetSalaryByName;
DROP PROCEDURE IF EXISTS CalcAnnualSalary;
DROP PROCEDURE IF EXISTS CalcAnnualSalaryWithBonus;
DROP DATABASE demo_db;
```

---

## Key Concepts

### Parameter Types
| Type | Description | Usage |
|------|-------------|-------|
| **IN** | Input parameter passed to procedure | Read-only, value comes from caller |
| **OUT** | Output parameter returned from procedure | Write-only, value returned to caller |
| **INOUT** | Both input and output | Can read and modify |

### Session Variables
- Prefixed with `@` symbol (e.g., `@salary_out`)
- Used to capture OUT parameter values
- Persist for the duration of the session
- Must be initialized before use with `SET`

### SELECT INTO Statement
```sql
SELECT column INTO variable FROM table WHERE condition;
```
- Assigns a query result to a variable
- Used inside procedures to capture values

### SET Statement
```sql
SET variable = expression;
```
- Assigns a value to a variable
- Can perform calculations

---

## Additional Notes

- OUT parameters must be passed as session variables (prefixed with `@`)
- Initialize session variables before calling procedures
- A procedure can have multiple OUT parameters
- Use `DROP PROCEDURE IF EXISTS` for safe cleanup
- The `INTO` keyword captures query results into variables
