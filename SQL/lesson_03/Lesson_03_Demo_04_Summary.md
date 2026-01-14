# Lesson 03 Demo 04 - Performing TCL Commands

## Exercise Summary

**Objective:** Perform transactional operations in a database using Transaction Control Language (TCL) commands

**Tools Required:** MySQL Workbench

**Prerequisites:** Basic knowledge of SQL syntax

### What You'll Learn
- Begin and manage database transactions
- Use savepoints to create rollback checkpoints
- Roll back changes to savepoints or completely
- Commit successful transactions
- Understand ACID properties in practice

### Database Structure Created
- **Database:** `SampleBank`
- **Table:** `customers` - stores customer names and account balances

### Transaction Scenario
Simulates bank transfers between customer accounts:
1. Transfer $1000 from Alice to Bob
2. Create a savepoint
3. Attempt transfer of $500 from Alice to Charlie
4. Roll back the second transfer
5. Commit only the first transfer

---

## TCL Commands Used

### 1. START TRANSACTION
Begins a new transaction block
```sql
START TRANSACTION;
```

**Alternative syntax:**
```sql
BEGIN;
```

### 2. SAVEPOINT
Creates a named checkpoint within a transaction
```sql
SAVEPOINT after_transfer_to_bob;
```

### 3. ROLLBACK TO SAVEPOINT
Reverts changes back to a specific savepoint
```sql
ROLLBACK TO SAVEPOINT after_transfer_to_bob;
```

### 4. RELEASE SAVEPOINT
Removes a savepoint (optional cleanup)
```sql
RELEASE SAVEPOINT after_transfer_to_bob;
```

### 5. COMMIT
Permanently saves all changes made in the transaction
```sql
COMMIT;
```

### 6. ROLLBACK (Complete)
Undoes all changes in the entire transaction
```sql
ROLLBACK;
```
*Note: Not used in this demo but important to know*

---

## Complete Transaction Example

### Database Setup
```sql
CREATE DATABASE IF NOT EXISTS SampleBank;
USE SampleBank;

CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    balance DECIMAL(10,2)
);

INSERT INTO customers (name, balance) VALUES
('Alice', 5000.00),
('Bob', 3000.00),
('Charlie', 7000.00);
```

### Transaction Workflow
```sql
-- Step 1: Start transaction
START TRANSACTION;

-- Step 2: Transfer $1000 from Alice to Bob
UPDATE customers SET balance = balance - 1000 WHERE name = 'Alice';
UPDATE customers SET balance = balance + 1000 WHERE name = 'Bob';

-- Step 3: Create savepoint after first transfer
SAVEPOINT after_transfer_to_bob;

-- Step 4: Attempt transfer $500 from Alice to Charlie
UPDATE customers SET balance = balance - 500 WHERE name = 'Alice';
UPDATE customers SET balance = balance + 500 WHERE name = 'Charlie';

-- Step 5: Verify intermediate results
SELECT * FROM customers;

-- Step 6: Rollback to savepoint (undo Charlie transfer)
ROLLBACK TO SAVEPOINT after_transfer_to_bob;

-- Step 7: Release savepoint (optional cleanup)
RELEASE SAVEPOINT after_transfer_to_bob;

-- Step 8: Commit successful changes (Bob transfer remains)
COMMIT;

-- Step 9: Verify final results
SELECT * FROM customers;
```

### Final Results
- **Alice:** $4,000.00 (originally $5,000 - $1,000)
- **Bob:** $4,000.00 (originally $3,000 + $1,000)
- **Charlie:** $7,000.00 (unchanged - transfer was rolled back)

---

## Key Concepts

### What is TCL?
**Transaction Control Language (TCL)** commands manage transactions in a database, ensuring data integrity and consistency through the ACID properties.

### ACID Properties

**A - Atomicity**
- All operations in a transaction succeed or all fail
- No partial transactions ("all or nothing")
- Example: Both debit and credit must succeed in a transfer

**C - Consistency**
- Database moves from one valid state to another
- All constraints and rules are maintained
- Example: Total money in bank remains constant during transfers

**I - Isolation**
- Concurrent transactions don't interfere with each other
- Each transaction appears to execute in isolation
- Prevents dirty reads, lost updates

**D - Durability**
- Committed changes are permanent
- Survive system crashes and power failures
- Once COMMIT succeeds, data is safely stored

### Transaction States

1. **Active** - Transaction is executing
2. **Partially Committed** - After final operation, before COMMIT
3. **Committed** - Transaction completed successfully
4. **Failed** - Transaction cannot proceed
5. **Aborted** - Transaction rolled back

---

## Command Details

### START TRANSACTION
**Purpose:** Marks the beginning of a transaction block

**Characteristics:**
- Disables auto-commit mode temporarily
- All subsequent commands are part of the transaction
- Changes are not permanent until COMMIT

**When to use:**
- Financial transactions (transfers, payments)
- Multi-step operations that must complete together
- Operations requiring data consistency

### SAVEPOINT
**Purpose:** Creates a checkpoint within a transaction

**Benefits:**
- Allows partial rollback without losing all work
- Useful for complex multi-step transactions
- Can create multiple savepoints in one transaction

**Naming convention:**
```sql
SAVEPOINT savepoint_name;
```

**Multiple savepoints example:**
```sql
START TRANSACTION;
-- operation 1
SAVEPOINT step1;
-- operation 2
SAVEPOINT step2;
-- operation 3
ROLLBACK TO SAVEPOINT step2;  -- Undo only operation 3
COMMIT;
```

### ROLLBACK
**Two types:**

**Partial Rollback (to savepoint):**
```sql
ROLLBACK TO SAVEPOINT savepoint_name;
```
- Undoes changes back to the savepoint
- Transaction continues
- Savepoint remains valid

**Complete Rollback:**
```sql
ROLLBACK;
```
- Undoes all changes in the transaction
- Transaction ends
- All savepoints are released

### COMMIT
**Purpose:** Permanently saves all transaction changes

**What happens:**
- All changes become permanent
- Changes visible to other users
- Transaction ends
- All savepoints are released
- Auto-commit mode resumes

**Cannot undo:** Once committed, changes are permanent

---

## Practical Examples

### Example 1: Simple Transaction
```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

### Example 2: Transaction with Error Handling
```sql
START TRANSACTION;

UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 101;

-- Check if sufficient quantity
SELECT quantity FROM inventory WHERE product_id = 101;

-- If quantity is negative, rollback
-- ROLLBACK;

-- Otherwise commit
COMMIT;
```

### Example 3: Multi-Savepoint Transaction
```sql
START TRANSACTION;

INSERT INTO orders (customer_id, total) VALUES (1, 100);
SAVEPOINT order_created;

INSERT INTO order_items (order_id, product_id, qty) VALUES (1, 101, 2);
SAVEPOINT items_added;

UPDATE inventory SET quantity = quantity - 2 WHERE product_id = 101;

-- If inventory update fails, rollback to before inventory change
-- ROLLBACK TO SAVEPOINT items_added;

COMMIT;
```

### Example 4: Bank Transfer with Validation
```sql
START TRANSACTION;

-- Deduct from sender
UPDATE accounts SET balance = balance - 500 WHERE account_id = 1;

-- Check if balance is sufficient (not negative)
SELECT balance FROM accounts WHERE account_id = 1;

-- If balance < 0, rollback entire transaction
-- ROLLBACK;

-- Add to receiver
UPDATE accounts SET balance = balance + 500 WHERE account_id = 2;

-- Commit if everything is valid
COMMIT;
```

---

## Utility Commands

### Disable Safe Update Mode
```sql
SET SQL_SAFE_UPDATES = 0;
```

**Purpose:** Allows UPDATE/DELETE without WHERE clauses using primary keys

**When needed:**
- UPDATE statements using non-key columns in WHERE clause
- Bulk operations

**Re-enable after use:**
```sql
SET SQL_SAFE_UPDATES = 1;
```

### Check Current Transaction Status
```sql
SELECT @@autocommit;  -- Check if autocommit is enabled (1) or disabled (0)
```

### View Intermediate Results
```sql
SELECT * FROM table_name;
```
- Can be used during a transaction to verify changes
- Shows uncommitted changes within your session
- Other sessions won't see changes until COMMIT

---

## Best Practices

### 1. Always Use Transactions for Related Operations
**Good:**
```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

**Bad (without transaction):**
```sql
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
-- If this fails, first update is permanent!
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
```

### 2. Keep Transactions Short
- Minimize time between START TRANSACTION and COMMIT
- Reduces lock contention
- Improves concurrency

### 3. Use Savepoints for Complex Operations
```sql
START TRANSACTION;
-- Critical operation
SAVEPOINT critical_done;
-- Experimental operation
-- If experiment fails: ROLLBACK TO SAVEPOINT critical_done;
COMMIT;
```

### 4. Always Handle Errors
```sql
START TRANSACTION;
-- operation 1
-- operation 2
-- If any operation fails: ROLLBACK;
-- If all succeed: COMMIT;
```

### 5. Release Savepoints When Done
```sql
RELEASE SAVEPOINT savepoint_name;
```
- Frees resources
- Prevents savepoint name conflicts
- Good housekeeping

### 6. Verify Before Committing
```sql
START TRANSACTION;
UPDATE ...;
SELECT * FROM table;  -- Verify changes
-- If correct: COMMIT;
-- If wrong: ROLLBACK;
```

---

## Common Use Cases

### Financial Transactions
- Money transfers between accounts
- Payment processing
- Balance adjustments

### Inventory Management
- Order processing with stock updates
- Multi-warehouse transfers
- Reservation systems

### Data Consistency
- Updating related records across tables
- Maintaining referential integrity
- Complex business logic requiring multiple steps

### Batch Operations
- Processing multiple records
- Data migration
- Bulk updates with validation

---

## Troubleshooting

### Transaction Not Rolling Back
**Issue:** Changes appear permanent even after ROLLBACK

**Solution:** Ensure you're not in auto-commit mode
```sql
SET autocommit = 0;
START TRANSACTION;
```

### Deadlock Errors
**Issue:** Two transactions waiting for each other

**Solution:**
- Keep transactions short
- Access tables in consistent order
- Use appropriate isolation levels

### Lost Savepoint
**Issue:** "Savepoint does not exist" error

**Cause:** Savepoint released or rolled back past it

**Solution:** Recreate savepoint or adjust rollback logic

---

## Command Summary

| Command | Purpose | Example |
|---------|---------|---------|
| START TRANSACTION | Begin transaction | `START TRANSACTION;` |
| SAVEPOINT | Create checkpoint | `SAVEPOINT name;` |
| ROLLBACK TO SAVEPOINT | Undo to checkpoint | `ROLLBACK TO SAVEPOINT name;` |
| RELEASE SAVEPOINT | Remove checkpoint | `RELEASE SAVEPOINT name;` |
| COMMIT | Save changes permanently | `COMMIT;` |
| ROLLBACK | Undo all changes | `ROLLBACK;` |

---

## Important Notes

- Transactions are essential for maintaining data integrity
- Always COMMIT or ROLLBACK - never leave transactions hanging
- DDL commands (CREATE, DROP, ALTER) cause implicit COMMIT in MySQL
- Not all storage engines support transactions (InnoDB does, MyISAM doesn't)
- Nested transactions are not supported in MySQL (use savepoints instead)
- Long-running transactions can cause performance issues
