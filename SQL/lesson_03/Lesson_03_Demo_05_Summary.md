# Lesson 03 Demo 05 - Exploring SQL SELECT Commands

## Exercise Summary

**Objective:** Retrieve specific records from a database using the SELECT statement with different clauses to filter, limit, format, and categorize data

**Tools Required:** MySQL Workbench

**Prerequisites:** Basic knowledge of SQL syntax

### What You'll Learn
- Filter data using WHERE clause
- Remove duplicates with DISTINCT
- Create column aliases with AS
- Limit result sets with LIMIT
- Use pattern matching with LIKE
- Filter ranges with BETWEEN
- Create conditional logic with CASE statements

### Database Structure Created
- **Database:** `EmployeeDB`
- **Table:** `employees` - stores employee information including name, department, salary, and city

---

## Database Setup

### Create Database and Table
```sql
CREATE DATABASE IF NOT EXISTS EmployeeDB;
USE EmployeeDB;

CREATE TABLE employees (
    emp_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    department VARCHAR(50),
    salary DECIMAL(10, 2),
    city VARCHAR(50)
);
```

### Sample Data
```sql
INSERT INTO employees (name, department, salary, city) VALUES
('Alice Johnson', 'HR', 5000.00, 'New York'),
('Bob Smith', 'IT', 7000.00, 'Chicago'),
('Charlie Lee', 'IT', 7200.00, 'Chicago'),
('Diana Adams', 'Finance', 6800.00, 'Boston'),
('Evan Miller', 'HR', 5100.00, 'New York'),
('Fiona Clark', 'Marketing', 6000.00, 'Dallas');
```

---

## SELECT Commands and Clauses

### 1. Basic SELECT with WHERE
Filters rows based on a condition
```sql
SELECT name, department, salary
FROM employees
WHERE department = 'IT';
```

**Result:** Returns Bob Smith and Charlie Lee (IT department employees)

**Use case:** Retrieve specific records matching a criteria

---

### 2. DISTINCT
Removes duplicate values from results
```sql
SELECT DISTINCT city FROM employees;
```

**Result:** New York, Chicago, Boston, Dallas (each city listed once)

**Use case:** Find unique values in a column

---

### 3. Column Aliases (AS)
Renames columns in the output
```sql
SELECT name AS EmployeeName, salary AS MonthlySalary
FROM employees;
```

**Result:** Columns displayed as "EmployeeName" and "MonthlySalary"

**Use case:** Make column names more readable or meaningful

---

### 4. Select Specific Columns
Retrieves only specified columns
```sql
SELECT name, department FROM employees;
```

**Result:** Returns only name and department columns (not all columns)

**Use case:** Reduce data transfer and improve readability

---

### 5. LIMIT
Restricts the number of rows returned
```sql
SELECT * FROM employees LIMIT 3;
```

**Result:** Returns only the first 3 employee records

**Use case:** Preview data, pagination, top-N queries

---

### 6. LIKE (Pattern Matching)
Filters using wildcard patterns
```sql
SELECT name, department
FROM employees
WHERE name LIKE 'D%';
```

**Result:** Returns Diana Adams (names starting with 'D')

**Wildcards:**
- `%` - Matches any sequence of characters
- `_` - Matches exactly one character

**Common patterns:**
- `'D%'` - Starts with D
- `'%son'` - Ends with son
- `'%ar%'` - Contains ar
- `'_lice'` - Five characters ending in lice

---

### 7. BETWEEN
Filters values within a range (inclusive)
```sql
SELECT name, salary
FROM employees
WHERE salary BETWEEN 6000 AND 7100;
```

**Result:** Returns employees with salaries from $6,000 to $7,100

**Note:** BETWEEN is inclusive (includes both boundary values)

**Equivalent to:**
```sql
WHERE salary >= 6000 AND salary <= 7100
```

---

### 8. CASE Statement
Creates conditional logic for data categorization
```sql
SELECT name, salary,
  CASE
    WHEN salary > 7000 THEN 'High'
    WHEN salary BETWEEN 6000 AND 7000 THEN 'Medium'
    ELSE 'Low'
  END AS SalaryCategory
FROM employees;
```

**Result:** Adds a calculated column categorizing each salary

**Use case:** Create custom categories, conditional formatting, computed columns

---

## Complete Query Examples

### Example 1: Filter by Department
```sql
SELECT name, department
FROM employees
WHERE department = 'HR';
```

**Output:**
| name | department |
|------|------------|
| Alice Johnson | HR |
| Evan Miller | HR |

---

### Example 2: Unique Cities
```sql
SELECT DISTINCT city FROM employees;
```

**Output:**
| city |
|------|
| New York |
| Chicago |
| Boston |
| Dallas |

---

### Example 3: Top Earners
```sql
SELECT name, salary
FROM employees
WHERE salary > 6500
ORDER BY salary DESC;
```

**Note:** ORDER BY can be combined with other clauses for sorted results

---

### Example 4: Complex Filtering
```sql
SELECT name, department, salary, city
FROM employees
WHERE department IN ('IT', 'Finance')
  AND salary > 6500
  AND city != 'Boston';
```

**Result:** IT and Finance employees earning over $6,500 not in Boston

---

## Key SELECT Clauses

### Complete SELECT Syntax Order
```sql
SELECT [DISTINCT] column1, column2, ...
FROM table_name
WHERE condition
GROUP BY column
HAVING condition
ORDER BY column [ASC|DESC]
LIMIT number;
```

**Execution Order (internal):**
1. FROM - Choose table
2. WHERE - Filter rows
3. GROUP BY - Group data
4. HAVING - Filter groups
5. SELECT - Choose columns
6. DISTINCT - Remove duplicates
7. ORDER BY - Sort results
8. LIMIT - Restrict rows

---

## WHERE Clause Operators

### Comparison Operators
```sql
=       -- Equal to
!=      -- Not equal to (also <>)
>       -- Greater than
<       -- Less than
>=      -- Greater than or equal to
<=      -- Less than or equal to
```

### Logical Operators
```sql
AND     -- All conditions must be true
OR      -- At least one condition must be true
NOT     -- Negates a condition
```

### Special Operators
```sql
BETWEEN ... AND ...     -- Range check (inclusive)
IN (value1, value2)     -- Matches any value in list
LIKE 'pattern'          -- Pattern matching
IS NULL                 -- Check for NULL values
IS NOT NULL             -- Check for non-NULL values
```

---

## Pattern Matching with LIKE

### Wildcard Examples

**Starts with:**
```sql
WHERE name LIKE 'A%'        -- Alice, Adam, etc.
```

**Ends with:**
```sql
WHERE name LIKE '%son'      -- Johnson, Wilson, etc.
```

**Contains:**
```sql
WHERE name LIKE '%ar%'      -- Clark, Charlie, etc.
```

**Second letter is:**
```sql
WHERE name LIKE '_l%'       -- Alice, Clark, etc.
```

**Exactly 5 characters:**
```sql
WHERE name LIKE '_____'     -- Five underscores
```

**Starts with A or B:**
```sql
WHERE name LIKE 'A%' OR name LIKE 'B%'
-- OR using REGEXP:
WHERE name REGEXP '^[AB]'
```

---

## CASE Statement Patterns

### Simple CASE
```sql
CASE column_name
  WHEN value1 THEN result1
  WHEN value2 THEN result2
  ELSE default_result
END
```

### Searched CASE (more flexible)
```sql
CASE
  WHEN condition1 THEN result1
  WHEN condition2 THEN result2
  ELSE default_result
END
```

### Practical Examples

**Grade Assignment:**
```sql
SELECT name, score,
  CASE
    WHEN score >= 90 THEN 'A'
    WHEN score >= 80 THEN 'B'
    WHEN score >= 70 THEN 'C'
    WHEN score >= 60 THEN 'D'
    ELSE 'F'
  END AS grade
FROM students;
```

**Status Indicator:**
```sql
SELECT product_name, stock,
  CASE
    WHEN stock = 0 THEN 'Out of Stock'
    WHEN stock < 10 THEN 'Low Stock'
    ELSE 'In Stock'
  END AS status
FROM products;
```

**Age Groups:**
```sql
SELECT name, age,
  CASE
    WHEN age < 18 THEN 'Minor'
    WHEN age BETWEEN 18 AND 64 THEN 'Adult'
    ELSE 'Senior'
  END AS age_group
FROM people;
```

---

## Combining Multiple Clauses

### Example 1: Complete Query
```sql
SELECT DISTINCT department,
       AVG(salary) AS avg_salary
FROM employees
WHERE city IN ('New York', 'Chicago')
  AND salary > 5000
GROUP BY department
HAVING AVG(salary) > 6000
ORDER BY avg_salary DESC
LIMIT 5;
```

### Example 2: Complex Filtering with CASE
```sql
SELECT name,
       department,
       salary,
       city,
       CASE
         WHEN department = 'IT' AND salary > 7000 THEN 'Senior IT'
         WHEN department = 'IT' THEN 'Junior IT'
         WHEN salary > 6500 THEN 'Senior Staff'
         ELSE 'Staff'
       END AS position_level
FROM employees
WHERE city != 'Boston'
ORDER BY salary DESC;
```

---

## Advanced SELECT Techniques

### 1. Multiple Conditions
```sql
SELECT name, department, salary
FROM employees
WHERE (department = 'IT' OR department = 'HR')
  AND salary > 5000
  AND city = 'New York';
```

### 2. NOT Operator
```sql
SELECT name, department
FROM employees
WHERE department NOT IN ('HR', 'Marketing');
```

### 3. NULL Handling
```sql
SELECT name, department
FROM employees
WHERE manager_id IS NULL;  -- Finds employees without managers
```

### 4. String Functions in SELECT
```sql
SELECT UPPER(name) AS name_upper,
       LOWER(city) AS city_lower,
       CONCAT(name, ' - ', department) AS employee_info
FROM employees;
```

### 5. Arithmetic Operations
```sql
SELECT name,
       salary,
       salary * 12 AS annual_salary,
       salary * 1.1 AS salary_with_raise
FROM employees;
```

---

## Practical Use Cases

### Use Case 1: Employee Search
```sql
-- Find employees by partial name match
SELECT name, department, salary
FROM employees
WHERE name LIKE '%son%'
ORDER BY name;
```

### Use Case 2: Salary Analysis
```sql
-- Categorize and count employees by salary range
SELECT
  CASE
    WHEN salary < 5500 THEN 'Entry Level'
    WHEN salary BETWEEN 5500 AND 6500 THEN 'Mid Level'
    ELSE 'Senior Level'
  END AS level,
  COUNT(*) AS employee_count,
  AVG(salary) AS avg_salary
FROM employees
GROUP BY level;
```

### Use Case 3: Department Report
```sql
-- Get top 3 departments by average salary
SELECT department,
       COUNT(*) AS emp_count,
       AVG(salary) AS avg_salary,
       MAX(salary) AS max_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC
LIMIT 3;
```

### Use Case 4: Data Validation
```sql
-- Find potential data issues
SELECT name, salary, city
FROM employees
WHERE salary IS NULL
   OR city IS NULL
   OR name = ''
   OR salary < 0;
```

---

## Performance Tips

### 1. Select Only Needed Columns
**Good:**
```sql
SELECT name, salary FROM employees;
```

**Bad:**
```sql
SELECT * FROM employees;  -- If you only need name and salary
```

### 2. Use LIMIT for Large Tables
```sql
SELECT * FROM employees LIMIT 100;
```

### 3. Avoid Functions on Indexed Columns in WHERE
**Slow:**
```sql
WHERE UPPER(name) = 'ALICE'
```

**Fast:**
```sql
WHERE name = 'Alice'
```

### 4. Use BETWEEN Instead of Multiple Comparisons
**Better:**
```sql
WHERE salary BETWEEN 6000 AND 7000
```

**Works but less readable:**
```sql
WHERE salary >= 6000 AND salary <= 7000
```

---

## Common Mistakes to Avoid

### 1. Forgetting Quotes for Strings
**Wrong:**
```sql
WHERE department = IT  -- Error!
```

**Correct:**
```sql
WHERE department = 'IT'
```

### 2. Confusing = and LIKE
```sql
WHERE name = 'Alice'      -- Exact match
WHERE name LIKE 'Alice%'  -- Pattern match (starts with Alice)
```

### 3. Case Sensitivity
In MySQL, string comparisons are case-insensitive by default, but be aware:
```sql
WHERE department = 'it'   -- Matches 'IT', 'It', 'it'
```

### 4. NULL Comparisons
**Wrong:**
```sql
WHERE salary = NULL  -- Always false!
```

**Correct:**
```sql
WHERE salary IS NULL
```

### 5. Missing Parentheses with AND/OR
**Ambiguous:**
```sql
WHERE dept = 'IT' OR dept = 'HR' AND salary > 6000
```

**Clear:**
```sql
WHERE (dept = 'IT' OR dept = 'HR') AND salary > 6000
```

---

## Quick Reference

### SELECT Clause Components

| Clause | Purpose | Example |
|--------|---------|---------|
| SELECT | Choose columns | `SELECT name, salary` |
| DISTINCT | Remove duplicates | `SELECT DISTINCT city` |
| AS | Column alias | `SELECT name AS employee_name` |
| FROM | Specify table | `FROM employees` |
| WHERE | Filter rows | `WHERE salary > 6000` |
| LIKE | Pattern matching | `WHERE name LIKE 'A%'` |
| BETWEEN | Range filter | `WHERE salary BETWEEN 5000 AND 7000` |
| IN | List matching | `WHERE city IN ('New York', 'Chicago')` |
| CASE | Conditional logic | `CASE WHEN ... THEN ... END` |
| ORDER BY | Sort results | `ORDER BY salary DESC` |
| LIMIT | Restrict rows | `LIMIT 10` |

### Wildcards

| Wildcard | Meaning | Example |
|----------|---------|---------|
| % | Zero or more characters | `'A%'` = Starts with A |
| _ | Exactly one character | `'_lice'` = ?lice (5 chars) |

---

## Summary

By following these steps, you have successfully:
- Retrieved and filtered specific records using WHERE
- Removed duplicates using DISTINCT
- Created readable column names using AS
- Limited result sets using LIMIT
- Performed pattern matching using LIKE
- Filtered ranges using BETWEEN
- Created conditional categories using CASE statements

These SELECT techniques form the foundation of data retrieval in SQL and are essential for querying databases effectively.
