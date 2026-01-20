# Lesson 05 Demo 04 - Performing Backup and Restore Operations in MySQL

## Exercise Summary

**Objective:** Perform backup and restore operations in MySQL using the mysqldump utility and restore the database from the backup file to ensure data safety and recovery

**Tools Required:** MySQL Workbench and Command Line Interface (CLI)

**Prerequisites:** None

### What You'll Learn
- Create a sample database with data for backup testing
- Perform database backup using the mysqldump utility
- Simulate data loss by dropping a database
- Restore a database from a backup file
- Verify restored data integrity

### Database Structure Created
- **Database:** `companyDB`
- **Tables:**
  - `employees` - stores employee information (id, name, department)

---

## Step 1: Create a Sample Database and Table with Data

### Create the Database (MySQL Workbench)
```sql
CREATE DATABASE companyDB;
USE companyDB;
```

### Create the Employees Table
```sql
CREATE TABLE employees (
   emp_id INT PRIMARY KEY,
   emp_name VARCHAR(100),
   department VARCHAR(50)
);
```

### Insert Sample Data
```sql
INSERT INTO employees VALUES
(1, 'John', 'HR'),
(2, 'Alice', 'Finance'),
(3, 'Bob', 'IT');
```

---

## Step 2: Perform Database Backup Using mysqldump

### Open Terminal
Open the Terminal Emulator from the Applications menu.

### Run the Backup Command
```bash
mysqldump -u root --databases companyDB > companyDB_backup.sql
```

**Note:** Enter the MySQL root password when prompted.

**What this command does:**
- `mysqldump` - MySQL's built-in backup utility
- `-u root` - Connect as the root user
- `-p` - Prompt for password
- `--databases companyDB` - Backup the companyDB database (includes CREATE DATABASE statement)
- `> companyDB_backup.sql` - Redirect output to a file

**Result:** Creates a file named `companyDB_backup.sql` containing all SQL statements needed to recreate the database.

---

## Step 3: Drop the Database to Simulate Data Loss

### Drop the Database (MySQL Workbench)
```sql
DROP DATABASE companyDB;
```

**Result:** The database and all its data are permanently deleted, simulating a data loss scenario.

---

## Step 4: Restore the Database from the Backup File

### Run the Restore Command (Terminal)
```bash
mysql -u root -p < companyDB_backup.sql
```

**Note:** Enter the MySQL root password when prompted.

**What this command does:**
- `mysql` - MySQL command-line client
- `-u root -p` - Connect as root with password prompt
- `< companyDB_backup.sql` - Read and execute SQL statements from the backup file

**Result:** The database is recreated with all its tables and data.

---

## Step 5: Verify the Restored Data

### Check the Restored Data (MySQL Workbench)
```sql
USE companyDB;
SELECT * FROM employees;
```

**Expected Result:**

| emp_id | emp_name | department |
|--------|----------|------------|
| 1 | John | HR |
| 2 | Alice | Finance |
| 3 | Bob | IT |

---

## Key Concepts

### What is mysqldump?
`mysqldump` is a command-line utility that creates logical backups of MySQL databases. It produces SQL statements that can recreate the database objects and data.

### Backup Types

| Type | Description | Command |
|------|-------------|---------|
| **Single Database** | Backs up one database | `mysqldump -u root -p dbname > backup.sql` |
| **Multiple Databases** | Backs up specific databases | `mysqldump -u root -p --databases db1 db2 > backup.sql` |
| **All Databases** | Backs up entire MySQL server | `mysqldump -u root -p --all-databases > backup.sql` |
| **Single Table** | Backs up one table | `mysqldump -u root -p dbname tablename > backup.sql` |

### Common mysqldump Options

| Option | Purpose |
|--------|---------|
| `-u username` | Specify MySQL username |
| `-p` | Prompt for password |
| `--databases` | Include CREATE DATABASE statements |
| `--all-databases` | Backup all databases |
| `--no-data` | Schema only (no data) |
| `--no-create-info` | Data only (no schema) |
| `--single-transaction` | Consistent backup for InnoDB tables |
| `--routines` | Include stored procedures and functions |
| `--triggers` | Include triggers (default: yes) |

### Backup vs Restore Commands

| Operation | Command |
|-----------|---------|
| **Backup** | `mysqldump -u root -p --databases dbname > backup.sql` |
| **Restore** | `mysql -u root -p < backup.sql` |

---

## Best Practices for Database Backups

### Scheduling
- Automate backups using cron jobs or scheduled tasks
- Example cron job for daily backup at 2 AM:
  ```bash
  0 2 * * * mysqldump -u root -pPassword --all-databases > /backup/mysql_$(date +\%Y\%m\%d).sql
  ```

### Storage
- Store backups in multiple locations (local + remote/cloud)
- Use compression for large databases:
  ```bash
  mysqldump -u root -p dbname | gzip > backup.sql.gz
  ```

### Testing
- Regularly test restore procedures
- Verify backup file integrity

### Retention
- Implement a backup rotation policy
- Keep daily, weekly, and monthly backups as needed

---

## Additional Notes

- The `--databases` flag includes the CREATE DATABASE statement in the backup, making restoration simpler
- For large databases, consider using `--single-transaction` to avoid locking tables
- Backup files are plain text SQL and can be edited if needed
- Always test your restore process before you actually need it
- Consider using MySQL Enterprise Backup for large production databases
