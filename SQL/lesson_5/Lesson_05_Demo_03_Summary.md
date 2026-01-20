# Lesson 05 Demo 03 - Creating and Managing Indexes in MySQL

## Exercise Summary

**Objective:** Create and manage different types of indexes in MySQL and understand their role in improving query performance and ensuring data integrity

**Tools Required:** MySQL Workbench

**Prerequisites:** None

### What You'll Learn
- Create a sample table and insert data
- Create single-column indexes
- Create composite (multi-column) indexes
- Create unique indexes to enforce data integrity
- Create full-text indexes for text searching
- View existing indexes on a table
- Drop indexes when no longer needed

### Database Structure Created
- **Database:** `DEMO3`
- **Tables:**
  - `products` - stores product information (id, name, category, price, stock)

---

## Step 1: Create a Sample Table and Insert Data

### Create the Database
```sql
CREATE DATABASE DEMO3;
USE DEMO3;
```

### Create the Products Table
```sql
CREATE TABLE products (
   product_id INT PRIMARY KEY,
   product_name VARCHAR(100),
   category VARCHAR(50),
   price DECIMAL(10,2),
   stock_quantity INT
);
```

### Insert Sample Data
```sql
INSERT INTO products VALUES
(1, 'Laptop', 'Electronics', 80000, 50),
(2, 'Phone', 'Electronics', 30000, 100),
(3, 'Table', 'Furniture', 15000, 20),
(4, 'Chair', 'Furniture', 5000, 30),
(5, 'TV', 'Electronics', 45000, 10);
```

---

## Step 2: Create Different Types of Indexes

### Single-Column Index
```sql
CREATE INDEX idx_category ON products (category);
```

**Purpose:** Speeds up queries that filter or sort by the `category` column.

**Example query that benefits:**
```sql
SELECT * FROM products WHERE category = 'Electronics';
```

### Composite Index (Multi-Column)
```sql
CREATE INDEX idx_category_price ON products (category, price);
```

**Purpose:** Optimizes queries that filter by both `category` and `price`, or by `category` alone (leftmost column).

**Example query that benefits:**
```sql
SELECT * FROM products WHERE category = 'Electronics' AND price < 50000;
```

### Unique Index
```sql
CREATE UNIQUE INDEX idx_unique_product_name ON products (product_name);
```

**Purpose:** Ensures all values in the `product_name` column are unique. Attempts to insert duplicate product names will fail.

### Full-Text Index
```sql
ALTER TABLE products ADD FULLTEXT INDEX idx_fulltext_product_name (product_name);
```

**Purpose:** Enables efficient full-text searching on the `product_name` column.

**Example query that benefits:**
```sql
SELECT * FROM products WHERE MATCH(product_name) AGAINST('Laptop');
```

---

## Step 3: View Existing Indexes

### Show All Indexes on a Table
```sql
SHOW INDEXES FROM products;
```

**Result:** Displays detailed information about all indexes on the table, including:
- `Key_name` - Name of the index
- `Column_name` - Column(s) included in the index
- `Non_unique` - Whether duplicate values are allowed (0 = unique, 1 = non-unique)
- `Index_type` - Type of index (BTREE, FULLTEXT, etc.)

---

## Step 4: Drop Indexes

### Drop a Specific Index
```sql
DROP INDEX idx_category ON products;
```

**Result:** The index is removed from the table. Queries that previously used this index will now use table scans or other available indexes.

---

## Key Concepts

### What is an Index?
An index is a data structure that improves the speed of data retrieval operations on a table at the cost of additional storage space and slower writes (INSERT, UPDATE, DELETE).

### Types of Indexes

| Index Type | Purpose | Syntax |
|------------|---------|--------|
| **Single-Column** | Speeds up queries on one column | `CREATE INDEX idx_name ON table (column);` |
| **Composite** | Optimizes queries on multiple columns | `CREATE INDEX idx_name ON table (col1, col2);` |
| **Unique** | Ensures column values are unique | `CREATE UNIQUE INDEX idx_name ON table (column);` |
| **Full-Text** | Enables text search capabilities | `ALTER TABLE table ADD FULLTEXT INDEX idx_name (column);` |
| **Primary Key** | Automatically created; unique identifier | Defined with `PRIMARY KEY` constraint |

### Index Management Commands

| Command | Purpose |
|---------|---------|
| `CREATE INDEX` | Creates a new index |
| `CREATE UNIQUE INDEX` | Creates a unique index |
| `ALTER TABLE ... ADD FULLTEXT INDEX` | Adds a full-text index |
| `SHOW INDEXES FROM table;` | Lists all indexes on a table |
| `DROP INDEX idx_name ON table;` | Removes an index |

### When to Use Indexes
- Columns frequently used in WHERE clauses
- Columns used in JOIN conditions
- Columns used in ORDER BY or GROUP BY
- Columns with high selectivity (many unique values)

### When NOT to Use Indexes
- Small tables where full scans are fast enough
- Columns with low selectivity (few unique values)
- Tables with frequent INSERT/UPDATE/DELETE operations
- Columns rarely used in queries

---

## Indexes Created Summary

| Index Name | Type | Column(s) | Purpose |
|------------|------|-----------|---------|
| `PRIMARY` | Primary Key | `product_id` | Unique row identifier |
| `idx_category` | Single-Column | `category` | Speed up category searches |
| `idx_category_price` | Composite | `category`, `price` | Optimize category + price queries |
| `idx_unique_product_name` | Unique | `product_name` | Ensure unique product names |
| `idx_fulltext_product_name` | Full-Text | `product_name` | Enable text searching |

---

## Additional Notes

- Indexes improve read performance but can slow down write operations
- The PRIMARY KEY constraint automatically creates a unique index
- Composite indexes follow the "leftmost prefix" rule - they can be used for queries on the first column, first two columns, etc.
- Full-text indexes are specifically designed for searching text content and support natural language queries
- Regularly review and optimize indexes based on actual query patterns
