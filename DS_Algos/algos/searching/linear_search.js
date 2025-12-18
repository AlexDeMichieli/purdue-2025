/**
 * LINEAR SEARCH (Sequential Search)
 * ==================================
 *
 * CONCEPT:
 * Linear Search is the simplest searching algorithm. It sequentially checks
 * each element in a list until it finds the target value or reaches the end.
 * Think of it like looking through a book page by page until you find what
 * you're looking for.
 *
 * HOW IT WORKS:
 * 1. Start at the first element
 * 2. Compare current element with target
 * 3. If match found, return the index
 * 4. If not, move to next element
 * 5. Repeat until element is found or array ends
 *
 * TIME COMPLEXITY:
 * - Best Case: O(1) - element is at the first position
 * - Average Case: O(n) - element is somewhere in the middle
 * - Worst Case: O(n) - element is at the end or not present
 *
 * SPACE COMPLEXITY:
 * - O(1) - only uses a constant amount of extra space
 *
 * WHEN TO USE:
 * - Small datasets (< 100 elements typically)
 * - Unsorted data (can't use binary search)
 * - Linked lists (binary search requires random access)
 * - When you need to search only once or a few times
 * - When simplicity is more important than speed
 *
 * WHEN NOT TO USE:
 * - Large sorted datasets (use binary search instead)
 * - When searching many times (consider sorting first, then using binary search)
 * - Performance-critical applications with large data
 *
 * ADVANTAGES:
 * - Works on unsorted data
 * - Simple to implement and understand
 * - Works on any data structure with sequential access
 * - No preprocessing required
 *
 * DISADVANTAGES:
 * - Slow for large datasets
 * - Inefficient when searching multiple times
 */

/**
 * Basic Linear Search Implementation
 *
 * Searches for a target value in an array and returns its index.
 *
 * @param {Array} arr - The array to search in
 * @param {*} target - The value to search for
 * @returns {number} - Index of target, or -1 if not found
 */
function linearSearch(arr, target) {
  // Iterate through each element in the array
  for (let i = 0; i < arr.length; i++) {
    // If current element matches target, return its index
    if (arr[i] === target) {
      return i;
    }
  }

  // If we've checked all elements and haven't found target, return -1
  return -1;
}


/**
 * Linear Search with Early Exit Information
 *
 * Returns both the index and how many comparisons were made.
 * Useful for understanding performance characteristics.
 *
 * @param {Array} arr - The array to search in
 * @param {*} target - The value to search for
 * @returns {Object} - Object with index and comparison count
 */
function linearSearchWithStats(arr, target) {
  let comparisons = 0;

  for (let i = 0; i < arr.length; i++) {
    comparisons++;
    if (arr[i] === target) {
      return {
        index: i,
        comparisons: comparisons,
        found: true
      };
    }
  }

  return {
    index: -1,
    comparisons: comparisons,
    found: false
  };
}


/**
 * Linear Search - Find All Occurrences
 *
 * Returns all indices where the target appears (handles duplicates).
 *
 * @param {Array} arr - The array to search in
 * @param {*} target - The value to search for
 * @returns {number[]} - Array of all indices where target appears
 */
function linearSearchAll(arr, target) {
  const indices = [];

  // Check every element
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      indices.push(i); // Add index to results
    }
  }

  return indices;
}


/**
 * Linear Search with Custom Comparator
 *
 * Allows searching with a custom comparison function.
 * Useful for searching objects or using complex matching logic.
 *
 * @param {Array} arr - The array to search in
 * @param {Function} predicate - Function that returns true for matching element
 * @returns {number} - Index of first match, or -1 if not found
 */
function linearSearchCustom(arr, predicate) {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i, arr)) {
      return i;
    }
  }
  return -1;
}


/**
 * Sentinel Linear Search (Optimization)
 *
 * Optimization that reduces the number of comparisons per iteration.
 * Places the target at the end of array to eliminate bounds checking.
 *
 * NOTE: This modifies the array temporarily and requires extra space.
 *
 * @param {Array} arr - The array to search in
 * @param {*} target - The value to search for
 * @returns {number} - Index of target, or -1 if not found
 */
function sentinelLinearSearch(arr, target) {
  const n = arr.length;

  // Handle empty array
  if (n === 0) return -1;

  // Save the last element
  const last = arr[n - 1];

  // Place target at the end (sentinel)
  arr[n - 1] = target;

  let i = 0;
  // Now we don't need to check bounds - we're guaranteed to find target
  while (arr[i] !== target) {
    i++;
  }

  // Restore the last element
  arr[n - 1] = last;

  // If we found it before the last position, or last element was target
  if (i < n - 1 || arr[n - 1] === target) {
    return i;
  }

  return -1;
}


/**
 * STEP-BY-STEP EXAMPLE:
 *
 * Searching for 7 in [3, 8, 1, 7, 5, 9, 2]
 *
 * Step 1: Check index 0
 *   arr[0] = 3
 *   3 === 7? No
 *   Continue...
 *
 * Step 2: Check index 1
 *   arr[1] = 8
 *   8 === 7? No
 *   Continue...
 *
 * Step 3: Check index 2
 *   arr[2] = 1
 *   1 === 7? No
 *   Continue...
 *
 * Step 4: Check index 3
 *   arr[3] = 7
 *   7 === 7? YES! ✓
 *   Return index 3
 *
 * Total comparisons: 4
 * Index returned: 3
 *
 * ---
 *
 * Searching for 10 in [3, 8, 1, 7, 5, 9, 2] (not present)
 *
 * Step 1-7: Check all indices (none match)
 * Total comparisons: 7 (checked entire array)
 * Return: -1 (not found)
 */


/**
 * PERFORMANCE ANALYSIS:
 *
 * For an array of size n:
 *
 * BEST CASE (Target at first position):
 * - Comparisons: 1
 * - Time: O(1)
 * - Example: searching for 3 in [3, 8, 1, 7, 5]
 *
 * AVERAGE CASE (Target in middle):
 * - Comparisons: n/2
 * - Time: O(n)
 * - Example: searching for 7 in [3, 8, 1, 7, 5] (4/2 = 2 comparisons on average)
 *
 * WORST CASE (Target at end or not present):
 * - Comparisons: n
 * - Time: O(n)
 * - Example: searching for 9 in [3, 8, 1, 7, 5, 9] (6 comparisons)
 *
 * COMPARISON WITH BINARY SEARCH:
 *
 * Array size | Linear (worst) | Binary (worst)
 * -----------|----------------|---------------
 *      10    |      10        |      4
 *     100    |     100        |      7
 *   1,000    |   1,000        |     10
 *  10,000    |  10,000        |     14
 * 100,000    | 100,000        |     17
 *
 * As you can see, binary search scales much better!
 * BUT: Binary search requires sorted data.
 */


// ========== TEST CASES ==========

console.log("=== LINEAR SEARCH EXAMPLES ===\n");

// Test 1: Basic search - found
const arr1 = [64, 34, 25, 12, 22, 11, 90];
console.log("Array:", arr1);
console.log("Search for 22:", linearSearch(arr1, 22));
console.log("Search for 90:", linearSearch(arr1, 90)); // Last element
console.log("Search for 64:", linearSearch(arr1, 64)); // First element
console.log();

// Test 2: Element not found
console.log("Array:", arr1);
console.log("Search for 100:", linearSearch(arr1, 100));
console.log();

// Test 3: With statistics
const arr2 = [5, 2, 8, 12, 3, 7, 1];
console.log("Array:", arr2);
console.log("Search for 12 (with stats):", linearSearchWithStats(arr2, 12));
console.log("Search for 100 (with stats):", linearSearchWithStats(arr2, 100));
console.log();

// Test 4: Find all occurrences
const arr3 = [5, 2, 8, 2, 9, 2, 1];
console.log("Array:", arr3);
console.log("Find all occurrences of 2:", linearSearchAll(arr3, 2));
console.log("Find all occurrences of 9:", linearSearchAll(arr3, 9));
console.log("Find all occurrences of 10:", linearSearchAll(arr3, 10));
console.log();

// Test 5: Search array of objects
const users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 35 }
];
console.log("Users:", users);
console.log("Find user with id=2:");
const index = linearSearchCustom(users, user => user.id === 2);
console.log("Index:", index, "User:", users[index]);
console.log();

console.log("Find user older than 30:");
const olderIndex = linearSearchCustom(users, user => user.age > 30);
console.log("Index:", olderIndex, "User:", users[olderIndex]);
console.log();

// Test 6: Search strings
const fruits = ["apple", "banana", "orange", "grape", "mango"];
console.log("Fruits:", fruits);
console.log("Search for 'orange':", linearSearch(fruits, "orange"));
console.log("Search for 'pear':", linearSearch(fruits, "pear"));
console.log();

// Test 7: Performance comparison
console.log("=== PERFORMANCE TEST ===");
const largeArray = Array.from({ length: 10000 }, (_, i) => i);

// Best case - element at beginning
console.time("Search at beginning");
linearSearch(largeArray, 0);
console.timeEnd("Search at beginning");

// Average case - element in middle
console.time("Search in middle");
linearSearch(largeArray, 5000);
console.timeEnd("Search in middle");

// Worst case - element at end
console.time("Search at end");
linearSearch(largeArray, 9999);
console.timeEnd("Search at end");

// Worst case - element not present
console.time("Search not found");
linearSearch(largeArray, 10000);
console.timeEnd("Search not found");


/**
 * KEY TAKEAWAYS FOR STUDENTS:
 *
 * 1. SIMPLICITY: Easiest searching algorithm to understand and implement
 *
 * 2. NO PREPROCESSING: Works on unsorted data, no need to sort first
 *
 * 3. VERSATILITY: Works on any data structure (arrays, linked lists, etc.)
 *
 * 4. LINEAR TIME: Performance degrades linearly with input size
 *
 * 5. SEQUENTIAL: Must check elements one by one, can't skip ahead
 *
 * 6. FLEXIBLE: Easy to modify for custom comparisons or multiple matches
 *
 * 7. BASELINE: Often used as a baseline to compare other search algorithms
 *
 * WHEN LINEAR SEARCH IS ACTUALLY BEST:
 * - Unsorted data (binary search requires sorted data)
 * - Small datasets (overhead of other algorithms not worth it)
 * - One-time searches (sorting + binary search not worth it)
 * - Linked lists (can't efficiently use binary search)
 * - When insertion order matters and you can't sort
 *
 * REAL-WORLD USAGE:
 * - JavaScript's Array.indexOf() uses linear search
 * - JavaScript's Array.find() uses linear search
 * - Python's list.index() uses linear search
 * - Searching through configuration files
 * - Finding items in unsorted logs
 * - Searching in data structures without random access
 *
 * OPTIMIZATION TIPS:
 * - Move frequently accessed items to front (self-organizing lists)
 * - Use sentinel values to reduce comparisons
 * - If searching multiple times, consider sorting first
 * - For very large datasets, use hash tables or binary search trees
 */
