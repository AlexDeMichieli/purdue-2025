# Lesson 05 Demo 01 - Creating and Implementing Triggers in MySQL

## Exercise Summary

**Objective:** Create different types of triggers in MySQL that automate data manipulation, enforce business rules, and maintain audit logs in the employees table

**Tools Required:** MySQL Workbench

**Prerequisites:** None

### What You'll Learn
- Create a database and tables for trigger demonstrations
- Create BEFORE INSERT triggers to modify data before insertion
- Create AFTER INSERT triggers for audit logging
- Create BEFORE UPDATE triggers to enforce business rules
- Create BEFORE DELETE triggers to restrict deletions
- Create AFTER DELETE triggers for audit logging

### Database Structure Created
- **Database:** `DEMO1`
- **Tables:**
  - `employees` - stores employee information (id, name, department, salary, updated_at)
  - `employee_audit` - stores audit logs of employee table actions

---

## Step 1: Create Database and Tables

### Create the Database
```sql
CREATE DATABASE DEMO1;
USE DEMO1;
```

### Create the Employees Table
```sql
CREATE TABLE employees (
   emp_id INT PRIMARY KEY,
   emp_name VARCHAR(100),
   department VARCHAR(50),
   salary DECIMAL(10,2),
   updated_at DATETIME
);
```

### Create the Employee Audit Table
```sql
CREATE TABLE employee_audit (
   emp_id INT,
   action_type VARCHAR(20),
   action_time DATETIME
);
```

---

## Step 2: BEFORE INSERT Trigger - Convert Names to Uppercase

### Create the Trigger
```sql
DELIMITER $
CREATE TRIGGER before_insert_uppercase_name
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
   SET NEW.emp_name = UPPER(NEW.emp_name);
END $
DELIMITER ;
```

**Purpose:** Automatically converts the value of `emp_name` to uppercase before a new row is inserted into the employees table.

### Test the Trigger
```sql
INSERT INTO employees VALUES (1, 'john doe', 'HR', 50000, NOW());
SELECT * FROM employees;
```

**Result:** The trigger converts "john doe" to "JOHN DOE" before insertion.

---

## Step 3: AFTER INSERT Trigger - Audit Logging

### Create the Trigger
```sql
DELIMITER $
CREATE TRIGGER after_insert_audit
AFTER INSERT ON employees
FOR EACH ROW
BEGIN
   INSERT INTO employee_audit(emp_id, action_type, action_time)
   VALUES (NEW.emp_id, 'INSERT', NOW());
END $
DELIMITER ;
```

**Purpose:** Logs every new employee insertion by recording the employee ID, action type, and timestamp in the `employee_audit` table.

### Test the Trigger
```sql
INSERT INTO employees VALUES (2, 'Jane Smith', 'Finance', 60000, NOW());
SELECT * FROM employee_audit;
```

**Result:** The audit table now contains a record of the INSERT action with the employee ID and timestamp.

---

## Step 4: BEFORE UPDATE Trigger - Validate Salary Changes

### Create the Trigger
```sql
DELIMITER $
CREATE TRIGGER before_update_salary_check
BEFORE UPDATE ON employees
FOR EACH ROW
BEGIN
   IF NEW.salary > OLD.salary * 1.5 THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Salary increase cannot exceed 50%';
   END IF;
END $
DELIMITER ;
```

**Purpose:** Ensures salary updates remain within a 50% limit of the current value. If an update exceeds this limit, the trigger raises an error.

### Test the Trigger
```sql
UPDATE employees SET salary = 100000 WHERE emp_id = 1;
```

**Result:** The update fails with Error Code 1644 and the message "Salary increase cannot exceed 50%" because increasing from 50000 to 100000 exceeds the 50% limit.

---

## Step 5: BEFORE DELETE Trigger - Restrict Deletions

### Create the Trigger
```sql
DELIMITER $
CREATE TRIGGER before_delete_restrict_management
BEFORE DELETE ON employees
FOR EACH ROW
BEGIN
   IF OLD.department = 'Management' THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Cannot delete employee from Management department';
   END IF;
END $
DELIMITER ;
```

**Purpose:** Enforces a rule that blocks the deletion of records where the employee belongs to the Management department.

### Test the Trigger
```sql
DELETE FROM employees WHERE department = 'Management';
```

**Result:** The deletion is blocked with an error message if any employee in the Management department is targeted.

---

## Step 6: AFTER DELETE Trigger - Audit Logging

### Create the Trigger
```sql
DELIMITER $
CREATE TRIGGER after_delete_audit
AFTER DELETE ON employees
FOR EACH ROW
BEGIN
   INSERT INTO employee_audit(emp_id, action_type, action_time)
   VALUES (OLD.emp_id, 'DELETE', NOW());
END $
DELIMITER ;
```

**Purpose:** Logs every employee deletion by recording the employee ID, action type, and timestamp in the `employee_audit` table.

### Test the Trigger
```sql
DELETE FROM employees WHERE emp_id = 2;
SELECT * FROM employee_audit;
```

**Result:** The audit table now contains a DELETE record for the removed employee.

---

## Key Concepts

### What is a Trigger?
A trigger is a stored program that automatically executes in response to specific events (INSERT, UPDATE, DELETE) on a table. Triggers help:
- Automate data validation and transformation
- Enforce business rules at the database level
- Maintain audit trails
- Ensure data integrity

### Trigger Timing
- **BEFORE** - Executes before the triggering statement; can modify NEW values or prevent the operation
- **AFTER** - Executes after the triggering statement; useful for logging and related updates

### Trigger Events
- **INSERT** - Fires when a new row is inserted
- **UPDATE** - Fires when an existing row is modified
- **DELETE** - Fires when a row is removed

### Special Keywords
- **NEW** - References the new row values (available in INSERT and UPDATE triggers)
- **OLD** - References the original row values (available in UPDATE and DELETE triggers)

### SIGNAL Statement
Used to raise an error and stop the operation:
```sql
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Custom error message';
```
- `SQLSTATE '45000'` is a generic user-defined error
- The operation is rolled back when SIGNAL is executed in a BEFORE trigger

### DELIMITER Statement
- Changes the statement delimiter temporarily
- Required because triggers contain semicolons inside them
- `DELIMITER $` changes delimiter to `$`
- `DELIMITER ;` resets it back to semicolon

---

## Triggers Created Summary

| Trigger Name | Timing | Event | Purpose |
|--------------|--------|-------|---------|
| `before_insert_uppercase_name` | BEFORE | INSERT | Convert employee names to uppercase |
| `after_insert_audit` | AFTER | INSERT | Log new employee insertions |
| `before_update_salary_check` | BEFORE | UPDATE | Restrict salary increases to 50% |
| `before_delete_restrict_management` | BEFORE | DELETE | Prevent deletion of Management employees |
| `after_delete_audit` | AFTER | DELETE | Log employee deletions |

---

## Additional Notes

- Triggers execute automatically; you cannot call them directly like stored procedures
- Each table can have multiple triggers, but only one trigger per combination of timing and event
- Use `SHOW TRIGGERS;` to view all triggers in the current database
- Use `DROP TRIGGER trigger_name;` to remove a trigger
- Triggers are powerful but should be used carefully as they can impact performance and make debugging more complex
