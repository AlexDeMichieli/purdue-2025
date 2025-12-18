/**
 * INTERPOLATION SEARCH
 * ====================
 *
 * CONCEPT:
 * Interpolation Search is an improved variant of Binary Search that works
 * better on UNIFORMLY DISTRIBUTED sorted arrays. Instead of always checking
 * the middle element (like binary search), it estimates where the target
 * value might be based on the values at the boundaries.
 *
 * THE ANALOGY:
 * Imagine looking up a word in a dictionary:
 * - For "Apple" → you open near the beginning
 * - For "Zebra" → you open near the end
 * - For "Middle" → you open near the middle
 *
 * You don't always open the dictionary in the exact middle. You make an
 * intelligent guess based on where the word might be. That's interpolation!
 *
 * HOW IT DIFFERS FROM BINARY SEARCH:
 * Binary Search: Always checks the middle
 *   position = (left + right) / 2
 *
 * Interpolation Search: Estimates position based on value
 *   position = left + ((target - arr[left]) / (arr[right] - arr[left])) * (right - left)
 *
 * REQUIREMENTS:
 * ⚠️  1. Array must be SORTED
 * ⚠️  2. Array should be UNIFORMLY DISTRIBUTED for best performance
 *
 * TIME COMPLEXITY:
 * - Best Case: O(1) - element found at first interpolated position
 * - Average Case: O(log log n) - for uniformly distributed data ⚡
 * - Worst Case: O(n) - for non-uniform data (worse than binary search!)
 *
 * SPACE COMPLEXITY:
 * - Iterative: O(1)
 * - Recursive: O(log log n) average, O(n) worst case
 *
 * WHEN TO USE:
 * - Large sorted arrays with UNIFORMLY DISTRIBUTED values
 * - Searching in datasets with predictable patterns (IDs, timestamps, etc.)
 * - When you need better than O(log n) performance
 * - Numeric data where interpolation makes sense
 *
 * WHEN NOT TO USE:
 * - Non-uniform data (use binary search instead)
 * - Small arrays (overhead not worth it)
 * - Non-numeric data
 * - Unsorted data
 *
 * ADVANTAGES:
 * - O(log log n) for uniform data (faster than binary search!)
 * - More intuitive for human-like searching
 * - Better for large datasets with uniform distribution
 *
 * DISADVANTAGES:
 * - O(n) worst case (binary search is always O(log n))
 * - Requires uniformly distributed data for efficiency
 * - More complex calculation than binary search
 * - Can have issues with integer overflow
 */

/**
 * Interpolation Search - Iterative Implementation
 *
 * HOW IT WORKS:
 * 1. Calculate probable position using interpolation formula
 * 2. If element at position matches target, return
 * 3. If target is smaller, search left subarray
 * 4. If target is larger, search right subarray
 * 5. Repeat until found or search space exhausted
 *
 * @param {number[]} arr - Sorted array with uniform distribution
 * @param {number} target - Value to search for
 * @returns {number} - Index of target, or -1 if not found
 */
function interpolationSearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right && target >= arr[left] && target <= arr[right]) {
    // If left and right converge
    if (left === right) {
      if (arr[left] === target) return left;
      return -1;
    }

    // Calculate interpolated position
    // Formula estimates where target should be based on value distribution
    const position = left + Math.floor(
      ((target - arr[left]) / (arr[right] - arr[left])) * (right - left)
    );

    // Target found
    if (arr[position] === target) {
      return position;
    }

    // If target is larger, search right subarray
    if (arr[position] < target) {
      left = position + 1;
    }
    // If target is smaller, search left subarray
    else {
      right = position - 1;
    }
  }

  return -1; // Target not found
}


/**
 * Interpolation Search - Recursive Implementation
 *
 * @param {number[]} arr - Sorted array with uniform distribution
 * @param {number} target - Value to search for
 * @param {number} left - Left boundary
 * @param {number} right - Right boundary
 * @returns {number} - Index of target, or -1 if not found
 */
function interpolationSearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  // Base cases
  if (left > right || target < arr[left] || target > arr[right]) {
    return -1;
  }

  // If left and right converge
  if (left === right) {
    return arr[left] === target ? left : -1;
  }

  // Calculate interpolated position
  const position = left + Math.floor(
    ((target - arr[left]) / (arr[right] - arr[left])) * (right - left)
  );

  // Target found
  if (arr[position] === target) {
    return position;
  }

  // Recursively search appropriate half
  if (arr[position] < target) {
    return interpolationSearchRecursive(arr, target, position + 1, right);
  } else {
    return interpolationSearchRecursive(arr, target, left, position - 1);
  }
}


/**
 * Interpolation Search with Statistics
 *
 * Returns detailed information about the search process.
 *
 * @param {number[]} arr - Sorted array
 * @param {number} target - Value to search for
 * @returns {Object} - Search results with statistics
 */
function interpolationSearchWithStats(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let probes = 0;
  const steps = [];

  while (left <= right && target >= arr[left] && target <= arr[right]) {
    if (left === right) {
      probes++;
      steps.push({
        probe: probes,
        position: left,
        value: arr[left],
        searchSpace: 1
      });
      if (arr[left] === target) {
        return {
          found: true,
          index: left,
          probes: probes,
          steps: steps
        };
      }
      return {
        found: false,
        index: -1,
        probes: probes,
        steps: steps
      };
    }

    // Calculate interpolated position
    const position = left + Math.floor(
      ((target - arr[left]) / (arr[right] - arr[left])) * (right - left)
    );

    probes++;
    steps.push({
      probe: probes,
      left: left,
      right: right,
      position: position,
      value: arr[position],
      searchSpace: right - left + 1,
      interpolationRatio: (target - arr[left]) / (arr[right] - arr[left])
    });

    if (arr[position] === target) {
      return {
        found: true,
        index: position,
        probes: probes,
        steps: steps
      };
    }

    if (arr[position] < target) {
      left = position + 1;
    } else {
      right = position - 1;
    }
  }

  return {
    found: false,
    index: -1,
    probes: probes,
    steps: steps
  };
}


/**
 * STEP-BY-STEP EXAMPLE:
 *
 * Searching for 44 in [10, 12, 13, 16, 18, 19, 20, 21, 22, 23, 24, 33, 35, 42, 47]
 * Array indices:      [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14]
 *
 * Initial: left = 0, right = 14
 *
 * Probe 1:
 *   arr[left] = 10, arr[right] = 47
 *   target = 44
 *
 *   Interpolation formula:
 *   position = 0 + ((44 - 10) / (47 - 10)) * (14 - 0)
 *           = 0 + (34 / 37) * 14
 *           = 0 + 0.919 * 14
 *           = 0 + 12.86
 *           = 12 (rounded down)
 *
 *   arr[12] = 35
 *   35 < 44, so search right half
 *   left = 13, right = 14
 *
 * Probe 2:
 *   arr[left] = 42, arr[right] = 47
 *   target = 44
 *
 *   position = 13 + ((44 - 42) / (47 - 42)) * (14 - 13)
 *           = 13 + (2 / 5) * 1
 *           = 13 + 0.4
 *           = 13 (rounded down)
 *
 *   arr[13] = 42
 *   42 < 44, so search right half
 *   left = 14, right = 14
 *
 * Probe 3:
 *   left === right
 *   arr[14] = 47
 *   47 ≠ 44
 *   Not found, return -1
 *
 * Total probes: 3
 *
 * COMPARISON WITH BINARY SEARCH:
 * Binary search would check positions: 7, 11, 13, 14 (4 comparisons)
 * Interpolation search checked: 12, 13, 14 (3 comparisons)
 * Similar performance in this case.
 *
 * ---
 *
 * BEST CASE EXAMPLE (Uniformly distributed):
 * Searching for 50 in [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
 *
 * Probe 1:
 *   position = 0 + ((50 - 10) / (100 - 10)) * 9
 *           = 0 + (40 / 90) * 9
 *           = 4
 *   arr[4] = 50 ✓ FOUND in 1 probe!
 *
 * Binary search would need 2-3 comparisons for this.
 */


/**
 * Understanding the Interpolation Formula
 *
 * position = left + ((target - arr[left]) / (arr[right] - arr[left])) * (right - left)
 *
 * Let's break it down:
 *
 * 1. (target - arr[left]) / (arr[right] - arr[left])
 *    This calculates how far the target is between the left and right VALUES
 *    as a ratio (0 to 1)
 *
 * 2. * (right - left)
 *    Multiply the ratio by the number of INDEX positions
 *
 * 3. + left
 *    Add the left index to get the final position
 *
 * Example:
 *   Array: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
 *   Index:   0   1   2   3   4   5   6   7   8    9
 *   Target: 75
 *   left = 0, right = 9
 *
 *   Ratio: (75 - 10) / (100 - 10) = 65 / 90 = 0.722
 *   Position: 0 + 0.722 * 9 = 6.5 → 6
 *   arr[6] = 70
 *
 *   This makes sense: 75 is about 72% of the way through the value range,
 *   so we check index 6, which is about 67% through the array.
 */


// ========== TEST CASES ==========

console.log("=== INTERPOLATION SEARCH EXAMPLES ===\n");

// Test 1: Uniformly distributed array (best case scenario)
const arr1 = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
console.log("Uniformly distributed array:", arr1);
console.log("Search for 50:", interpolationSearch(arr1, 50));
console.log("Search for 80:", interpolationSearch(arr1, 80));
console.log("Search for 15:", interpolationSearch(arr1, 15));
console.log();

// Test 2: Compare with Binary Search on uniform data
console.log("=== PERFORMANCE COMPARISON (Uniform Data) ===");
const uniformArray = Array.from({ length: 1000 }, (_, i) => i * 10);
const target1 = 7890;

const interpStats = interpolationSearchWithStats(uniformArray, target1);
console.log(`Searching for ${target1} in array of ${uniformArray.length} elements`);
console.log(`Interpolation Search: ${interpStats.probes} probes`);
console.log(`Found at index: ${interpStats.index}`);
console.log();

// Binary search for comparison
function binarySearchCount(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let count = 0;

  while (left <= right) {
    count++;
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return { index: mid, count };
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return { index: -1, count };
}

const binaryStats = binarySearchCount(uniformArray, target1);
console.log(`Binary Search: ${binaryStats.count} comparisons`);
console.log(`Speedup: ${(binaryStats.count / interpStats.probes).toFixed(2)}x faster\n`);

// Test 3: Non-uniform data (worst case scenario)
console.log("=== NON-UNIFORM DATA (Worst Case) ===");
const nonUniform = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1000, 2000, 3000, 4000, 5000];
console.log("Non-uniform array:", nonUniform);
const nonUniformStats = interpolationSearchWithStats(nonUniform, 1000);
console.log("Search for 1000:");
console.log(`  Interpolation: ${nonUniformStats.probes} probes`);
const binaryNonUniform = binarySearchCount(nonUniform, 1000);
console.log(`  Binary Search: ${binaryNonUniform.count} comparisons`);
console.log("  Note: Binary search performs better on non-uniform data!\n");

// Test 4: Detailed statistics
console.log("=== DETAILED SEARCH STEPS ===");
const arr2 = [2, 6, 8, 12, 18, 20, 24, 28, 30, 34];
console.log("Array:", arr2);
const detailedStats = interpolationSearchWithStats(arr2, 24);
console.log(`Searching for 24:\n`);
detailedStats.steps.forEach(step => {
  console.log(`Probe ${step.probe}:`);
  console.log(`  Search space: [${step.left}...${step.right}] (${step.searchSpace} elements)`);
  console.log(`  Interpolation ratio: ${step.interpolationRatio?.toFixed(3)}`);
  console.log(`  Checking position ${step.position}: value = ${step.value}`);
});
console.log(`\nFound: ${detailedStats.found}, Index: ${detailedStats.index}\n`);

// Test 5: Large dataset comparison
console.log("=== LARGE DATASET PERFORMANCE ===");
const sizes = [1000, 10000, 100000, 1000000];

sizes.forEach(size => {
  const largeUniform = Array.from({ length: size }, (_, i) => i);
  const searchTarget = size - 100; // Near the end

  // Interpolation search
  const startInterp = Date.now();
  const interpResult = interpolationSearch(largeUniform, searchTarget);
  const timeInterp = Date.now() - startInterp;

  // Binary search
  const startBinary = Date.now();
  const binaryResult = binarySearchCount(largeUniform, searchTarget);
  const timeBinary = Date.now() - startBinary;

  console.log(`Array size: ${size.toLocaleString()}`);
  console.log(`  Interpolation: ${timeInterp}ms (index: ${interpResult})`);
  console.log(`  Binary: ${timeBinary}ms (comparisons: ${binaryResult.count})`);
});
console.log();

// Test 6: Real-world example - timestamps
console.log("=== REAL-WORLD EXAMPLE: Timestamps ===");
// Simulating hourly timestamps (uniformly distributed)
const baseTime = new Date('2024-01-01').getTime();
const timestamps = Array.from({ length: 24 * 30 }, (_, i) =>
  baseTime + (i * 60 * 60 * 1000) // Every hour for 30 days
);

const searchTime = baseTime + (15 * 24 * 60 * 60 * 1000) + (6 * 60 * 60 * 1000); // Day 15, 6am
console.log(`Searching for timestamp on day 15 at 6am`);
console.log(`Total timestamps: ${timestamps.length}`);

const timestampStats = interpolationSearchWithStats(timestamps, searchTime);
console.log(`Probes needed: ${timestampStats.probes}`);
console.log(`Found at index: ${timestampStats.index}`);
console.log(`Expected index: ~${15 * 24 + 6} (day 15 * 24 hours + 6 hours)`);


/**
 * KEY TAKEAWAYS FOR STUDENTS:
 *
 * 1. IMPROVEMENT ON BINARY SEARCH: Can be O(log log n) vs O(log n)
 *
 * 2. REQUIRES UNIFORM DISTRIBUTION: Only works well when data is evenly spread
 *
 * 3. INTERPOLATION FORMULA: Estimates position based on value, not just index
 *
 * 4. BEST FOR NUMERIC DATA: Works with numbers, timestamps, IDs, etc.
 *
 * 5. WORST CASE IS BAD: O(n) - worse than binary search!
 *
 * 6. THINK LIKE A HUMAN: Similar to how we search a phone book or dictionary
 *
 * 7. USE WITH CAUTION: Analyze your data distribution first
 *
 * WHEN INTERPOLATION SEARCH SHINES:
 * - Large datasets (millions of records)
 * - Uniformly distributed numeric values
 * - Sequential IDs (1, 2, 3, 4, ...)
 * - Timestamps at regular intervals
 * - Evenly spaced measurements
 *
 * WHEN TO STICK WITH BINARY SEARCH:
 * - Non-uniform data
 * - Small datasets
 * - When you need guaranteed O(log n)
 * - Unknown data distribution
 * - Non-numeric data
 *
 * INTERPOLATION vs BINARY SEARCH SUMMARY:
 *
 * Metric              | Binary Search | Interpolation Search
 * --------------------|---------------|---------------------
 * Best Case           | O(1)          | O(1)
 * Average (uniform)   | O(log n)      | O(log log n) ⚡
 * Average (random)    | O(log n)      | O(log n)
 * Worst Case          | O(log n) ✓    | O(n) ⚠️
 * Requires Sorted     | Yes           | Yes
 * Requires Uniform    | No            | Yes (for best perf)
 * Space Complexity    | O(1)          | O(1)
 * Stability           | Consistent    | Data-dependent
 *
 * REAL-WORLD USAGE:
 * - Database indexes (when data is uniformly distributed)
 * - Time-series data searches
 * - Finding records by sequential ID
 * - Searching in sorted logs with timestamps
 * - Less common than binary search due to distribution requirement
 *
 * PRACTICAL ADVICE:
 * - Start with binary search (safer, more predictable)
 * - Use interpolation search if:
 *   1. You have proven uniform distribution
 *   2. Dataset is very large
 *   3. You've profiled and found binary search is a bottleneck
 * - Consider hybrid approaches (try interpolation, fall back to binary)
 */
