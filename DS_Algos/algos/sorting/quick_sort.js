/**
 * QUICK SORT
 * ==========
 *
 * CONCEPT:
 * Quick Sort is a highly efficient "divide and conquer" sorting algorithm.
 * It works by selecting a 'pivot' element and partitioning the array around
 * the pivot, such that elements smaller than the pivot come before it and
 * elements greater come after it. This process is then recursively applied
 * to the sub-arrays.
 *
 * THE "DIVIDE AND CONQUER" STRATEGY:
 * 1. PICK: Choose a pivot element from the array
 * 2. PARTITION: Rearrange array so elements < pivot are on left, > pivot on right
 * 3. CONQUER: Recursively apply above steps to left and right sub-arrays
 *
 * TIME COMPLEXITY:
 * - Best Case: O(n log n) - when pivot divides array evenly
 * - Average Case: O(n log n) - with random pivots
 * - Worst Case: O(n²) - when pivot is always smallest/largest (rare with good pivot selection)
 *
 * SPACE COMPLEXITY:
 * - O(log n) - for recursive call stack (in-place sorting)
 * - O(n) - worst case call stack depth
 *
 * STABILITY:
 * - Unstable: Equal elements may not maintain their relative order
 *
 * WHEN TO USE:
 * - General purpose sorting (one of the fastest in practice)
 * - Large datasets
 * - When average O(n log n) is acceptable
 * - When space is limited (in-place sorting)
 * - Most standard library implementations (with optimizations)
 *
 * WHEN NOT TO USE:
 * - When worst-case O(n log n) is required (use Merge Sort)
 * - When stability is required
 * - Already sorted or nearly sorted data (without randomization)
 * - Small arrays (overhead not worth it, use Insertion Sort)
 */

/**
 * Quick Sort Implementation (Lomuto Partition Scheme)
 *
 * This version uses the last element as the pivot.
 *
 * HOW IT WORKS:
 * 1. If array has 0 or 1 element, return (base case)
 * 2. Choose pivot (last element in this implementation)
 * 3. Partition array around pivot
 * 4. Recursively sort left partition
 * 5. Recursively sort right partition
 *
 * @param {number[]} arr - The array to sort
 * @param {number} low - Starting index (default 0)
 * @param {number} high - Ending index (default arr.length - 1)
 * @returns {number[]} - The sorted array
 */
function quickSort(arr, low = 0, high = arr.length - 1) {
  // BASE CASE: If partition has 1 or fewer elements, it's sorted
  if (low < high) {
    // Partition the array and get the pivot index
    const pivotIndex = partition(arr, low, high);

    // Recursively sort elements before and after partition
    quickSort(arr, low, pivotIndex - 1);  // Left side
    quickSort(arr, pivotIndex + 1, high); // Right side
  }

  return arr;
}


/**
 * Partition Function (Lomuto Partition Scheme)
 *
 * This is the key function in Quick Sort. It:
 * 1. Takes the last element as pivot
 * 2. Places pivot in its correct position
 * 3. Places all smaller elements to left of pivot
 * 4. Places all greater elements to right of pivot
 *
 * HOW IT WORKS:
 * - Use a pointer 'i' to track the position where next small element should go
 * - Scan through array with pointer 'j'
 * - When we find element smaller than pivot, swap it with element at 'i'
 * - Finally, place pivot in its correct position
 *
 * @param {number[]} arr - The array being sorted
 * @param {number} low - Starting index
 * @param {number} high - Ending index (pivot is here)
 * @returns {number} - Final position of the pivot
 */
function partition(arr, low, high) {
  // Choose the rightmost element as pivot
  const pivot = arr[high];

  // Index of smaller element
  // This tracks where the next element smaller than pivot should go
  let i = low - 1;

  // Traverse through array from low to high-1
  for (let j = low; j < high; j++) {
    // If current element is smaller than or equal to pivot
    if (arr[j] <= pivot) {
      i++; // Increment index of smaller element
      // Swap arr[i] and arr[j]
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // Swap arr[i+1] and arr[high] (or pivot)
  // This places the pivot in its correct position
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

  // Return the position of the pivot
  return i + 1;
}


/**
 * STEP-BY-STEP EXAMPLE:
 *
 * Sorting [10, 7, 8, 9, 1, 5] using Quick Sort
 *
 * Initial call: quickSort([10, 7, 8, 9, 1, 5], 0, 5)
 *
 * FIRST PARTITION (pivot = 5):
 *   [10, 7, 8, 9, 1, 5]  pivot=5, i=-1
 *
 *   j=0: arr[0]=10 > 5, no swap, i=-1
 *   j=1: arr[1]=7 > 5, no swap, i=-1
 *   j=2: arr[2]=8 > 5, no swap, i=-1
 *   j=3: arr[3]=9 > 5, no swap, i=-1
 *   j=4: arr[4]=1 ≤ 5, i=0, swap arr[0] and arr[4]
 *        [1, 7, 8, 9, 10, 5]
 *
 *   Place pivot: swap arr[1] and arr[5]
 *   [1, 5, 8, 9, 10, 7]
 *
 *   Pivot 5 is now at index 1
 *   Left partition: [1] (already sorted)
 *   Right partition: [8, 9, 10, 7]
 *
 * SECOND PARTITION (pivot = 7):
 *   [8, 9, 10, 7]  pivot=7, i=1 (index 2 in original)
 *
 *   j=2: arr[2]=8 > 7, no swap
 *   j=3: arr[3]=9 > 7, no swap
 *   j=4: arr[4]=10 > 7, no swap
 *
 *   Place pivot: swap arr[2] and arr[5]
 *   [1, 5, 7, 9, 10, 8]
 *
 *   Pivot 7 is now at index 2
 *   Left partition: [] (empty)
 *   Right partition: [9, 10, 8]
 *
 * THIRD PARTITION (pivot = 8):
 *   [9, 10, 8]  pivot=8, i=2 (index 3 in original)
 *
 *   j=3: arr[3]=9 > 8, no swap
 *   j=4: arr[4]=10 > 8, no swap
 *
 *   Place pivot: swap arr[3] and arr[5]
 *   [1, 5, 7, 8, 10, 9]
 *
 *   Pivot 8 is now at index 3
 *   Left partition: [] (empty)
 *   Right partition: [10, 9]
 *
 * FOURTH PARTITION (pivot = 9):
 *   [10, 9]  pivot=9, i=3 (index 4 in original)
 *
 *   j=4: arr[4]=10 > 9, no swap
 *
 *   Place pivot: swap arr[4] and arr[5]
 *   [1, 5, 7, 8, 9, 10]
 *
 * Final sorted array: [1, 5, 7, 8, 9, 10] ✓
 */


/**
 * Quick Sort with Hoare Partition Scheme
 *
 * An alternative partitioning method that's more efficient (fewer swaps).
 * Uses two pointers that move toward each other.
 *
 * @param {number[]} arr - The array to sort
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 * @returns {number[]} - The sorted array
 */
function quickSortHoare(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partitionHoare(arr, low, high);
    quickSortHoare(arr, low, pivotIndex);
    quickSortHoare(arr, pivotIndex + 1, high);
  }
  return arr;
}


/**
 * Hoare Partition Scheme
 *
 * Uses middle element as pivot and two pointers moving toward each other.
 *
 * @param {number[]} arr - The array being sorted
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 * @returns {number} - Partition point
 */
function partitionHoare(arr, low, high) {
  const pivot = arr[Math.floor((low + high) / 2)];
  let i = low - 1;
  let j = high + 1;

  while (true) {
    // Move i right while arr[i] < pivot
    do {
      i++;
    } while (arr[i] < pivot);

    // Move j left while arr[j] > pivot
    do {
      j--;
    } while (arr[j] > pivot);

    // If pointers crossed, return partition point
    if (i >= j) {
      return j;
    }

    // Swap elements at i and j
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}


/**
 * Quick Sort with Random Pivot
 *
 * Choosing a random pivot helps avoid worst-case O(n²) performance
 * when dealing with sorted or nearly-sorted data.
 *
 * @param {number[]} arr - The array to sort
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 * @returns {number[]} - The sorted array
 */
function quickSortRandom(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partitionRandom(arr, low, high);
    quickSortRandom(arr, low, pivotIndex - 1);
    quickSortRandom(arr, pivotIndex + 1, high);
  }
  return arr;
}


/**
 * Partition with Random Pivot Selection
 */
function partitionRandom(arr, low, high) {
  // Choose random pivot
  const randomIndex = Math.floor(Math.random() * (high - low + 1)) + low;

  // Swap random element with last element
  [arr[randomIndex], arr[high]] = [arr[high], arr[randomIndex]];

  // Use standard partition
  return partition(arr, low, high);
}


/**
 * WHY IS QUICK SORT FAST?
 *
 * 1. IN-PLACE: Doesn't need extra arrays like Merge Sort
 * 2. CACHE-FRIENDLY: Good locality of reference
 * 3. FEWER COMPARISONS: On average, does fewer comparisons than Merge Sort
 * 4. SIMPLE OPERATIONS: Just comparisons and swaps, no merging
 *
 * WHY O(n log n) ON AVERAGE?
 *
 * Best/Average case:
 * - Each partition splits array roughly in half
 * - Creates a tree of depth log(n)
 * - Each level does O(n) work
 * - Total: O(n log n)
 *
 * Worst case O(n²):
 * - When pivot is always smallest/largest element
 * - Creates unbalanced tree of depth n
 * - Level 1: n work, Level 2: n-1 work, ..., Level n: 1 work
 * - Total: n + (n-1) + (n-2) + ... + 1 = n(n+1)/2 = O(n²)
 *
 * Example worst case: sorting [1,2,3,4,5] with last element as pivot
 * - Pivot 5: partitions into [1,2,3,4] and []
 * - Pivot 4: partitions into [1,2,3] and []
 * - Pivot 3: partitions into [1,2] and []
 * - And so on... (creates chain, not tree)
 */


// ========== TEST CASES ==========

console.log("=== QUICK SORT EXAMPLES ===\n");

// Test 1: Random array
let arr1 = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", arr1);
console.log("Sorted array (Lomuto):", quickSort([...arr1]));
console.log();

// Test 2: Already sorted (potentially worst case for Lomuto)
let arr2 = [1, 2, 3, 4, 5];
console.log("Already sorted:", arr2);
console.log("Sorted (Lomuto):", quickSort([...arr2]));
console.log("Sorted (Random pivot):", quickSortRandom([...arr2]));
console.log();

// Test 3: Reverse sorted
let arr3 = [9, 7, 5, 3, 1];
console.log("Reverse sorted:", arr3);
console.log("Sorted (Hoare):", quickSortHoare([...arr3]));
console.log();

// Test 4: Array with duplicates
let arr4 = [5, 2, 8, 2, 9, 1, 5];
console.log("With duplicates:", arr4);
console.log("Sorted array:", quickSort([...arr4]));
console.log();

// Test 5: Large array performance comparison
let arr5 = Array.from({length: 10000}, () => Math.floor(Math.random() * 10000));
console.log("Sorting 10,000 random numbers...");

const start1 = Date.now();
quickSort([...arr5]);
const time1 = Date.now() - start1;
console.log(`Lomuto partition: ${time1}ms`);

const start2 = Date.now();
quickSortRandom([...arr5]);
const time2 = Date.now() - start2;
console.log(`Random pivot: ${time2}ms`);

const start3 = Date.now();
quickSortHoare([...arr5]);
const time3 = Date.now() - start3;
console.log(`Hoare partition: ${time3}ms`);
console.log();

// Test 6: Demonstrating worst case (sorted array with Lomuto)
let arr6 = Array.from({length: 100}, (_, i) => i);
console.log("Worst case scenario (sorted array with Lomuto):");
console.log("Array size: 100 (sorted)");
const worstStart = Date.now();
quickSort([...arr6]);
const worstTime = Date.now() - worstStart;
console.log(`Time: ${worstTime}ms`);

console.log("\nSame array with random pivot:");
const bestStart = Date.now();
quickSortRandom([...arr6]);
const bestTime = Date.now() - bestStart;
console.log(`Time: ${bestTime}ms`);


/**
 * KEY TAKEAWAYS FOR STUDENTS:
 *
 * 1. FASTEST IN PRACTICE: Despite O(n²) worst case, Quick Sort is often fastest
 *    due to low constant factors and cache-friendly behavior
 *
 * 2. PIVOT SELECTION MATTERS: Random pivot selection helps avoid worst case
 *
 * 3. IN-PLACE: More memory efficient than Merge Sort
 *
 * 4. UNSTABLE: Doesn't preserve relative order of equal elements
 *
 * 5. DIVIDE AND CONQUER: Like Merge Sort, but partitions before recursing
 *
 * 6. PARTITIONING IS KEY: Understanding partition function is crucial
 *
 * 7. TAIL RECURSION: Can be optimized to reduce stack space
 *
 * COMPARISON WITH OTHER ALGORITHMS:
 * - Faster than: Merge Sort (in practice, due to better cache performance)
 * - Slower than: Merge Sort (worst case)
 * - More space efficient than: Merge Sort
 * - Less stable than: Merge Sort
 * - More complex than: Bubble Sort, Selection Sort
 *
 * PIVOT SELECTION STRATEGIES:
 * 1. Last element (Lomuto) - simple but can be slow on sorted data
 * 2. First element - same issues as last element
 * 3. Middle element - better for sorted data
 * 4. Random element - good average case, prevents worst case
 * 5. Median-of-three - choose median of first, middle, last (very common)
 *
 * REAL-WORLD USAGE:
 * - C's qsort() function
 * - Used in many language standard libraries (with optimizations)
 * - Often combined with Insertion Sort for small subarrays
 * - Introsort (used in C++ STL) switches to Heap Sort if recursion too deep
 *
 * OPTIMIZATIONS IN PRACTICE:
 * 1. Use Insertion Sort for small subarrays (< 10-20 elements)
 * 2. Use median-of-three for pivot selection
 * 3. Three-way partitioning for arrays with many duplicates
 * 4. Tail recursion optimization
 * 5. Iterative implementation to save stack space
 */
