# Lesson 07 Demo 04 - Student Challenge: Implementing Relationships in MongoDB

## Scenario
You've been hired to build a database for **"EduTrack University"**, an online learning platform. The university needs to track students, courses, instructors, and enrollments. You'll implement relationships between these collections using both referencing and embedding strategies.

---

## Part 1: Create Database and Collections

### Task 1.1: Connect to MongoDB Compass
1. Open MongoDB Compass
2. Click **+ Add new connection**
3. Use the default connection string `mongodb://localhost:27017`
4. Click **Save & Connect**

### Task 1.2: Create the Database
Create a new database called `university_db` with an initial collection called `students`.

**Steps:**
1. Click **Create database**
2. Enter `university_db` as the Database Name
3. Enter `students` as the Collection Name
4. Click **Create Database**

### Task 1.3: Create Additional Collections
Create the following collections in the `university_db` database:
- `courses`
- `instructors`
- `enrollments`

**Steps:**
1. Select the `university_db` database
2. Click **+ Create collection**
3. Enter the collection name
4. Click **Create Collection**
5. Repeat for each collection

---

## Part 2: Insert Related Data

### Task 2.1: Insert Student Documents
Add the following documents to the `students` collection:

**Student 1:**
```json
{
    "_id": 101,
    "name": "Alice Johnson",
    "email": "alice.johnson@edutrack.com",
    "major": "Computer Science",
    "gpa": 3.8
}
```

**Student 2:**
```json
{
    "_id": 102,
    "name": "Bob Smith",
    "email": "bob.smith@edutrack.com",
    "major": "Data Science",
    "gpa": 3.5
}
```

**Student 3:**
```json
{
    "_id": 103,
    "name": "Carol Davis",
    "email": "carol.davis@edutrack.com",
    "major": "Computer Science",
    "gpa": 3.9
}
```

**Student 4:**
```json
{
    "_id": 104,
    "name": "David Wilson",
    "email": "david.wilson@edutrack.com",
    "major": "Information Systems",
    "gpa": 3.2
}
```

### Task 2.2: Insert Instructor Documents
Add the following documents to the `instructors` collection:

**Instructor 1:**
```json
{
    "_id": 201,
    "name": "Dr. Sarah Miller",
    "email": "s.miller@edutrack.com",
    "department": "Computer Science",
    "yearsExperience": 15
}
```

**Instructor 2:**
```json
{
    "_id": 202,
    "name": "Prof. James Brown",
    "email": "j.brown@edutrack.com",
    "department": "Data Science",
    "yearsExperience": 10
}
```

**Instructor 3:**
```json
{
    "_id": 203,
    "name": "Dr. Emily Chen",
    "email": "e.chen@edutrack.com",
    "department": "Computer Science",
    "yearsExperience": 8
}
```

### Task 2.3: Insert Course Documents (with References)
Add the following documents to the `courses` collection. Note how `instructorId` references the `_id` from the `instructors` collection:

**Course 1:**
```json
{
    "_id": 301,
    "courseName": "Database Systems",
    "courseCode": "CS301",
    "credits": 4,
    "instructorId": 201,
    "maxCapacity": 30
}
```

**Course 2:**
```json
{
    "_id": 302,
    "courseName": "Web Development",
    "courseCode": "CS302",
    "credits": 3,
    "instructorId": 203,
    "maxCapacity": 25
}
```

**Course 3:**
```json
{
    "_id": 303,
    "courseName": "Machine Learning",
    "courseCode": "DS301",
    "credits": 4,
    "instructorId": 202,
    "maxCapacity": 20
}
```

**Course 4:**
```json
{
    "_id": 304,
    "courseName": "Data Structures",
    "courseCode": "CS201",
    "credits": 3,
    "instructorId": 201,
    "maxCapacity": 35
}
```

### Task 2.4: Insert Enrollment Documents (Junction Collection)
Add the following documents to the `enrollments` collection. This collection links students to courses (many-to-many relationship):

**Enrollment 1:**
```json
{
    "studentId": 101,
    "courseId": 301,
    "enrollmentDate": "2024-01-15",
    "grade": "A",
    "status": "Completed"
}
```

**Enrollment 2:**
```json
{
    "studentId": 101,
    "courseId": 302,
    "enrollmentDate": "2024-01-15",
    "grade": "B+",
    "status": "Completed"
}
```

**Enrollment 3:**
```json
{
    "studentId": 102,
    "courseId": 303,
    "enrollmentDate": "2024-01-20",
    "grade": null,
    "status": "In Progress"
}
```

**Enrollment 4:**
```json
{
    "studentId": 102,
    "courseId": 301,
    "enrollmentDate": "2024-01-20",
    "grade": "A-",
    "status": "Completed"
}
```

**Enrollment 5:**
```json
{
    "studentId": 103,
    "courseId": 302,
    "enrollmentDate": "2024-02-01",
    "grade": null,
    "status": "In Progress"
}
```

**Enrollment 6:**
```json
{
    "studentId": 103,
    "courseId": 303,
    "enrollmentDate": "2024-02-01",
    "grade": null,
    "status": "In Progress"
}
```

**Enrollment 7:**
```json
{
    "studentId": 104,
    "courseId": 304,
    "enrollmentDate": "2024-02-10",
    "grade": "B",
    "status": "Completed"
}
```

---

## Part 3: Use $lookup to Link Collections

### Task 3.1: Link Courses with Instructors
Create an aggregation pipeline to show each course with its instructor details.

**Steps:**
1. Go to the `courses` collection
2. Click the **Aggregations** tab
3. Click **+ CREATE NEW**
4. Select `$lookup` as the stage
5. Enter the following:

```javascript
{
    from: "instructors",
    localField: "instructorId",
    foreignField: "_id",
    as: "instructorInfo"
}
```

6. Click **Run**

**Expected Output:** Each course document now includes an `instructorInfo` array with the instructor's details.

### Task 3.2: Add $unwind to Flatten Results
The `$lookup` returns an array. Add `$unwind` to convert it to a single object.

**Steps:**
1. Click **Add Stage**
2. Select `$unwind`
3. Enter:

```javascript
{
    path: "$instructorInfo"
}
```

4. Click **Run**

### Task 3.3: Project Clean Output
Add a `$project` stage to show only the fields you want.

**Steps:**
1. Click **Add Stage**
2. Select `$project`
3. Enter:

```javascript
{
    courseName: 1,
    courseCode: 1,
    credits: 1,
    instructor: "$instructorInfo.name",
    department: "$instructorInfo.department"
}
```

4. Click **Run**

### Task 3.4: Link Enrollments with Students and Courses
Create a more complex pipeline that joins three collections.

**Steps:**
1. Go to the `enrollments` collection
2. Create a new aggregation pipeline
3. Add the following stages:

**Stage 1 - $lookup for students:**
```javascript
{
    from: "students",
    localField: "studentId",
    foreignField: "_id",
    as: "studentInfo"
}
```

**Stage 2 - $lookup for courses:**
```javascript
{
    from: "courses",
    localField: "courseId",
    foreignField: "_id",
    as: "courseInfo"
}
```

**Stage 3 - $unwind student:**
```javascript
{
    path: "$studentInfo"
}
```

**Stage 4 - $unwind course:**
```javascript
{
    path: "$courseInfo"
}
```

**Stage 5 - $project clean output:**
```javascript
{
    _id: 0,
    studentName: "$studentInfo.name",
    courseName: "$courseInfo.courseName",
    enrollmentDate: 1,
    grade: 1,
    status: 1
}
```

5. Click **Run**

---

## Part 4: Query Relationships Using Mongosh

### Task 4.1: Open the MongoDB Shell
Click on the **MONGOSH** bar at the bottom of MongoDB Compass.

### Task 4.2: Switch to Your Database
```javascript
use university_db
```

### Task 4.3: Find Students in a Specific Course
Use `$lookup` in the shell to find all students enrolled in "Database Systems":

```javascript
db.courses.aggregate([
    { $match: { courseName: "Database Systems" } },
    { $lookup: {
        from: "enrollments",
        localField: "_id",
        foreignField: "courseId",
        as: "enrollments"
    }},
    { $unwind: "$enrollments" },
    { $lookup: {
        from: "students",
        localField: "enrollments.studentId",
        foreignField: "_id",
        as: "student"
    }},
    { $unwind: "$student" },
    { $project: {
        courseName: 1,
        studentName: "$student.name",
        grade: "$enrollments.grade",
        status: "$enrollments.status"
    }}
])
```

### Task 4.4: Find All Courses for a Student
Find all courses that Alice Johnson is enrolled in:

```javascript
db.students.aggregate([
    { $match: { name: "Alice Johnson" } },
    { $lookup: {
        from: "enrollments",
        localField: "_id",
        foreignField: "studentId",
        as: "enrollments"
    }},
    { $unwind: "$enrollments" },
    { $lookup: {
        from: "courses",
        localField: "enrollments.courseId",
        foreignField: "_id",
        as: "course"
    }},
    { $unwind: "$course" },
    { $project: {
        studentName: "$name",
        courseName: "$course.courseName",
        grade: "$enrollments.grade"
    }}
])
```

### Task 4.5: Count Enrollments Per Course
```javascript
db.enrollments.aggregate([
    { $group: {
        _id: "$courseId",
        enrollmentCount: { $count: {} }
    }},
    { $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course"
    }},
    { $unwind: "$course" },
    { $project: {
        courseName: "$course.courseName",
        enrollmentCount: 1,
        _id: 0
    }},
    { $sort: { enrollmentCount: -1 } }
])
```

---

## Part 5: Embedding vs Referencing (Comparison)

### Task 5.1: Create an Embedded Document Example
Create a new collection called `students_embedded` that stores courses directly within student documents:

```javascript
db.students_embedded.insertOne({
    "_id": 105,
    "name": "Emma Thompson",
    "email": "emma.t@edutrack.com",
    "major": "Computer Science",
    "enrolledCourses": [
        {
            "courseName": "Database Systems",
            "courseCode": "CS301",
            "grade": "A",
            "instructor": "Dr. Sarah Miller"
        },
        {
            "courseName": "Web Development",
            "courseCode": "CS302",
            "grade": "A-",
            "instructor": "Dr. Emily Chen"
        }
    ]
})
```

### Task 5.2: Query Embedded Documents
Find students enrolled in Web Development:

```javascript
db.students_embedded.find({
    "enrolledCourses.courseName": "Web Development"
}).pretty()
```

### Task 5.3: Compare Approaches

| Aspect | Referencing | Embedding |
|--------|-------------|-----------|
| **Data Duplication** | None | Possible |
| **Query Complexity** | Requires `$lookup` | Simple queries |
| **Update Complexity** | Update in one place | Update in multiple places |
| **Document Size** | Smaller documents | Larger documents |
| **Best For** | Many-to-many, frequently updated data | One-to-few, rarely updated data |

---

## Bonus Challenge (Optional)

### Bonus 1: Find Instructors with Their Courses and Student Count
```javascript
db.instructors.aggregate([
    { $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "instructorId",
        as: "courses"
    }},
    { $unwind: "$courses" },
    { $lookup: {
        from: "enrollments",
        localField: "courses._id",
        foreignField: "courseId",
        as: "enrollments"
    }},
    { $group: {
        _id: { instructorId: "$_id", instructorName: "$name" },
        totalCourses: { $addToSet: "$courses.courseName" },
        totalStudents: { $sum: { $size: "$enrollments" } }
    }},
    { $project: {
        instructor: "$_id.instructorName",
        courses: "$totalCourses",
        studentCount: "$totalStudents",
        _id: 0
    }}
])
```

### Bonus 2: Find Students with GPA Above Average in Each Major
```javascript
db.students.aggregate([
    { $group: {
        _id: "$major",
        avgGPA: { $avg: "$gpa" },
        students: { $push: { name: "$name", gpa: "$gpa" } }
    }},
    { $unwind: "$students" },
    { $match: {
        $expr: { $gt: ["$students.gpa", "$avgGPA"] }
    }},
    { $project: {
        major: "$_id",
        studentName: "$students.name",
        studentGPA: "$students.gpa",
        majorAvgGPA: { $round: ["$avgGPA", 2] },
        _id: 0
    }}
])
```

### Bonus 3: Create a View for Easy Access
Create a view that automatically joins courses with instructors:

```javascript
db.createView(
    "coursesWithInstructors",
    "courses",
    [
        { $lookup: {
            from: "instructors",
            localField: "instructorId",
            foreignField: "_id",
            as: "instructor"
        }},
        { $unwind: "$instructor" },
        { $project: {
            courseName: 1,
            courseCode: 1,
            credits: 1,
            instructorName: "$instructor.name",
            department: "$instructor.department"
        }}
    ]
)

// Query the view
db.coursesWithInstructors.find()
```

---

## Expected Results Checklist

When you're done, verify your work:

- [ ] Database `university_db` exists
- [ ] Collection `students` contains 4 documents
- [ ] Collection `instructors` contains 3 documents
- [ ] Collection `courses` contains 4 documents
- [ ] Collection `enrollments` contains 7 documents
- [ ] `$lookup` from courses to instructors shows instructor details
- [ ] Multi-collection join (enrollments → students → courses) works
- [ ] Can find all courses for a specific student
- [ ] Can find all students in a specific course
- [ ] Embedded document example works with simple queries

---

## Quick Reference: $lookup Syntax

```javascript
{
    $lookup: {
        from: "collection_to_join",      // The collection to join with
        localField: "field_in_current",   // Field from current collection
        foreignField: "field_in_other",   // Field from the other collection
        as: "output_array_name"           // Name for the joined data
    }
}
```

## Relationship Types in MongoDB

| Relationship | Strategy | Example |
|--------------|----------|---------|
| One-to-One | Embed or Reference | User → Profile |
| One-to-Few | Embed | Blog Post → Comments (few) |
| One-to-Many | Reference | Author → Books |
| Many-to-Many | Junction Collection | Students ↔ Courses |

---

Good luck!
