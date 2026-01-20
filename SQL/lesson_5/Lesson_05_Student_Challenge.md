# Lesson 05 - Student Challenge: E-Commerce Order Management System

## Scenario
You've been hired to enhance the database for an e-commerce company called **"ShopSmart"**. The company needs automated data validation, audit logging, optimized queries, and a backup strategy for their order management system.

---

## Part 1: Create the Database and Tables

### Task 1.1: Create the Database
Create a new database called `shopmart_db` and switch to use it.

### Task 1.2: Create the Products Table
Create a table called `products` with the following columns:
| Column | Data Type | Constraints |
|--------|-----------|-------------|
| product_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| product_name | VARCHAR(100) | |
| category | VARCHAR(50) | |
| price | DECIMAL(10,2) | |
| stock_quantity | INT | |

### Task 1.3: Create the Orders Table
Create a table called `orders` with the following columns:
| Column | Data Type | Constraints |
|--------|-----------|-------------|
| order_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| customer_name | VARCHAR(100) | |
| product_id | INT | FOREIGN KEY references products |
| quantity | INT | |
| order_date | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| status | VARCHAR(20) | |

### Task 1.4: Create the Audit Log Table
Create a table called `order_audit` with the following columns:
| Column | Data Type | Constraints |
|--------|-----------|-------------|
| audit_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| order_id | INT | |
| action_type | VARCHAR(20) | |
| action_time | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| details | VARCHAR(255) | |

### Task 1.5: Insert Sample Data
Insert the following products:

| product_name | category | price | stock_quantity |
|--------------|----------|-------|----------------|
| Wireless Mouse | Electronics | 29.99 | 100 |
| Mechanical Keyboard | Electronics | 89.99 | 50 |
| Office Chair | Furniture | 199.99 | 25 |
| Standing Desk | Furniture | 349.99 | 15 |
| USB-C Hub | Electronics | 49.99 | 75 |
| Monitor Stand | Furniture | 79.99 | 40 |

---

## Part 2: Create Triggers

### Task 2.1: BEFORE INSERT Trigger - Standardize Customer Names
Create a trigger called `before_insert_uppercase_customer` that automatically converts the `customer_name` to uppercase before inserting a new order.

### Task 2.2: AFTER INSERT Trigger - Audit Logging
Create a trigger called `after_insert_order_audit` that logs every new order by inserting a record into the `order_audit` table with:
- The `order_id` from the new order
- `action_type` set to 'INSERT'
- `details` showing the product_id and quantity (e.g., 'Product: 1, Qty: 2')

### Task 2.3: BEFORE UPDATE Trigger - Validate Status Changes
Create a trigger called `before_update_status_check` that prevents changing an order's status from 'Shipped' to 'Pending'. If attempted, raise an error with the message: 'Cannot change status from Shipped back to Pending'.

**Hint:** Use `SIGNAL SQLSTATE '45000'` to raise the error.

### Task 2.4: AFTER DELETE Trigger - Audit Deletion
Create a trigger called `after_delete_order_audit` that logs order deletions in the `order_audit` table with `action_type` set to 'DELETE'.

---

## Part 3: Create Indexes

### Task 3.1: Create a Single-Column Index
Create an index called `idx_category` on the `category` column of the products table to speed up category searches.

### Task 3.2: Create a Composite Index
Create a composite index called `idx_order_date_status` on the `order_date` and `status` columns of the orders table.

### Task 3.3: Create a Unique Index
Create a unique index called `idx_unique_product_name` on the `product_name` column to ensure no duplicate product names.

### Task 3.4: View Your Indexes
Write the command to display all indexes on the products table.

---

## Part 4: Test Your Triggers

### Task 4.1: Test the Uppercase Trigger
Insert an order with a lowercase customer name:
```sql
INSERT INTO orders (customer_name, product_id, quantity, status)
VALUES ('john smith', 1, 2, 'Pending');
```
Verify that the customer name was converted to uppercase.

### Task 4.2: Test the Audit Trigger
Check the `order_audit` table to verify the INSERT was logged.

### Task 4.3: Test the Status Validation Trigger
First, update the order status to 'Shipped':
```sql
UPDATE orders SET status = 'Shipped' WHERE order_id = 1;
```
Then, try to change it back to 'Pending' and observe the error:
```sql
UPDATE orders SET status = 'Pending' WHERE order_id = 1;
```

---

## Part 5: Backup and Restore

### Task 5.1: Backup the Database
Using the command line, create a backup of the `shopmart_db` database to a file called `shopmart_backup.sql`.

**Command format:** `mysqldump -u root -p --databases dbname > filename.sql`

### Task 5.2: Document the Restore Command
Write the command you would use to restore the database from the backup file.

---

## Bonus Challenge (Optional)

### Bonus 1: Stock Quantity Update Trigger
Create a trigger called `after_insert_update_stock` that automatically decreases the `stock_quantity` in the products table when a new order is placed.

**Warning:** Be careful with this trigger - it modifies another table!

### Bonus 2: Prevent Low Stock Orders
Create a BEFORE INSERT trigger called `before_insert_check_stock` that prevents placing an order if the requested quantity exceeds the available stock. Raise an error with the message: 'Insufficient stock available'.

### Bonus 3: Full-Text Search Index
Add a full-text index on the `product_name` column and write a query using `MATCH() AGAINST()` to search for products containing "keyboard".

---

## Expected Results Checklist

When you're done, verify your work:

- [ ] Database `shopmart_db` exists
- [ ] Table `products` contains 6 records
- [ ] Tables `orders` and `order_audit` exist with correct structure
- [ ] `SHOW TRIGGERS;` shows 4 triggers
- [ ] `SHOW INDEXES FROM products;` shows at least 3 indexes
- [ ] Inserting 'john smith' as customer name results in 'JOHN SMITH'
- [ ] `SELECT * FROM order_audit;` shows logged actions
- [ ] Attempting to change status from 'Shipped' to 'Pending' fails with error
- [ ] Backup file `shopmart_backup.sql` exists

---

## Solution Reference

<details>
<summary>Click to reveal solutions (try on your own first!)</summary>

### Part 1 Solutions

```sql
-- Task 1.1
CREATE DATABASE shopmart_db;
USE shopmart_db;

-- Task 1.2
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100),
    category VARCHAR(50),
    price DECIMAL(10,2),
    stock_quantity INT
);

-- Task 1.3
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100),
    product_id INT,
    quantity INT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Task 1.4
CREATE TABLE order_audit (
    audit_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    action_type VARCHAR(20),
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details VARCHAR(255)
);

-- Task 1.5
INSERT INTO products (product_name, category, price, stock_quantity) VALUES
('Wireless Mouse', 'Electronics', 29.99, 100),
('Mechanical Keyboard', 'Electronics', 89.99, 50),
('Office Chair', 'Furniture', 199.99, 25),
('Standing Desk', 'Furniture', 349.99, 15),
('USB-C Hub', 'Electronics', 49.99, 75),
('Monitor Stand', 'Furniture', 79.99, 40);
```

### Part 2 Solutions

```sql
-- Task 2.1
DELIMITER $
CREATE TRIGGER before_insert_uppercase_customer
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    SET NEW.customer_name = UPPER(NEW.customer_name);
END $
DELIMITER ;

-- Task 2.2
DELIMITER $
CREATE TRIGGER after_insert_order_audit
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    INSERT INTO order_audit (order_id, action_type, details)
    VALUES (NEW.order_id, 'INSERT', CONCAT('Product: ', NEW.product_id, ', Qty: ', NEW.quantity));
END $
DELIMITER ;

-- Task 2.3
DELIMITER $
CREATE TRIGGER before_update_status_check
BEFORE UPDATE ON orders
FOR EACH ROW
BEGIN
    IF OLD.status = 'Shipped' AND NEW.status = 'Pending' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot change status from Shipped back to Pending';
    END IF;
END $
DELIMITER ;

-- Task 2.4
DELIMITER $
CREATE TRIGGER after_delete_order_audit
AFTER DELETE ON orders
FOR EACH ROW
BEGIN
    INSERT INTO order_audit (order_id, action_type, details)
    VALUES (OLD.order_id, 'DELETE', CONCAT('Deleted order for product: ', OLD.product_id));
END $
DELIMITER ;
```

### Part 3 Solutions

```sql
-- Task 3.1
CREATE INDEX idx_category ON products (category);

-- Task 3.2
CREATE INDEX idx_order_date_status ON orders (order_date, status);

-- Task 3.3
CREATE UNIQUE INDEX idx_unique_product_name ON products (product_name);

-- Task 3.4
SHOW INDEXES FROM products;
```

### Part 4 Solutions

```sql
-- Task 4.1
INSERT INTO orders (customer_name, product_id, quantity, status)
VALUES ('john smith', 1, 2, 'Pending');

SELECT * FROM orders;
-- Customer name should show as 'JOHN SMITH'

-- Task 4.2
SELECT * FROM order_audit;

-- Task 4.3
UPDATE orders SET status = 'Shipped' WHERE order_id = 1;
-- This succeeds

UPDATE orders SET status = 'Pending' WHERE order_id = 1;
-- This fails with error: 'Cannot change status from Shipped back to Pending'
```

### Part 5 Solutions

```bash
# Task 5.1 - Backup (run in terminal)
mysqldump -u root -p --databases shopmart_db > shopmart_backup.sql

# Task 5.2 - Restore (run in terminal)
mysql -u root -p < shopmart_backup.sql
```

### Bonus Solutions

```sql
-- Bonus 1: Update stock after order
DELIMITER $
CREATE TRIGGER after_insert_update_stock
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    UPDATE products
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE product_id = NEW.product_id;
END $
DELIMITER ;

-- Bonus 2: Check stock before order
DELIMITER $
CREATE TRIGGER before_insert_check_stock
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    DECLARE available_stock INT;
    SELECT stock_quantity INTO available_stock
    FROM products WHERE product_id = NEW.product_id;

    IF NEW.quantity > available_stock THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Insufficient stock available';
    END IF;
END $
DELIMITER ;

-- Bonus 3: Full-text search
ALTER TABLE products ADD FULLTEXT INDEX idx_fulltext_name (product_name);

SELECT * FROM products
WHERE MATCH(product_name) AGAINST('keyboard');
```

</details>

---

Good luck!
