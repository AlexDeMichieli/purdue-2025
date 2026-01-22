# Lesson 07 Demo 03 - Student Challenge: Managing Memory Usage in MongoDB

## Scenario
You've been hired as a database administrator for **"DataMetrics Inc."**, a company that tracks server performance data across multiple data centers. Your job is to optimize MongoDB queries, create indexes, and use aggregation pipelines to analyze memory and performance metrics.

---

## Part 1: Create Database and Insert Sample Data

### Task 1.1: Connect to MongoDB Compass
1. Open MongoDB Compass
2. Click **+ Add new connection**
3. Use the default connection string `mongodb://localhost:27017`
4. Click **Save & Connect**

### Task 1.2: Create the Database
Create a new database called `metrics_db` with a collection called `ServerPerformance`.

**Steps:**
1. Click **Create database**
2. Enter `metrics_db` as the Database Name
3. Enter `ServerPerformance` as the Collection Name
4. Click **Create Database**

### Task 1.3: Insert Performance Data
Navigate to the `ServerPerformance` collection and insert the following documents:

**How to insert:**
1. Click on the collection
2. Go to **Documents** tab
3. Click **ADD DATA** → **Insert document**
4. Paste each JSON document and click **Insert**

**Document 1:**
```json
{
    "state": "CA",
    "city": "Los Angeles",
    "datacenter": "DC-West-1",
    "population": 3970000,
    "avgMemoryUsageMB": 256,
    "queryCount": 3450,
    "cpuUsagePercent": 45,
    "timestamp": "2024-01-15"
}
```

**Document 2:**
```json
{
    "state": "CA",
    "city": "San Francisco",
    "datacenter": "DC-West-2",
    "population": 870000,
    "avgMemoryUsageMB": 512,
    "queryCount": 5200,
    "cpuUsagePercent": 72,
    "timestamp": "2024-01-15"
}
```

**Document 3:**
```json
{
    "state": "NY",
    "city": "New York",
    "datacenter": "DC-East-1",
    "population": 8300000,
    "avgMemoryUsageMB": 1024,
    "queryCount": 12500,
    "cpuUsagePercent": 85,
    "timestamp": "2024-01-15"
}
```

**Document 4:**
```json
{
    "state": "NY",
    "city": "Buffalo",
    "datacenter": "DC-East-2",
    "population": 255000,
    "avgMemoryUsageMB": 128,
    "queryCount": 890,
    "cpuUsagePercent": 25,
    "timestamp": "2024-01-15"
}
```

**Document 5:**
```json
{
    "state": "TX",
    "city": "Houston",
    "datacenter": "DC-South-1",
    "population": 2300000,
    "avgMemoryUsageMB": 384,
    "queryCount": 4100,
    "cpuUsagePercent": 55,
    "timestamp": "2024-01-15"
}
```

**Document 6:**
```json
{
    "state": "TX",
    "city": "Austin",
    "datacenter": "DC-South-2",
    "population": 980000,
    "avgMemoryUsageMB": 640,
    "queryCount": 6800,
    "cpuUsagePercent": 68,
    "timestamp": "2024-01-15"
}
```

---

## Part 2: Create Indexes to Improve Query Speed

### Task 2.1: Create an Index on the State Field
Indexes help MongoDB find documents faster without scanning the entire collection.

**Steps:**
1. Go to the **Indexes** tab in the `ServerPerformance` collection
2. Click **Create Index**
3. Enter `state` as the field name
4. Select `1 (asc)` for ascending order
5. Click **Create Index**

### Task 2.2: Create a Compound Index
Create a compound index on `state` and `queryCount` for queries that filter by state and sort by query count.

**Steps:**
1. Click **Create Index**
2. Add first field: `state` with value `1 (asc)`
3. Click **Add Another Field**
4. Add second field: `queryCount` with value `-1 (desc)`
5. Click **Create Index**

### Task 2.3: Create an Index on High-Traffic Field
Create an index on `avgMemoryUsageMB` for memory analysis queries:

**Steps:**
1. Click **Create Index**
2. Enter `avgMemoryUsageMB` as the field name
3. Select `1 (asc)`
4. Click **Create Index**

### Task 2.4: View All Indexes
After creating indexes, verify them:
1. Stay on the **Indexes** tab
2. You should see 4 indexes total:
   - `_id_` (default)
   - `state_1`
   - `state_1_queryCount_-1`
   - `avgMemoryUsageMB_1`

---

## Part 3: Run Aggregation Pipelines to Analyze Usage

### Task 3.1: Open the Aggregation Builder
1. Click on the **Aggregations** tab
2. Click **+ CREATE NEW** (or use the existing pipeline builder)

### Task 3.2: Group by State - Basic Statistics
Create an aggregation to get totals and averages per state.

**Steps:**
1. Select `$group` from the stage dropdown
2. Enter the following in the stage editor:

```javascript
{
    _id: "$state",
    totalPopulation: { $sum: "$population" },
    avgMemoryUsageMB: { $avg: "$avgMemoryUsageMB" },
    totalQueries: { $sum: "$queryCount" },
    serverCount: { $count: {} }
}
```

3. Click **Run** to see results

**Expected Output:** Summary statistics for CA, NY, and TX

### Task 3.3: Add a Sort Stage
Add a second stage to sort results by total queries (descending).

**Steps:**
1. Click **Add Stage**
2. Select `$sort`
3. Enter:

```javascript
{
    totalQueries: -1
}
```

4. Click **Run**

### Task 3.4: Filter High Memory Usage Servers
Create a new pipeline to find servers with high memory usage.

**Steps:**
1. Click **+ CREATE NEW** to start a new pipeline
2. Select `$match` as the first stage
3. Enter:

```javascript
{
    avgMemoryUsageMB: { $gte: 500 }
}
```

4. Click **Run**

**Expected Output:** Documents for San Francisco, New York, and Austin

### Task 3.5: Calculate Memory Statistics
Create a pipeline to get overall memory statistics.

**Steps:**
1. Create a new pipeline with `$group` stage:

```javascript
{
    _id: null,
    totalMemoryMB: { $sum: "$avgMemoryUsageMB" },
    avgMemoryMB: { $avg: "$avgMemoryUsageMB" },
    maxMemoryMB: { $max: "$avgMemoryUsageMB" },
    minMemoryMB: { $min: "$avgMemoryUsageMB" }
}
```

2. Click **Run**

---

## Part 4: Verify Query Efficiency Using Mongosh

### Task 4.1: Open the MongoDB Shell
1. Click on the **MONGOSH** bar at the bottom of MongoDB Compass
2. The shell will expand

### Task 4.2: Switch to Your Database
```javascript
use metrics_db
```

### Task 4.3: Run a Query with Explain
Analyze query performance for finding California servers:

```javascript
db.ServerPerformance.find({ state: "CA" }).explain("executionStats")
```

**Key metrics to look for in the output:**
- `executionTimeMillis` - How long the query took
- `totalDocsExamined` - Number of documents scanned
- `totalKeysExamined` - Number of index keys scanned
- `stage` - Should show `IXSCAN` (index scan) instead of `COLLSCAN` (collection scan)

### Task 4.4: Compare Indexed vs Non-Indexed Query
Run explain on a field without an index:

```javascript
db.ServerPerformance.find({ city: "Houston" }).explain("executionStats")
```

**Notice:** This query will show `COLLSCAN` because `city` is not indexed.

### Task 4.5: Check Index Usage
List all indexes on the collection:

```javascript
db.ServerPerformance.getIndexes()
```

### Task 4.6: View Index Statistics
Get statistics about index usage:

```javascript
db.ServerPerformance.aggregate([{ $indexStats: {} }])
```

---

## Part 5: Advanced Optimization (Challenge)

### Task 5.1: Create a Covered Query
A covered query uses only the index without accessing documents. Find states and query counts using only indexed fields:

```javascript
db.ServerPerformance.find(
    { state: "CA" },
    { state: 1, queryCount: 1, _id: 0 }
).explain("executionStats")
```

**Look for:** `totalDocsExamined: 0` in the output (query answered entirely from index)

### Task 5.2: Analyze Aggregation Performance
Run aggregation with explain:

```javascript
db.ServerPerformance.explain("executionStats").aggregate([
    { $match: { state: "CA" } },
    { $group: { _id: "$city", totalQueries: { $sum: "$queryCount" } } }
])
```

### Task 5.3: Find Slow Queries
Identify queries that might need optimization by finding high CPU usage servers:

```javascript
db.ServerPerformance.find({ cpuUsagePercent: { $gt: 70 } }).explain("executionStats")
```

**Note:** This query uses `COLLSCAN` because `cpuUsagePercent` is not indexed.

### Task 5.4: Create Index for Slow Query
Create an index to optimize the CPU usage query:

```javascript
db.ServerPerformance.createIndex({ cpuUsagePercent: 1 })
```

Then re-run the explain to see improvement:

```javascript
db.ServerPerformance.find({ cpuUsagePercent: { $gt: 70 } }).explain("executionStats")
```

---

## Bonus Challenge (Optional)

### Bonus 1: Text Index for Search
Create a text index on the city field and search:

```javascript
db.ServerPerformance.createIndex({ city: "text" })
db.ServerPerformance.find({ $text: { $search: "York" } })
```

### Bonus 2: TTL Index for Automatic Cleanup
Create a TTL (Time To Live) index that would automatically delete old documents (for demonstration only):

```javascript
// First, add a proper date field to a test document
db.ServerPerformance.updateMany(
    {},
    { $set: { createdAt: new Date() } }
)

// Then create a TTL index (expires after 30 days)
db.ServerPerformance.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 2592000 }
)
```

### Bonus 3: Complex Aggregation Pipeline
Create a pipeline that finds the top datacenter by efficiency (queries per MB of memory):

```javascript
db.ServerPerformance.aggregate([
    {
        $project: {
            datacenter: 1,
            city: 1,
            efficiency: { $divide: ["$queryCount", "$avgMemoryUsageMB"] }
        }
    },
    { $sort: { efficiency: -1 } },
    { $limit: 3 }
])
```

---

## Expected Results Checklist

When you're done, verify your work:

- [ ] Database `metrics_db` exists
- [ ] Collection `ServerPerformance` contains 6 documents
- [ ] Index `state_1` exists
- [ ] Compound index `state_1_queryCount_-1` exists
- [ ] Index `avgMemoryUsageMB_1` exists
- [ ] Aggregation by state shows 3 groups (CA, NY, TX)
- [ ] `$match` for memory >= 500 returns 3 documents
- [ ] `explain()` shows `IXSCAN` for indexed field queries
- [ ] `explain()` shows `COLLSCAN` for non-indexed field queries
- [ ] `getIndexes()` returns all created indexes

---

## Quick Reference: Performance Commands

| Command | Description |
|---------|-------------|
| `db.collection.createIndex({ field: 1 })` | Create ascending index |
| `db.collection.createIndex({ field: -1 })` | Create descending index |
| `db.collection.getIndexes()` | List all indexes |
| `db.collection.dropIndex("index_name")` | Remove an index |
| `.explain("executionStats")` | Analyze query performance |
| `$indexStats` | Get index usage statistics |

## Key Performance Indicators

| Metric | Good Value | Indicates |
|--------|------------|-----------|
| `stage` | `IXSCAN` | Using index |
| `stage` | `COLLSCAN` | Full collection scan (slow) |
| `totalDocsExamined` | Low number | Efficient query |
| `executionTimeMillis` | < 100ms | Fast query |

---

Good luck!
