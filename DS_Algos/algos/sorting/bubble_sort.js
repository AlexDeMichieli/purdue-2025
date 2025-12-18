/**
 * BUBBLE SORT
 * ===========
 *
 * CONCEPT:
 * Bubble Sort is one of the simplest sorting algorithms. It works by repeatedly
 * stepping through the list, comparing adjacent elements and swapping them if
 * they are in the wrong order. This process is repeated until no more swaps
 * are needed, indicating the list is sorted.
 *
 * WHY "BUBBLE"?
 * The algorithm gets its name because larger elements "bubble up" to the end
 * of the array with each pass, like bubbles rising to the surface of water.
 *
 * TIME COMPLEXITY:
 * - Best Case: O(n) - when array is already sorted (with optimization)
 * - Average Case: O(n²) - typical random array
 * - Worst Case: O(n²) - when array is reverse sorted
 *
 * SPACE COMPLEXITY:
 * - O(1) - only uses a constant amount of extra space (in-place sorting)
 *
 * STABILITY:
 * - Stable: Equal elements maintain their relative order
 *
 * WHEN TO USE:
 * - Small datasets (< 10-20 elements)
 * - Nearly sorted data
 * - Teaching purposes (easy to understand)
 * - When simplicity is more important than efficiency
 *
 * WHEN NOT TO USE:
 * - Large datasets (very inefficient)
 * - Performance-critical applications
 */

/**
 * Basic Bubble Sort Implementation
 *
 * HOW IT WORKS:
 * 1. Start at the beginning of the array
 * 2. Compare each pair of adjacent elements
 * 3. If they're in the wrong order, swap them
 * 4. After each complete pass, the largest unsorted element is in its final position
 * 5. Repeat for n-1 passes (where n is array length)
 *
 * @param {number[]} arr - The array to sort
 * @returns {number[]} - The sorted array
 */
function bubbleSort(arr) {
  const n = arr.length;

  // Outer loop: controls the number of passes
  // We need n-1 passes to guarantee the array is sorted
  for (let i = 0; i < n - 1; i++) {

    // Inner loop: performs comparisons and swaps
    // With each pass, the last i elements are already in place
    // so we only need to check up to n - i - 1
    for (let j = 0; j < n - i - 1; j++) {

      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap if they're in the wrong order
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }

  return arr;
}


/**
 * Optimized Bubble Sort Implementation
 *
 * OPTIMIZATION:
 * Add a flag to detect if any swaps were made during a pass.
 * If no swaps occur, the array is already sorted and we can exit early.
 * This improves best-case performance from O(n²) to O(n).
 *
 * @param {number[]} arr - The array to sort
 * @returns {number[]} - The sorted array
 */
function bubbleSortOptimized(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    // Flag to track if any swaps were made in this pass
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // ES6 destructuring swap
        swapped = true; // Mark that we made a swap
      }
    }

    // If no swaps were made, array is sorted
    if (!swapped) {
      break;
    }
  }

  return arr;
}


/**
 * STEP-BY-STEP EXAMPLE:
 *
 * Sorting [5, 2, 8, 1, 9] using Bubble Sort
 *
 * Initial: [5, 2, 8, 1, 9]
 *
 * Pass 1:
 *   [5, 2, 8, 1, 9] → [2, 5, 8, 1, 9] (swap 5 and 2)
 *   [2, 5, 8, 1, 9] → [2, 5, 8, 1, 9] (no swap)
 *   [2, 5, 8, 1, 9] → [2, 5, 1, 8, 9] (swap 8 and 1)
 *   [2, 5, 1, 8, 9] → [2, 5, 1, 8, 9] (no swap)
 *   Result: [2, 5, 1, 8, 9] (9 is in final position)
 *
 * Pass 2:
 *   [2, 5, 1, 8, 9] → [2, 5, 1, 8, 9] (no swap)
 *   [2, 5, 1, 8, 9] → [2, 1, 5, 8, 9] (swap 5 and 1)
 *   [2, 1, 5, 8, 9] → [2, 1, 5, 8, 9] (no swap)
 *   Result: [2, 1, 5, 8, 9] (8 is in final position)
 *
 * Pass 3:
 *   [2, 1, 5, 8, 9] → [1, 2, 5, 8, 9] (swap 2 and 1)
 *   [1, 2, 5, 8, 9] → [1, 2, 5, 8, 9] (no swap)
 *   Result: [1, 2, 5, 8, 9] (5 is in final position)
 *
 * Pass 4:
 *   [1, 2, 5, 8, 9] → [1, 2, 5, 8, 9] (no swap)
 *   Result: [1, 2, 5, 8, 9] (2 is in final position, and so is 1)
 *
 * Final: [1, 2, 5, 8, 9] ✓
 */


// ========== TEST CASES ==========

console.log("=== BUBBLE SORT EXAMPLES ===\n");

// Test 1: Random array
let arr1 = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", arr1);
console.log("Sorted array:", bubbleSort([...arr1])); // Use spread to avoid mutating original
console.log();

// Test 2: Already sorted (best case for optimized version)
let arr2 = [1, 2, 3, 4, 5];
console.log("Already sorted:", arr2);
console.log("After bubble sort:", bubbleSortOptimized([...arr2]));
console.log();

// Test 3: Reverse sorted (worst case)
let arr3 = [9, 7, 5, 3, 1];
console.log("Reverse sorted:", arr3);
console.log("After bubble sort:", bubbleSort([...arr3]));
console.log();

// Test 4: Array with duplicates
let arr4 = [5, 2, 8, 2, 9, 1, 5];
console.log("With duplicates:", arr4);
console.log("After bubble sort:", bubbleSort([...arr4]));
console.log();

// Test 5: Single element
let arr5 = [42];
console.log("Single element:", arr5);
console.log("After bubble sort:", bubbleSort([...arr5]));


/**
 * KEY TAKEAWAYS FOR STUDENTS:
 *
 * 1. SIMPLICITY: Bubble sort is very easy to understand and implement
 *
 * 2. INEFFICIENCY: With O(n²) time complexity, it's one of the slowest sorting algorithms
 *
 * 3. COMPARISON-BASED: It only uses comparisons, no special data structures needed
 *
 * 4. IN-PLACE: Doesn't require extra memory (besides a few variables)
 *
 * 5. STABLE: Maintains relative order of equal elements
 *
 * 6. ADAPTIVE: The optimized version can detect when array is sorted
 *
 * 7. PRACTICAL USE: Almost never used in production code, but excellent for learning
 *
 * COMPARISON WITH OTHER ALGORITHMS:
 * - Slower than: Quick Sort, Merge Sort, Heap Sort, Insertion Sort (for larger arrays)
 * - Faster than: Nothing really, in most practical cases
 * - Similar to: Selection Sort (also O(n²))
 */
