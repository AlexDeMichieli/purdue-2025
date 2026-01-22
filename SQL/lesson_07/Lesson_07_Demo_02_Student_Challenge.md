# Lesson 07 Demo 02 - Student Challenge: Accessing Collections Using the MongoDB Shell

## Scenario
You've been hired to set up a MongoDB database for a small startup called **"TechHub"**. The company needs you to create collections, insert documents, and demonstrate how to access data using the MongoDB Shell (mongosh).

---

## Part 1: Connect to MongoDB

### Task 1.1: Connect to MongoDB Compass
1. Open MongoDB Compass
2. Click **+ Add new connection**
3. Use the default connection string `mongodb://localhost:27017`
4. Click **Save & Connect**

---

## Part 2: Create Database and Collections

### Task 2.1: Create a Database
Create a new database called `techhub_db` with an initial collection called `employees`.

**Steps:**
1. Click **Create database**
2. Enter `techhub_db` as the Database Name
3. Enter `employees` as the Collection Name
4. Click **Create Database**

### Task 2.2: Create Additional Collections
Create two more collections in the `techhub_db` database:
- `projects`
- `departments`

**Steps:**
1. Select the `techhub_db` database
2. Click **+ Create collection**
3. Enter the collection name
4. Click **Create Collection**
5. Repeat for the second collection

---

## Part 3: Insert Documents Using Compass

### Task 3.1: Insert Employee Documents
Add the following documents to the `employees` collection using the Compass GUI:

**How to insert:**
1. Click on the `employees` collection
2. Click **ADD DATA** → **Insert document**
3. Paste the JSON and click **Insert**

**Employee 1:**
```json
{
    "name": "John Smith",
    "age": 30,
    "email": "john.smith@techhub.com",
    "department": "Engineering",
    "salary": 75000
}
```

**Employee 2:**
```json
{
    "name": "Sarah Johnson",
    "age": 28,
    "email": "sarah.j@techhub.com",
    "department": "Marketing",
    "salary": 65000
}
```

**Employee 3:**
```json
{
    "name": "Mike Davis",
    "age": 35,
    "email": "mike.d@techhub.com",
    "department": "Engineering",
    "salary": 85000
}
```

### Task 3.2: Insert Project Documents
Add the following documents to the `projects` collection:

**Project 1:**
```json
{
    "project_name": "Website Redesign",
    "status": "In Progress",
    "team_lead": "John Smith",
    "budget": 50000
}
```

**Project 2:**
```json
{
    "project_name": "Mobile App",
    "status": "Planning",
    "team_lead": "Mike Davis",
    "budget": 100000
}
```

### Task 3.3: Insert Department Documents
Add the following documents to the `departments` collection:

**Department 1:**
```json
{
    "dept_name": "Engineering",
    "location": "Building A",
    "head": "Mike Davis"
}
```

**Department 2:**
```json
{
    "dept_name": "Marketing",
    "location": "Building B",
    "head": "Sarah Johnson"
}
```

---

## Part 4: Access Documents Using MongoDB Shell

### Task 4.1: Open the MongoDB Shell
1. Look at the bottom of the MongoDB Compass window
2. Click on the **MONGOSH** bar to open the shell
3. The shell will open in an expandable panel

### Task 4.2: Switch to Your Database
By default, mongosh connects to the `test` database. Switch to your database:

**Command:**
```javascript
use techhub_db
```

**Expected Output:**
```
switched to db techhub_db
```

### Task 4.3: List All Collections
View all collections in the current database:

**Command:**
```javascript
show collections
```

**Expected Output:**
```
departments
employees
projects
```

### Task 4.4: Find All Documents in a Collection
Retrieve all documents from the `employees` collection:

**Command:**
```javascript
db.employees.find()
```

### Task 4.5: Find All Documents (Pretty Format)
Display documents in a more readable format:

**Command:**
```javascript
db.employees.find().pretty()
```

### Task 4.6: Find Documents from Other Collections
Practice retrieving documents from the other collections:

**Commands:**
```javascript
db.projects.find()
```

```javascript
db.departments.find()
```

---

## Part 5: Basic Query Operations in Shell

### Task 5.1: Find Documents with a Filter
Find all employees in the Engineering department:

**Command:**
```javascript
db.employees.find({ "department": "Engineering" })
```

### Task 5.2: Find One Document
Retrieve only the first matching document:

**Command:**
```javascript
db.employees.findOne({ "department": "Engineering" })
```

### Task 5.3: Count Documents
Count the number of employees:

**Command:**
```javascript
db.employees.countDocuments()
```

### Task 5.4: Find with Multiple Conditions
Find employees in Engineering with salary greater than 80000:

**Command:**
```javascript
db.employees.find({ "department": "Engineering", "salary": { $gt: 80000 } })
```

### Task 5.5: Project Specific Fields
Show only name and email fields (excluding _id):

**Command:**
```javascript
db.employees.find({}, { "name": 1, "email": 1, "_id": 0 })
```

---

## Part 6: Insert Documents Using Shell

### Task 6.1: Insert a Single Document
Add a new employee using the shell:

**Command:**
```javascript
db.employees.insertOne({
    "name": "Emily Chen",
    "age": 26,
    "email": "emily.c@techhub.com",
    "department": "Engineering",
    "salary": 70000
})
```

### Task 6.2: Insert Multiple Documents
Add multiple projects at once:

**Command:**
```javascript
db.projects.insertMany([
    {
        "project_name": "Data Analytics Platform",
        "status": "In Progress",
        "team_lead": "Emily Chen",
        "budget": 75000
    },
    {
        "project_name": "Customer Portal",
        "status": "Completed",
        "team_lead": "Sarah Johnson",
        "budget": 40000
    }
])
```

### Task 6.3: Verify Your Inserts
Check that the new documents were added:

**Commands:**
```javascript
db.employees.find()
db.projects.find()
```

---

## Bonus Challenge (Optional)

### Bonus 1: Update a Document
Update Mike Davis's salary to 90000:

**Command:**
```javascript
db.employees.updateOne(
    { "name": "Mike Davis" },
    { $set: { "salary": 90000 } }
)
```

### Bonus 2: Delete a Document
Delete the "Customer Portal" project:

**Command:**
```javascript
db.projects.deleteOne({ "project_name": "Customer Portal" })
```

### Bonus 3: Use Aggregation
Find the average salary by department:

**Command:**
```javascript
db.employees.aggregate([
    { $group: { _id: "$department", avgSalary: { $avg: "$salary" } } }
])
```

---

## Expected Results Checklist

When you're done, verify your work:

- [ ] Connected successfully to MongoDB Compass
- [ ] Database `techhub_db` exists
- [ ] Collection `employees` contains 4 documents (3 original + 1 from shell)
- [ ] Collection `projects` contains 4 documents (2 original + 2 from shell)
- [ ] Collection `departments` contains 2 documents
- [ ] Successfully opened mongosh from Compass
- [ ] `use techhub_db` switches to the correct database
- [ ] `show collections` displays all 3 collections
- [ ] `db.employees.find()` returns all employee documents
- [ ] Filter query returns only Engineering employees

---

## Quick Reference: MongoDB Shell Commands

| Command | Description |
|---------|-------------|
| `use <database>` | Switch to a database |
| `show dbs` | List all databases |
| `show collections` | List collections in current database |
| `db.<collection>.find()` | Find all documents |
| `db.<collection>.find().pretty()` | Find all with formatted output |
| `db.<collection>.findOne()` | Find first matching document |
| `db.<collection>.countDocuments()` | Count documents |
| `db.<collection>.insertOne({})` | Insert one document |
| `db.<collection>.insertMany([])` | Insert multiple documents |
| `db.<collection>.updateOne()` | Update one document |
| `db.<collection>.deleteOne()` | Delete one document |

---

Good luck!
