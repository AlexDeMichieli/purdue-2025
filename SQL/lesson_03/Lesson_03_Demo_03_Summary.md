# Lesson 03 Demo 03 - Performing DCL Commands

## Exercise Summary

**Objective:** Create a user in MySQL using Data Control Language (DCL) commands for secure access management by granting, viewing, and revoking privileges

**Tools Required:** MySQL Workbench

**Prerequisites:** Basic knowledge of SQL syntax

### What You'll Learn
- Create new database users
- Grant specific privileges to users
- View user privileges
- Revoke privileges from users
- Implement security and access control

---

## DCL Commands Used

### 1. CREATE USER
Creates a new MySQL user account
```sql
CREATE USER 'report_user_3'@'localhost' IDENTIFIED BY 'StrongP@ss123';
```

**Syntax Breakdown:**
- `report_user_3` - Username
- `@'localhost'` - Host specification (user can only connect from localhost)
- `IDENTIFIED BY 'StrongP@ss123'` - Sets the password

### 2. GRANT
Assigns specific privileges to a user
```sql
GRANT SELECT ON school_db.students TO 'report_user_3'@'localhost';
```

**Syntax Breakdown:**
- `SELECT` - Privilege being granted (read-only access)
- `school_db.students` - Database and table being granted access to
- `TO 'report_user_3'@'localhost'` - User receiving the privilege

### 3. SHOW GRANTS
Displays all privileges assigned to a user
```sql
SHOW GRANTS FOR 'report_user_3'@'localhost';
```

### 4. REVOKE
Removes specific privileges from a user
```sql
REVOKE SELECT ON school_db.students FROM 'report_user_3'@'localhost';
```

---

## Key Concepts

### What is DCL?
**Data Control Language (DCL)** commands manage access rights and permissions for database users. They control who can access and manipulate data.

### Types of Privileges

**Common Database Privileges:**
- **SELECT** - Read data from tables
- **INSERT** - Add new records to tables
- **UPDATE** - Modify existing records
- **DELETE** - Remove records from tables
- **CREATE** - Create new databases or tables
- **DROP** - Delete databases or tables
- **ALTER** - Modify table structures
- **ALL PRIVILEGES** - Grants all available privileges

**Privilege Levels:**
- **Global** - Applies to all databases on the server
- **Database** - Applies to all tables in a specific database
- **Table** - Applies to a specific table
- **Column** - Applies to specific columns in a table

### User Account Components

**Format:** `'username'@'host'`

**Host Specifications:**
- `'localhost'` - User can only connect from the local machine
- `'%'` - User can connect from any host
- `'192.168.1.%'` - User can connect from specific IP range
- `'example.com'` - User can connect from specific domain

---

## Security Best Practices

### Password Requirements
- Use strong passwords with mixed case, numbers, and special characters
- Example: `StrongP@ss123`
- Avoid common words or predictable patterns

### Principle of Least Privilege
- Grant only the minimum privileges necessary
- Use specific table/database access rather than global privileges
- Regularly review and audit user privileges

### Read-Only Users
For reporting or analytics users:
```sql
-- Grant only SELECT privilege
GRANT SELECT ON database_name.* TO 'readonly_user'@'localhost';
```

### Multiple Privileges
Grant multiple privileges in one statement:
```sql
GRANT SELECT, INSERT, UPDATE ON database_name.table_name
TO 'user'@'localhost';
```

---

## Common DCL Patterns

### Create a Full-Access User
```sql
CREATE USER 'admin_user'@'localhost' IDENTIFIED BY 'SecurePass123!';
GRANT ALL PRIVILEGES ON database_name.* TO 'admin_user'@'localhost';
FLUSH PRIVILEGES;
```

### Create a Read-Only User
```sql
CREATE USER 'reader'@'localhost' IDENTIFIED BY 'ReadPass123!';
GRANT SELECT ON database_name.* TO 'reader'@'localhost';
```

### Create a Data Entry User
```sql
CREATE USER 'data_entry'@'localhost' IDENTIFIED BY 'EntryPass123!';
GRANT SELECT, INSERT, UPDATE ON database_name.* TO 'data_entry'@'localhost';
```

### Remove All Privileges
```sql
REVOKE ALL PRIVILEGES ON database_name.* FROM 'user'@'localhost';
```

### Delete a User
```sql
DROP USER 'user'@'localhost';
```

---

## Additional DCL Commands

### FLUSH PRIVILEGES
Reloads privilege tables (use after manual changes to grant tables)
```sql
FLUSH PRIVILEGES;
```

### SHOW USERS
View all database users:
```sql
SELECT User, Host FROM mysql.user;
```

### Change User Password
```sql
ALTER USER 'username'@'localhost' IDENTIFIED BY 'NewPassword123!';
```

---

## Example Workflow

**Scenario:** Create a reporting user with limited access

1. **Create the user:**
   ```sql
   CREATE USER 'report_viewer'@'localhost' IDENTIFIED BY 'Report@2026';
   ```

2. **Grant read-only access:**
   ```sql
   GRANT SELECT ON school_db.students TO 'report_viewer'@'localhost';
   GRANT SELECT ON school_db.courses TO 'report_viewer'@'localhost';
   ```

3. **Verify privileges:**
   ```sql
   SHOW GRANTS FOR 'report_viewer'@'localhost';
   ```

4. **If needed, revoke access:**
   ```sql
   REVOKE SELECT ON school_db.students FROM 'report_viewer'@'localhost';
   ```

5. **Remove user completely:**
   ```sql
   DROP USER 'report_viewer'@'localhost';
   ```

---

## Command Summary

| Command | Purpose | Example |
|---------|---------|---------|
| CREATE USER | Create new user account | `CREATE USER 'name'@'host' IDENTIFIED BY 'pass';` |
| GRANT | Give privileges to user | `GRANT SELECT ON db.table TO 'user'@'host';` |
| SHOW GRANTS | Display user privileges | `SHOW GRANTS FOR 'user'@'host';` |
| REVOKE | Remove privileges | `REVOKE SELECT ON db.table FROM 'user'@'host';` |
| DROP USER | Delete user account | `DROP USER 'user'@'host';` |
| FLUSH PRIVILEGES | Reload privilege tables | `FLUSH PRIVILEGES;` |

---

## Important Notes

- DCL commands require administrative privileges (typically root or admin user)
- Always use strong passwords for new users
- Document user privileges for security auditing
- Regularly review and remove unnecessary user accounts
- Test user privileges after granting to ensure proper access
- Revoke privileges before dropping users with sensitive data access
