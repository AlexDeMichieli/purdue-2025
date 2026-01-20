# Lesson 05 Demo 02 - Creating and Handling Triggers in MySQL

## Exercise Summary

**Objective:** Create a trigger in MySQL that automatically inserts data into an audit log table when a new record is inserted into the employee table, and learn how to manage triggers using MySQL commands

**Tools Required:** MySQL Workbench

**Prerequisites:** None

### What You'll Learn
- Create a database and tables for trigger demonstrations
- Create an AFTER INSERT trigger for automatic audit logging
- Verify trigger execution by checking the audit log
- Drop (remove) a trigger from the database

### Database Structure Created
- **Database:** `SIMPLILEARN`
- **Tables:**
  - `employee` - stores employee information (id, name)
  - `audit_log` - stores automatic logs of employee insertions

---

## Step 1: Create Database and Tables

### Create the Database
```sql
CREATE DATABASE SIMPLILEARN;
USE SIMPLILEARN;
```

### Create the Employee Table
```sql
CREATE TABLE employee (
   emp_id INT PRIMARY KEY,
   emp_name VARCHAR(50)
);
```

### Create the Audit Log Table
```sql
CREATE TABLE audit_log (
   log_id INT AUTO_INCREMENT PRIMARY KEY,
   emp_id INT,
   action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Note:** The `audit_log` table uses:
- `AUTO_INCREMENT` for automatic log ID generation
- `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` to automatically record when each log entry is created

---

## Step 2: Create the Trigger and Insert Data

### Create the AFTER INSERT Trigger
```sql
DELIMITER $
CREATE TRIGGER after_insert_employee
AFTER INSERT ON employee
FOR EACH ROW
BEGIN
   INSERT INTO audit_log(emp_id)
   VALUES (NEW.emp_id);
END$
DELIMITER ;
```

**Purpose:** This trigger automatically logs every new employee insertion by recording the employee ID in the `audit_log` table. The `action_time` is automatically set by the table's default value.

### Test the Trigger
```sql
INSERT INTO employee VALUES (101, 'John Doe');
```

**Result:** The data is inserted into the `employee` table, and the trigger automatically creates a corresponding entry in the `audit_log` table.

---

## Step 3: Verify and Drop the Trigger

### Verify Trigger Execution
```sql
SELECT * FROM audit_log;
```

**Result:** Displays the audit log entries showing:
- `log_id` - Auto-generated log identifier
- `emp_id` - The employee ID that was inserted (101)
- `action_time` - Timestamp of when the insert occurred

### Drop the Trigger
```sql
DROP TRIGGER after_insert_employee;
```

**Result:** The trigger is removed from the database. Future inserts into the `employee` table will no longer automatically create audit log entries.

---

## Key Concepts

### Trigger Lifecycle
1. **CREATE TRIGGER** - Defines and activates the trigger
2. **Automatic Execution** - Trigger fires on specified events
3. **DROP TRIGGER** - Removes the trigger from the database

### Trigger Management Commands

| Command | Purpose |
|---------|---------|
| `CREATE TRIGGER` | Creates a new trigger |
| `SHOW TRIGGERS;` | Lists all triggers in the current database |
| `DROP TRIGGER trigger_name;` | Removes a specific trigger |

### The NEW Keyword
- `NEW.column_name` references the value being inserted
- Available in INSERT and UPDATE triggers
- Allows access to the incoming data within the trigger body

### TIMESTAMP with DEFAULT
```sql
action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```
- Automatically sets the current date/time when a row is inserted
- No need to explicitly provide a value for this column

---

## Additional Notes

- Triggers help automate database processes such as audit logging
- Once dropped, a trigger must be recreated to resume its functionality
- Audit logs are valuable for tracking data changes, debugging, and compliance
- The trigger executes within the same transaction as the INSERT statement
