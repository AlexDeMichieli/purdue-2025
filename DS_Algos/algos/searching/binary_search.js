/**
 * BINARY SEARCH
 * =============
 *
 * CONCEPT:
 * Binary Search is an efficient algorithm for finding an item in a SORTED array.
 * It works by repeatedly dividing the search interval in half. If the target
 * value is less than the middle element, search the left half; otherwise,
 * search the right half. This process continues until the value is found or
 * the interval is empty.
 *
 * THE "DIVIDE AND CONQUER" APPROACH:
 * 1. Find the middle element
 * 2. If middle element is target, we're done!
 * 3. If target is smaller, search left half
 * 4. If target is larger, search right half
 * 5. Repeat until found or search space is empty
 *
 * CRITICAL REQUIREMENT:
 * ⚠️  THE ARRAY MUST BE SORTED! ⚠️
 * Binary search will NOT work correctly on unsorted data.
 *
 * TIME COMPLEXITY:
 * - Best Case: O(1) - element is at the middle
 * - Average Case: O(log n) - need to divide multiple times
 * - Worst Case: O(log n) - element at end or not present
 *
 * SPACE COMPLEXITY:
 * - Iterative: O(1) - constant extra space
 * - Recursive: O(log n) - due to call stack
 *
 * WHEN TO USE:
 * - Large sorted datasets
 * - Multiple searches on same data (sort once, search many times)
 * - When O(log n) performance is needed
 * - Static or infrequently updated data
 *
 * WHEN NOT TO USE:
 * - Unsorted data (must sort first, which is O(n log n))
 * - Data that changes frequently (re-sorting is expensive)
 * - Small datasets (linear search is simpler and fast enough)
 * - Linked lists (need random access for efficiency)
 *
 * WHY SO FAST?
 * Each comparison eliminates HALF of the remaining elements!
 * - 1,000,000 elements → max 20 comparisons
 * - 1,000,000,000 elements → max 30 comparisons
 */

/**
 * Binary Search - Iterative Implementation
 *
 * This is the most common and space-efficient implementation.
 *
 * HOW IT WORKS:
 * 1. Set left pointer to 0, right pointer to array.length - 1
 * 2. While left <= right:
 *    a. Calculate middle index
 *    b. If middle element is target, return index
 *    c. If middle element > target, search left half (right = mid - 1)
 *    d. If middle element < target, search right half (left = mid + 1)
 * 3. If not found, return -1
 *
 * @param {number[]} arr - Sorted array to search in
 * @param {number} target - Value to search for
 * @returns {number} - Index of target, or -1 if not found
 */
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    // Calculate middle index
    // Using Math.floor((left + right) / 2) can cause overflow in some languages
    // Better approach: left + Math.floor((right - left) / 2)
    const mid = Math.floor((left + right) / 2);

    // Check if target is at mid
    if (arr[mid] === target) {
      return mid; // Found it!
    }

    // If target is smaller, ignore right half
    if (arr[mid] > target) {
      right = mid - 1;
    }
    // If target is larger, ignore left half
    else {
      left = mid + 1;
    }
  }

  // Target not found
  return -1;
}


/**
 * Binary Search - Recursive Implementation
 *
 * More elegant but uses O(log n) space for call stack.
 *
 * @param {number[]} arr - Sorted array to search in
 * @param {number} target - Value to search for
 * @param {number} left - Left boundary (default 0)
 * @param {number} right - Right boundary (default arr.length - 1)
 * @returns {number} - Index of target, or -1 if not found
 */
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  // Base case: search space is empty
  if (left > right) {
    return -1;
  }

  // Calculate middle index
  const mid = Math.floor((left + right) / 2);

  // Found the target
  if (arr[mid] === target) {
    return mid;
  }

  // Search left half
  if (arr[mid] > target) {
    return binarySearchRecursive(arr, target, left, mid - 1);
  }

  // Search right half
  return binarySearchRecursive(arr, target, mid + 1, right);
}


/**
 * Binary Search with Statistics
 *
 * Returns additional information about the search process.
 * Useful for understanding and teaching the algorithm.
 *
 * @param {number[]} arr - Sorted array to search in
 * @param {number} target - Value to search for
 * @returns {Object} - Object with index, comparisons, and iterations
 */
function binarySearchWithStats(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let comparisons = 0;
  let iterations = 0;
  const steps = [];

  while (left <= right) {
    iterations++;
    const mid = Math.floor((left + right) / 2);
    comparisons++;

    steps.push({
      iteration: iterations,
      left: left,
      right: right,
      mid: mid,
      midValue: arr[mid],
      searchSpace: right - left + 1
    });

    if (arr[mid] === target) {
      return {
        found: true,
        index: mid,
        comparisons: comparisons,
        iterations: iterations,
        steps: steps
      };
    }

    comparisons++;
    if (arr[mid] > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return {
    found: false,
    index: -1,
    comparisons: comparisons,
    iterations: iterations,
    steps: steps
  };
}


/**
 * Find First Occurrence (leftmost)
 *
 * When array has duplicates, finds the first (leftmost) occurrence.
 *
 * @param {number[]} arr - Sorted array (may contain duplicates)
 * @param {number} target - Value to search for
 * @returns {number} - Index of first occurrence, or -1 if not found
 */
function binarySearchFirst(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      result = mid; // Store result
      right = mid - 1; // Continue searching in left half
    } else if (arr[mid] > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return result;
}


/**
 * Find Last Occurrence (rightmost)
 *
 * When array has duplicates, finds the last (rightmost) occurrence.
 *
 * @param {number[]} arr - Sorted array (may contain duplicates)
 * @param {number} target - Value to search for
 * @returns {number} - Index of last occurrence, or -1 if not found
 */
function binarySearchLast(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      result = mid; // Store result
      left = mid + 1; // Continue searching in right half
    } else if (arr[mid] > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return result;
}


/**
 * Count Occurrences
 *
 * Uses binary search to efficiently count occurrences in sorted array.
 *
 * @param {number[]} arr - Sorted array (may contain duplicates)
 * @param {number} target - Value to count
 * @returns {number} - Number of occurrences
 */
function countOccurrences(arr, target) {
  const first = binarySearchFirst(arr, target);

  // If not found, return 0
  if (first === -1) return 0;

  const last = binarySearchLast(arr, target);

  // Count is the difference plus 1
  return last - first + 1;
}


/**
 * Find Insertion Position
 *
 * Finds the index where target should be inserted to maintain sorted order.
 * This is useful for implementing insertion into sorted arrays.
 *
 * @param {number[]} arr - Sorted array
 * @param {number} target - Value to find insertion position for
 * @returns {number} - Index where target should be inserted
 */
function findInsertionPosition(arr, target) {
  let left = 0;
  let right = arr.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left;
}


/**
 * STEP-BY-STEP EXAMPLE:
 *
 * Searching for 23 in [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29]
 * Array indices:      [0, 1, 2, 3, 4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14]
 *
 * Initial: left = 0, right = 14
 *
 * Iteration 1:
 *   mid = (0 + 14) / 2 = 7
 *   arr[7] = 15
 *   15 < 23, so search right half
 *   left = 8, right = 14
 *   Search space: [17, 19, 21, 23, 25, 27, 29] (7 elements)
 *
 * Iteration 2:
 *   mid = (8 + 14) / 2 = 11
 *   arr[11] = 23
 *   23 === 23 ✓ FOUND!
 *   Return 11
 *
 * Total comparisons: 2
 * Compare this to linear search which would need 12 comparisons!
 *
 * ---
 *
 * Searching for 30 (not present) in same array:
 *
 * Iteration 1: mid=7, arr[7]=15, 15<30, left=8
 * Iteration 2: mid=11, arr[11]=23, 23<30, left=12
 * Iteration 3: mid=13, arr[13]=27, 27<30, left=14
 * Iteration 4: mid=14, arr[14]=29, 29<30, left=15
 * Now left > right, exit loop
 * Return -1 (not found)
 *
 * Total comparisons: 4
 */


/**
 * WHY O(log n)?
 *
 * Each comparison cuts the search space in HALF:
 *
 * Array size: 16 elements
 * Iteration 1: 16 elements → check 1
 * Iteration 2:  8 elements → check 1
 * Iteration 3:  4 elements → check 1
 * Iteration 4:  2 elements → check 1
 * Iteration 5:  1 element  → check 1
 * Total: 5 comparisons (log₂16 = 4, plus 1)
 *
 * For n elements, max comparisons = log₂(n) + 1
 *
 * Comparison table:
 * Array size  | Linear (worst) | Binary (worst)
 * ------------|----------------|----------------
 *          10 |             10 |              4
 *         100 |            100 |              7
 *       1,000 |          1,000 |             10
 *      10,000 |         10,000 |             14
 *     100,000 |        100,000 |             17
 *   1,000,000 |      1,000,000 |             20
 *
 * The difference is MASSIVE for large datasets!
 */


// ========== TEST CASES ==========

console.log("=== BINARY SEARCH EXAMPLES ===\n");

// Test 1: Basic search
const arr1 = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
console.log("Array:", arr1);
console.log("Search for 7:", binarySearch(arr1, 7));
console.log("Search for 1 (first):", binarySearch(arr1, 1));
console.log("Search for 19 (last):", binarySearch(arr1, 19));
console.log("Search for 10 (not present):", binarySearch(arr1, 10));
console.log();

// Test 2: Recursive version
console.log("Recursive search for 13:", binarySearchRecursive(arr1, 13));
console.log("Recursive search for 20:", binarySearchRecursive(arr1, 20));
console.log();

// Test 3: Search with statistics
const arr2 = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
console.log("Array:", arr2);
console.log("Search for 20 with stats:");
const stats = binarySearchWithStats(arr2, 20);
console.log(stats);
console.log("\nSearch steps:");
stats.steps.forEach(step => {
  console.log(`  Iteration ${step.iteration}: arr[${step.mid}]=${step.midValue}, ` +
              `search space=${step.searchSpace} elements`);
});
console.log();

// Test 4: Array with duplicates
const arr3 = [1, 2, 2, 2, 3, 4, 4, 5, 5, 5, 5, 6];
console.log("Array with duplicates:", arr3);
console.log("First occurrence of 5:", binarySearchFirst(arr3, 5));
console.log("Last occurrence of 5:", binarySearchLast(arr3, 5));
console.log("Count of 5:", countOccurrences(arr3, 5));
console.log("Count of 2:", countOccurrences(arr3, 2));
console.log("Count of 7:", countOccurrences(arr3, 7));
console.log();

// Test 5: Find insertion position
const arr4 = [1, 3, 5, 7, 9];
console.log("Array:", arr4);
console.log("Insert position for 6:", findInsertionPosition(arr4, 6));
console.log("Insert position for 0:", findInsertionPosition(arr4, 0));
console.log("Insert position for 10:", findInsertionPosition(arr4, 10));
console.log("Insert position for 5:", findInsertionPosition(arr4, 5));
console.log();

// Test 6: Large array performance
console.log("=== PERFORMANCE COMPARISON ===");
const largeArray = Array.from({ length: 1000000 }, (_, i) => i * 2);

// Linear search (for comparison)
console.time("Linear search (worst case)");
let found = -1;
for (let i = 0; i < largeArray.length; i++) {
  if (largeArray[i] === 1999998) {
    found = i;
    break;
  }
}
console.timeEnd("Linear search (worst case)");
console.log("Found at index:", found);

// Binary search
console.time("Binary search (same element)");
const binaryResult = binarySearch(largeArray, 1999998);
console.timeEnd("Binary search (same element)");
console.log("Found at index:", binaryResult);
console.log();

// Test 7: Demonstrate the power of binary search
console.log("=== SEARCH COMPARISONS FOR DIFFERENT ARRAY SIZES ===");
[10, 100, 1000, 10000, 100000, 1000000].forEach(size => {
  const testArr = Array.from({ length: size }, (_, i) => i);
  const target = size - 1; // Worst case

  const result = binarySearchWithStats(testArr, target);
  console.log(`Array size: ${size.toLocaleString()}`);
  console.log(`  Binary search comparisons: ${result.comparisons}`);
  console.log(`  Linear search would need: ${size.toLocaleString()}`);
  console.log(`  Speedup: ${Math.round(size / result.comparisons)}x faster\n`);
});


/**
 * KEY TAKEAWAYS FOR STUDENTS:
 *
 * 1. REQUIRES SORTED DATA: Binary search ONLY works on sorted arrays
 *
 * 2. LOGARITHMIC TIME: O(log n) - incredibly fast even for huge datasets
 *
 * 3. DIVIDE AND CONQUER: Eliminates half the search space each iteration
 *
 * 4. TWO IMPLEMENTATIONS: Iterative (O(1) space) vs Recursive (O(log n) space)
 *
 * 5. ITERATIVE IS PREFERRED: More space-efficient, no stack overflow risk
 *
 * 6. VARIATIONS EXIST: Find first/last occurrence, count occurrences, etc.
 *
 * 7. TRADE-OFF: Need sorted data (sorting is O(n log n))
 *
 * COMMON PITFALLS:
 * - Using on unsorted data (will give wrong results!)
 * - Integer overflow when calculating mid (use left + (right-left)/2)
 * - Off-by-one errors with left/right boundaries
 * - Infinite loops if boundary updates are wrong
 *
 * WHEN TO SORT + BINARY SEARCH vs JUST LINEAR SEARCH:
 * - If searching once: Linear search (O(n)) vs Sort + Binary (O(n log n))
 * - If searching k times: Linear (O(k*n)) vs Sort + Binary (O(n log n + k log n))
 * - Break-even point: roughly when k > log(n)
 *
 * REAL-WORLD USAGE:
 * - Searching in databases (with indexes)
 * - Finding elements in sorted lists
 * - Dictionary lookups (word lists are sorted)
 * - Finding version numbers, dates, etc.
 * - JavaScript's Array methods don't use binary search (not guaranteed sorted)
 * - Many standard library "bisect" or "bsearch" functions use binary search
 *
 * VARIATIONS AND EXTENSIONS:
 * - Exponential search (for unbounded/infinite arrays)
 * - Interpolation search (better for uniformly distributed data)
 * - Binary search trees (data structure based on binary search)
 * - Lower/upper bound searches
 * - Ternary search (divide into 3 parts instead of 2)
 */
