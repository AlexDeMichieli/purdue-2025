# Lesson 03 Demo 01 - Performing DDL Commands

## Exercise Summary

**Objective:** Create and manage database schema components using DDL (Data Definition Language) commands in MySQL Workbench

**Tools Required:** MySQL Workbench

**Prerequisites:** Familiarity with basic SQL syntax and database terminology

### What You'll Learn
- Create a database
- Create multiple related tables with constraints
- Modify table structure (add columns)
- Rename tables
- Truncate table data
- Drop tables

### Database Structure Created
- **Database:** `ecommerce_db`
- **Tables:**
  - `customers` - stores customer information
  - `orders` - stores order records with foreign key to customers
  - `products` - stores product catalog
  - `order_items` (renamed to `order_details`) - stores order line items with foreign keys

---

## DDL Commands Used

### 1. CREATE DATABASE
Creates a new database
```sql
CREATE DATABASE ecommerce_db;
# Alternative with conditional check:
# CREATE DATABASE IF NOT EXISTS ecommerce_db;
```

### 2. USE
Selects a database as the current working database
```sql
USE ecommerce_db;
```

### 3. CREATE TABLE
Creates new tables with various constraints

**Customers Table:**
```sql
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Orders Table:**
```sql
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

**Products Table:**
```sql
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0
);
```

**Order Items Table:**
```sql
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
```

### 4. ALTER TABLE
Modifies existing table structure
```sql
ALTER TABLE products
ADD COLUMN category VARCHAR(50);
```

### 5. RENAME TABLE
Renames an existing table
```sql
RENAME TABLE order_items TO order_details;
```

### 6. TRUNCATE TABLE
Removes all data from a table while keeping the structure
```sql
TRUNCATE TABLE order_details;
```

### 7. DROP TABLE
Completely removes a table from the database
```sql
DROP TABLE order_details;
```

---

## Key Concepts

### Constraints Used
- **PRIMARY KEY** - Uniquely identifies each record
- **FOREIGN KEY** - Creates relationships between tables
- **AUTO_INCREMENT** - Automatically generates sequential numbers
- **NOT NULL** - Ensures field cannot be empty
- **UNIQUE** - Ensures all values in column are different
- **DEFAULT** - Sets default value if none provided

### Data Types Used
- **INT** - Integer numbers
- **VARCHAR(n)** - Variable-length character string (max n characters)
- **DECIMAL(10,2)** - Decimal number with 10 total digits, 2 after decimal point
- **DATETIME** - Date and time values

---

## Additional Notes

- Use **Refresh All** in the Schemas tab to verify changes made by SQL commands
- The database follows a relational structure with proper foreign key relationships
- TRUNCATE vs DROP: TRUNCATE removes data but keeps the table structure; DROP removes the entire table
