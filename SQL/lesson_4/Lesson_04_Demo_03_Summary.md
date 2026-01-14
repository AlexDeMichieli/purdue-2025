# Lesson 04 Demo 03 - Creating and Querying Views

## Exercise Summary

**Objective:** Create and query SQL views that simplify data access while abstracting complex queries and enhancing security by restricting column-level exposure

**Tools Required:** MySQL Workbench

**Prerequisites:** Basic understanding of SQL syntax

### What You'll Learn
- Create and populate tables for a restaurant scenario
- Create views to display filtered data
- Query views using SELECT statements
- Use conditions like LIKE in view definitions
- Observe how views automatically reflect base table changes

### Database Structure Created
- **Database:** `demo_db`
- **Tables:**
  - `customers` - stores customer information (customer_id, name, phone)
  - `menu` - stores menu items (item_id, item_name, price)

---

## Step 1: Create and Populate Tables

```sql
CREATE DATABASE IF NOT EXISTS demo_db;
USE demo_db;

CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    phone VARCHAR(15)
);

CREATE TABLE menu (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    item_name VARCHAR(100),
    price DECIMAL(5,2)
);

INSERT INTO customers (name, phone) VALUES
('Alice', '555-1111'),
('Bob', '555-2222'),
('Charlie', '555-3333');

INSERT INTO menu (item_name, price) VALUES
('Burger', 5.99),
('Pizza', 8.49),
('Salad', 4.50);
```

---

## Step 2: Create Views

### Create a View for Customer Contact Information
```sql
CREATE VIEW customer_contact_view AS
SELECT customer_id, name, phone
FROM customers;
```

### Create a View for Affordable Menu Items (Under $6)
```sql
CREATE VIEW affordable_menu_view AS
SELECT item_name, price
FROM menu
WHERE price < 6.00;
```

---

## Step 3: Query Views Using SELECT

```sql
SELECT * FROM customer_contact_view;
SELECT * FROM affordable_menu_view;
```

**Results:**
- `customer_contact_view` returns all customer contact details
- `affordable_menu_view` returns Burger ($5.99) and Salad ($4.50)

---

## Step 4: Create a View Using LIKE Condition

### Filter Items Starting with Letter 'P'
```sql
CREATE VIEW p_items_view AS
SELECT item_name, price
FROM menu
WHERE item_name LIKE 'P%';

SELECT * FROM p_items_view;
```

**Result:** Returns Pizza ($8.49).

---

## Step 5: Update Base Table and Observe View Changes

### Add New Item to Menu Table
```sql
INSERT INTO menu (item_name, price) VALUES ('Pasta', 7.00);
SELECT * FROM p_items_view;
```

**Result:** The view now automatically includes both Pizza and Pasta (items starting with 'P').

---

## Key Concepts

### What is a View?
A view is a virtual table based on the result of a SELECT query. It does not store data itself but provides a way to:
- Simplify complex queries
- Restrict access to specific columns (security)
- Present data in a different format
- Abstract underlying table structure

### View Syntax
```sql
CREATE VIEW view_name AS
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```

### Views vs Tables
| Feature | Table | View |
|---------|-------|------|
| Stores data | Yes | No (virtual) |
| Takes storage space | Yes | No |
| Auto-updates with base data | N/A | Yes |
| Can have indexes | Yes | No |

### LIKE Pattern Matching
| Pattern | Matches |
|---------|---------|
| `'P%'` | Starts with P |
| `'%a'` | Ends with a |
| `'%pizza%'` | Contains "pizza" |
| `'_ob'` | Three characters ending in "ob" |

---

## Additional Notes

- Views automatically reflect changes made to the underlying base tables
- Views can be queried just like regular tables using SELECT
- Views provide a security layer by exposing only specific columns
- Use `DROP VIEW view_name` to remove a view
- Views do not improve query performance (they execute the underlying query each time)
