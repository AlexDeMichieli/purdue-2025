# Lesson 04 Demo 04 - Leveraging Subqueries and Keys in Procedures and Views

## Exercise Summary

**Objective:** Build SQL procedures and views with subqueries and enforce relational integrity using keys, enabling clean and reusable logic for complex data operations

**Tools Required:** MySQL Workbench

**Prerequisites:** Basic understanding of SQL syntax

### What You'll Learn
- Create tables with primary and foreign key constraints
- Create views using subqueries to identify patterns in data
- Build stored procedures that use subqueries
- Create parameterized procedures with dynamic filters

### Database Structure Created
- **Database:** `demo_db`
- **Tables:**
  - `customers` - stores customer information (customer_id, name)
  - `orders` - stores order records with foreign key to customers (order_id, customer_id, total_amount)

---

## Step 1: Create Tables with Key Constraints

### Create Database and Tables
```sql
CREATE DATABASE IF NOT EXISTS demo_db;
USE demo_db;

CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

### Insert Sample Data
```sql
INSERT INTO customers (name) VALUES
('Alice'), ('Bob'), ('Charlie');

INSERT INTO orders (customer_id, total_amount) VALUES
(1, 250.00),
(1, 300.00),
(2, 150.00),
(3, 450.00);
```

**Data Summary:**
- Alice (id=1): Two orders totaling $550
- Bob (id=2): One order totaling $150
- Charlie (id=3): One order totaling $450

---

## Step 2: Create a View Using a Subquery

### Identify High-Spending Customers
```sql
CREATE VIEW high_spending_customers AS
SELECT name, customer_id
FROM customers
WHERE customer_id IN (
    SELECT customer_id
    FROM orders
    GROUP BY customer_id
    HAVING SUM(total_amount) > (
        SELECT AVG(total_amount) FROM orders
    )
);
```

### Query the View
```sql
SELECT * FROM high_spending_customers;
```

**Result:** Returns customers whose total spending exceeds the average order amount.

---

## Step 3: Create a Stored Procedure Using a Subquery

### Filter Orders for High Spenders
```sql
DELIMITER //

CREATE PROCEDURE GetHighSpenderOrders()
BEGIN
    SELECT * FROM orders
    WHERE customer_id IN (
        SELECT customer_id
        FROM orders
        GROUP BY customer_id
        HAVING SUM(total_amount) > (
            SELECT AVG(total_amount) FROM orders
        )
    );
END //

DELIMITER ;
```

### Call the Procedure
```sql
CALL GetHighSpenderOrders();
```

**Result:** Returns all orders belonging to high-spending customers.

---

## Step 4: Create a Procedure with Dynamic Filter

### Accept Dynamic Spending Threshold
```sql
DELIMITER //

CREATE PROCEDURE GetOrdersAboveThreshold(IN minSpending DECIMAL(10,2))
BEGIN
    SELECT * FROM orders
    WHERE customer_id IN (
        SELECT customer_id
        FROM orders
        GROUP BY customer_id
        HAVING SUM(total_amount) > minSpending
    );
END //

DELIMITER ;
```

### Call with Custom Threshold
```sql
CALL GetOrdersAboveThreshold(400.00);
```

**Result:** Returns orders for customers whose total spending exceeds $400.

---

## Key Concepts

### Primary and Foreign Keys
| Key Type | Purpose |
|----------|---------|
| **PRIMARY KEY** | Uniquely identifies each row in a table |
| **FOREIGN KEY** | Creates a link between two tables, enforcing referential integrity |

### Subquery Types Used
| Type | Description | Example |
|------|-------------|---------|
| **Scalar** | Returns a single value | `SELECT AVG(total_amount) FROM orders` |
| **List** | Returns multiple values for IN clause | `SELECT customer_id FROM orders GROUP BY...` |
| **Nested** | Subquery within a subquery | HAVING clause comparing to AVG subquery |

### Subquery in WHERE Clause
```sql
WHERE column IN (SELECT column FROM table WHERE condition)
```

### Aggregate Functions with HAVING
```sql
GROUP BY column
HAVING SUM(column) > value
```
- `HAVING` filters groups after aggregation
- `WHERE` filters rows before aggregation

---

## Query Logic Breakdown

### High Spender Identification Logic
1. Calculate average order amount across all orders
2. Group orders by customer and sum their totals
3. Filter customers whose total exceeds the average
4. Return matching customer IDs for the outer query

```
Average order = (250 + 300 + 150 + 450) / 4 = $287.50

Customer totals:
- Alice: $550 (> $287.50) ✓
- Bob: $150 (< $287.50) ✗
- Charlie: $450 (> $287.50) ✓
```

---

## Additional Notes

- Subqueries can be used in SELECT, FROM, WHERE, and HAVING clauses
- Foreign keys ensure data integrity (cannot insert order for non-existent customer)
- Parameterized procedures make queries flexible and reusable
- Views with subqueries encapsulate complex logic for easy reuse
- The IN operator works well with subqueries that return multiple values
