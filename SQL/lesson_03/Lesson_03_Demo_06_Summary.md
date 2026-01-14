# Lesson 03 Demo 06 - Performing Different Types of Joins

## Exercise Summary

**Objective:** Perform different types of joins in MySQL to combine records from multiple tables and analyze related data

**Tools Required:** MySQL Workbench

**Prerequisites:** Familiarity with basic SQL syntax and database terminology

### What You'll Learn
- Combine data from multiple tables using joins
- Use INNER JOIN to find matching records
- Use LEFT JOIN to include all records from the left table
- Use RIGHT JOIN to include all records from the right table
- Simulate FULL OUTER JOIN using UNION
- Create all possible combinations with CROSS JOIN
- Understand when to use each join type

### Database Structure Created
- **Database:** `HotelDB`
- **Tables:**
  - `Customers` - stores customer information
  - `Rooms` - stores room types and details
  - `Bookings` - links customers to rooms with booking dates

---

## Database Setup

### Create Database and Tables
```sql
CREATE DATABASE HotelDB;
USE HotelDB;

-- Customers Table
CREATE TABLE Customers (
    customer_id INT PRIMARY KEY,
    name VARCHAR(50)
);

-- Rooms Table
CREATE TABLE Rooms (
    room_id INT PRIMARY KEY,
    room_type VARCHAR(50)
);

-- Bookings Table
CREATE TABLE Bookings (
    booking_id INT PRIMARY KEY,
    customer_id INT,
    room_id INT,
    booking_date DATE,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (room_id) REFERENCES Rooms(room_id)
);
```

### Sample Data

**Customers:**
```sql
INSERT INTO Customers VALUES
(1, 'Alice'),
(2, 'Bob'),
(3, 'Charlie'),
(4, 'David'),
(5, 'Eva'),
(6, 'Frank');
```

**Rooms:**
```sql
INSERT INTO Rooms VALUES
(101, 'Deluxe'),
(102, 'Standard'),
(103, 'Suite'),
(104, 'Economy'),
(105, 'Deluxe'),
(106, 'Presidential Suite');
```

**Bookings:**
```sql
INSERT INTO Bookings VALUES
(1, 1, 101, '2025-04-01'),
(2, 2, 102, '2025-04-02'),
(3, 3, 103, '2025-04-03'),
(4, 4, 105, '2025-04-05'),
(5, 5, 104, '2025-04-07'),
(6, 1, 106, '2025-04-08');
```

**Data Overview:**
- 6 Customers (Alice, Bob, Charlie, David, Eva, Frank)
- 6 Rooms (various types)
- 6 Bookings (Alice has 2 bookings, Frank has no bookings)

---

## Types of Joins

### 1. INNER JOIN
**Returns only matching records from both tables**

```sql
SELECT c.name, r.room_type, b.booking_date
FROM Bookings b
INNER JOIN Customers c ON b.customer_id = c.customer_id
INNER JOIN Rooms r ON b.room_id = r.room_id;
```

**Result:** 6 rows (only customers who made bookings)

**What it does:**
- Returns records only when there's a match in both tables
- Most commonly used join type
- Excludes unmatched records from both tables

**Visual Representation:**
```
Table A          Table B
   ┌─────┐         ┌─────┐
   │     │         │     │
   │  ███████████████  │
   │     │         │     │
   └─────┘         └─────┘
     Only the overlapping area
```

**Use case:** Find customers who have made bookings with room details

---

### 2. LEFT JOIN (LEFT OUTER JOIN)
**Returns all records from the left table and matching records from the right table**

```sql
SELECT c.name, r.room_type, b.booking_date
FROM Customers c
LEFT JOIN Bookings b ON c.customer_id = b.customer_id
LEFT JOIN Rooms r ON b.room_id = r.room_id;
```

**Result:** 7 rows (includes Frank with NULL values for booking and room)

**What it does:**
- Returns ALL records from the left table (Customers)
- Matching records from the right table (Bookings, Rooms)
- NULL values for right table columns when no match exists

**Visual Representation:**
```
Table A          Table B
   ┌─────┐         ┌─────┐
   │█████│         │     │
   │█████████████████  │
   │█████│         │     │
   └─────┘         └─────┘
     All of A + matching B
```

**Use case:** List all customers, including those who haven't made bookings

---

### 3. RIGHT JOIN (RIGHT OUTER JOIN)
**Returns all records from the right table and matching records from the left table**

```sql
SELECT c.name, r.room_type, b.booking_date
FROM Rooms r
RIGHT JOIN Bookings b ON r.room_id = b.room_id
RIGHT JOIN Customers c ON b.customer_id = c.customer_id;
```

**Result:** 6 rows (all bookings with customer and room details)

**What it does:**
- Returns ALL records from the right table
- Matching records from the left table
- NULL values for left table columns when no match exists

**Visual Representation:**
```
Table A          Table B
   ┌─────┐         ┌─────┐
   │     │         │█████│
   │  ███████████████████│
   │     │         │█████│
   └─────┘         └─────┘
     All of B + matching A
```

**Use case:** Show all bookings with customer details

**Note:** In this example, RIGHT JOIN produces similar results to INNER JOIN because all bookings have corresponding customers and rooms. To see the difference, you'd need bookings with NULL customer_id or room_id.

---

### 4. FULL OUTER JOIN (Simulated with UNION)
**Returns all records when there's a match in either left or right table**

```sql
-- LEFT JOIN
SELECT c.name, r.room_type, b.booking_date
FROM Customers c
LEFT JOIN Bookings b ON c.customer_id = b.customer_id
LEFT JOIN Rooms r ON b.room_id = r.room_id

UNION

-- RIGHT JOIN
SELECT c.name, r.room_type, b.booking_date
FROM Rooms r
RIGHT JOIN Bookings b ON r.room_id = b.room_id
RIGHT JOIN Customers c ON b.customer_id = c.customer_id;
```

**Result:** 7 rows (all customers and all bookings, including unmatched)

**What it does:**
- Combines LEFT JOIN and RIGHT JOIN results
- Returns all records from both tables
- NULL values where no match exists on either side

**Visual Representation:**
```
Table A          Table B
   ┌─────┐         ┌─────┐
   │█████│         │█████│
   │█████████████████████│
   │█████│         │█████│
   └─────┘         └─────┘
     All of A + All of B
```

**Important Note:** MySQL does not directly support FULL OUTER JOIN syntax. Use UNION to combine LEFT and RIGHT joins.

**Use case:** List all customers and all rooms, showing which are booked and which are not

---

### 5. CROSS JOIN (Cartesian Product)
**Returns all possible combinations of rows from both tables**

```sql
SELECT c.name, r.room_type
FROM Customers c
CROSS JOIN Rooms r;
```

**Result:** 36 rows (6 customers × 6 rooms)

**What it does:**
- Combines every row from the first table with every row from the second table
- No ON condition needed
- Produces N × M rows where N and M are row counts of each table

**Visual Representation:**
```
Every row in A paired with every row in B
Customer 1 → Room 1, Room 2, Room 3, Room 4, Room 5, Room 6
Customer 2 → Room 1, Room 2, Room 3, Room 4, Room 5, Room 6
...and so on
```

**Use case:** Generate all possible room assignment options for customers, create test data combinations

**Warning:** CROSS JOIN can produce very large result sets. Use with caution on large tables.

---

## Join Syntax Comparison

### Explicit JOIN (Recommended)
```sql
SELECT *
FROM table1
INNER JOIN table2 ON table1.id = table2.id;
```

### Implicit JOIN (Older style)
```sql
SELECT *
FROM table1, table2
WHERE table1.id = table2.id;
```

**Best Practice:** Use explicit JOIN syntax for better readability and maintainability.

---

## Understanding Join Conditions

### ON Clause
Specifies the relationship between tables
```sql
FROM Customers c
INNER JOIN Bookings b ON c.customer_id = b.customer_id
```

### Multiple Join Conditions
```sql
FROM Orders o
INNER JOIN OrderDetails od ON o.order_id = od.order_id
                           AND o.customer_id = od.customer_id
```

### USING Clause (when column names match)
```sql
FROM Customers c
INNER JOIN Bookings b USING (customer_id)
```
**Note:** Only works when join columns have identical names.

---

## Practical Examples

### Example 1: Find Customers with Multiple Bookings
```sql
SELECT c.name, COUNT(b.booking_id) AS booking_count
FROM Customers c
INNER JOIN Bookings b ON c.customer_id = b.customer_id
GROUP BY c.customer_id, c.name
HAVING COUNT(b.booking_id) > 1;
```

**Result:** Alice (2 bookings)

---

### Example 2: Find Customers Without Bookings
```sql
SELECT c.name
FROM Customers c
LEFT JOIN Bookings b ON c.customer_id = b.customer_id
WHERE b.booking_id IS NULL;
```

**Result:** Frank (no bookings)

---

### Example 3: Find Unbooked Rooms
```sql
SELECT r.room_id, r.room_type
FROM Rooms r
LEFT JOIN Bookings b ON r.room_id = b.room_id
WHERE b.booking_id IS NULL;
```

**Result:** Rooms that haven't been booked

---

### Example 4: Room Booking Summary
```sql
SELECT r.room_type,
       COUNT(b.booking_id) AS bookings,
       GROUP_CONCAT(c.name SEPARATOR ', ') AS customers
FROM Rooms r
LEFT JOIN Bookings b ON r.room_id = b.room_id
LEFT JOIN Customers c ON b.customer_id = c.customer_id
GROUP BY r.room_id, r.room_type;
```

**Result:** Summary of bookings per room type

---

### Example 5: Three-Table Join
```sql
SELECT c.name AS customer_name,
       r.room_type,
       b.booking_date,
       DATEDIFF(b.booking_date, CURDATE()) AS days_until_booking
FROM Bookings b
INNER JOIN Customers c ON b.customer_id = c.customer_id
INNER JOIN Rooms r ON b.room_id = r.room_id
WHERE b.booking_date >= CURDATE()
ORDER BY b.booking_date;
```

**Result:** Upcoming bookings with customer and room details

---

## Advanced Join Techniques

### Self Join
Join a table to itself
```sql
-- Find customers from the same city
SELECT c1.name AS customer1,
       c2.name AS customer2,
       c1.city
FROM Customers c1
INNER JOIN Customers c2 ON c1.city = c2.city
                        AND c1.customer_id < c2.customer_id;
```

---

### Multiple Joins with Different Types
```sql
SELECT c.name,
       b.booking_date,
       r.room_type,
       p.amount
FROM Customers c
LEFT JOIN Bookings b ON c.customer_id = b.customer_id
INNER JOIN Rooms r ON b.room_id = r.room_id
LEFT JOIN Payments p ON b.booking_id = p.booking_id;
```

---

### Join with Subquery
```sql
SELECT c.name, booking_count
FROM Customers c
INNER JOIN (
    SELECT customer_id, COUNT(*) AS booking_count
    FROM Bookings
    GROUP BY customer_id
) AS counts ON c.customer_id = counts.customer_id;
```

---

## Join Performance Tips

### 1. Index Join Columns
```sql
CREATE INDEX idx_customer_id ON Bookings(customer_id);
CREATE INDEX idx_room_id ON Bookings(room_id);
```

**Why:** Indexes significantly speed up join operations

---

### 2. Join Order Matters
```sql
-- Start with the smallest table
FROM SmallTable
INNER JOIN LargeTable ON ...
```

**Why:** Reduces the working set size early

---

### 3. Filter Early
```sql
-- Filter before joining (better)
SELECT c.name, b.booking_date
FROM Customers c
INNER JOIN (
    SELECT * FROM Bookings WHERE booking_date > '2025-04-01'
) AS recent_bookings ON c.customer_id = recent_bookings.customer_id;

-- vs filtering after joining (slower)
SELECT c.name, b.booking_date
FROM Customers c
INNER JOIN Bookings b ON c.customer_id = b.customer_id
WHERE b.booking_date > '2025-04-01';
```

**Note:** Modern query optimizers often handle this automatically, but explicit filtering can help.

---

### 4. Avoid CROSS JOIN on Large Tables
```sql
-- Can produce millions of rows!
SELECT * FROM LargeTable1 CROSS JOIN LargeTable2;
```

---

### 5. Use EXPLAIN to Analyze
```sql
EXPLAIN SELECT c.name, b.booking_date
FROM Customers c
INNER JOIN Bookings b ON c.customer_id = b.customer_id;
```

**Why:** Shows how MySQL executes the query and identifies performance issues

---

## Common Join Patterns

### Pattern 1: Master-Detail Relationship
```sql
-- Orders with order items
SELECT o.order_id, o.order_date, oi.product_id, oi.quantity
FROM Orders o
INNER JOIN OrderItems oi ON o.order_id = oi.order_id;
```

---

### Pattern 2: Optional Relationships
```sql
-- Employees with optional managers
SELECT e.name AS employee,
       m.name AS manager
FROM Employees e
LEFT JOIN Employees m ON e.manager_id = m.employee_id;
```

---

### Pattern 3: Many-to-Many with Junction Table
```sql
-- Students and courses (with enrollments as junction)
SELECT s.name AS student,
       c.title AS course
FROM Students s
INNER JOIN Enrollments e ON s.student_id = e.student_id
INNER JOIN Courses c ON e.course_id = c.course_id;
```

---

### Pattern 4: Aggregation with Joins
```sql
-- Customer order totals
SELECT c.name,
       COUNT(o.order_id) AS order_count,
       SUM(o.total) AS total_spent
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name;
```

---

## When to Use Each Join Type

### Use INNER JOIN when:
- You only want records that exist in both tables
- Finding related data that must exist (e.g., order items with valid products)
- Default choice for most queries

### Use LEFT JOIN when:
- You want all records from the main table
- Optional relationships (e.g., customers with or without orders)
- Finding missing relationships (use WHERE right_table.id IS NULL)

### Use RIGHT JOIN when:
- You want all records from the second table
- Less common; often rewritten as LEFT JOIN by switching table order

### Use FULL OUTER JOIN when:
- You need all records from both tables
- Finding mismatches in both directions
- Data validation queries

### Use CROSS JOIN when:
- Generating all combinations
- Creating test data
- Mathematical combinations
- **Caution:** Can create very large result sets

---

## Common Mistakes and Solutions

### Mistake 1: Missing JOIN Condition
**Wrong:**
```sql
SELECT * FROM Customers c, Bookings b;
```
**Result:** Cartesian product (all combinations)

**Correct:**
```sql
SELECT * FROM Customers c
INNER JOIN Bookings b ON c.customer_id = b.customer_id;
```

---

### Mistake 2: Confusing LEFT and RIGHT JOIN
**Remember:**
- LEFT JOIN keeps all from the LEFT table
- RIGHT JOIN keeps all from the RIGHT table

**Tip:** Always use LEFT JOIN and switch table order if needed for clarity

---

### Mistake 3: Not Handling NULL Values
**Problem:**
```sql
LEFT JOIN returns NULL for unmatched rows
```

**Solution:**
```sql
SELECT c.name,
       COALESCE(r.room_type, 'No Booking') AS room
FROM Customers c
LEFT JOIN Bookings b ON c.customer_id = b.customer_id
LEFT JOIN Rooms r ON b.room_id = r.room_id;
```

---

### Mistake 4: Duplicate Rows from One-to-Many Relationships
**Problem:** Customer appears multiple times if they have multiple bookings

**Solution:** Use GROUP BY or DISTINCT
```sql
SELECT DISTINCT c.customer_id, c.name
FROM Customers c
INNER JOIN Bookings b ON c.customer_id = b.customer_id;

-- OR

SELECT c.customer_id, c.name
FROM Customers c
INNER JOIN Bookings b ON c.customer_id = b.customer_id
GROUP BY c.customer_id, c.name;
```

---

### Mistake 5: Ambiguous Column Names
**Wrong:**
```sql
SELECT name FROM Customers c
INNER JOIN Bookings b ON c.customer_id = b.customer_id;
```
**Error if both tables have 'name' column**

**Correct:**
```sql
SELECT c.name FROM Customers c
INNER JOIN Bookings b ON c.customer_id = b.customer_id;
```

---

## Testing Your Understanding

### Question 1: What's the difference?
```sql
-- Query A
SELECT * FROM Customers c
LEFT JOIN Bookings b ON c.customer_id = b.customer_id;

-- Query B
SELECT * FROM Customers c
INNER JOIN Bookings b ON c.customer_id = b.customer_id;
```

**Answer:** Query A includes customers without bookings (returns 7 rows including Frank with NULLs). Query B only includes customers with bookings (returns 6 rows).

---

### Question 2: How many rows?
```sql
SELECT * FROM Customers CROSS JOIN Rooms;
```

**Answer:** 36 rows (6 customers × 6 rooms)

---

### Question 3: Find customers without bookings
```sql
-- Solution
SELECT c.name
FROM Customers c
LEFT JOIN Bookings b ON c.customer_id = b.customer_id
WHERE b.booking_id IS NULL;
```

---

## Quick Reference Table

| Join Type | Returns | NULL Handling | Use Case |
|-----------|---------|---------------|----------|
| INNER JOIN | Only matches | No NULLs | Related data only |
| LEFT JOIN | All left + matches | NULLs in right | All main records + optional related |
| RIGHT JOIN | All right + matches | NULLs in left | All secondary records + optional related |
| FULL OUTER JOIN | All from both | NULLs on both sides | Complete picture of both tables |
| CROSS JOIN | All combinations | N/A | Generate all possibilities |

---

## Summary

By following these steps, you have successfully:
- Combined data from multiple tables using INNER JOIN
- Retrieved all records from the left table using LEFT JOIN
- Retrieved all records from the right table using RIGHT JOIN
- Simulated FULL OUTER JOIN using UNION
- Generated all possible combinations using CROSS JOIN
- Understood when to use each join type
- Learned performance optimization techniques
- Mastered complex multi-table queries

Joins are fundamental to relational databases and enable you to work with normalized data structures efficiently. Practice these patterns to become proficient in combining data from multiple tables.
