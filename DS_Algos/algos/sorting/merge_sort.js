/**
 * MERGE SORT
 * ==========
 *
 * CONCEPT:
 * Merge Sort is a "divide and conquer" algorithm that divides the input array
 * into two halves, recursively sorts them, and then merges the two sorted halves.
 * It's one of the most efficient general-purpose sorting algorithms.
 *
 * THE "DIVIDE AND CONQUER" STRATEGY:
 * 1. DIVIDE: Split the array into two roughly equal halves
 * 2. CONQUER: Recursively sort each half
 * 3. COMBINE: Merge the two sorted halves into one sorted array
 *
 * TIME COMPLEXITY:
 * - Best Case: O(n log n)
 * - Average Case: O(n log n)
 * - Worst Case: O(n log n)
 * - Consistent performance regardless of input!
 *
 * SPACE COMPLEXITY:
 * - O(n) - requires additional space for merging (not in-place)
 *
 * STABILITY:
 * - Stable: Equal elements maintain their relative order
 *
 * WHEN TO USE:
 * - Large datasets where consistent O(n log n) performance is needed
 * - When stability is required
 * - Linked lists (merge sort works great with linked lists)
 * - External sorting (sorting data that doesn't fit in memory)
 * - When worst-case O(n log n) is required (unlike Quick Sort)
 *
 * WHEN NOT TO USE:
 * - Space is limited (requires O(n) extra space)
 * - Small arrays (overhead of recursion not worth it)
 * - When in-place sorting is required
 */

/**
 * Merge Sort Implementation
 *
 * HOW IT WORKS:
 * 1. Base case: if array has 0 or 1 element, it's already sorted
 * 2. Find the middle point to divide array into two halves
 * 3. Recursively sort the left half
 * 4. Recursively sort the right half
 * 5. Merge the two sorted halves
 *
 * @param {number[]} arr - The array to sort
 * @returns {number[]} - A new sorted array
 */
function mergeSort(arr) {
  // BASE CASE: Arrays with 0 or 1 element are already sorted
  if (arr.length <= 1) {
    return arr;
  }

  // DIVIDE: Find the middle point
  const mid = Math.floor(arr.length / 2);

  // Split array into left and right halves
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  // CONQUER: Recursively sort both halves
  const sortedLeft = mergeSort(left);
  const sortedRight = mergeSort(right);

  // COMBINE: Merge the sorted halves
  return merge(sortedLeft, sortedRight);
}


/**
 * Merge Function
 *
 * This is the heart of merge sort. It takes two sorted arrays and
 * combines them into one sorted array.
 *
 * HOW IT WORKS:
 * 1. Create an empty result array
 * 2. Use two pointers, one for each input array
 * 3. Compare elements at both pointers
 * 4. Add the smaller element to result and advance that pointer
 * 5. Repeat until one array is exhausted
 * 6. Append remaining elements from the other array
 *
 * @param {number[]} left - First sorted array
 * @param {number[]} right - Second sorted array
 * @returns {number[]} - Merged sorted array
 */
function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  // Compare elements from left and right arrays
  // Add the smaller one to result
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  // One array is now empty, append remaining elements from the other
  // Only one of these while loops will execute
  while (leftIndex < left.length) {
    result.push(left[leftIndex]);
    leftIndex++;
  }

  while (rightIndex < right.length) {
    result.push(right[rightIndex]);
    rightIndex++;
  }

  return result;
}


/**
 * STEP-BY-STEP EXAMPLE:
 *
 * Sorting [38, 27, 43, 3, 9, 82, 10] using Merge Sort
 *
 * Initial array: [38, 27, 43, 3, 9, 82, 10]
 *
 * DIVIDE phase (splitting):
 *                    [38, 27, 43, 3, 9, 82, 10]
 *                   /                          \
 *          [38, 27, 43, 3]                [9, 82, 10]
 *          /              \                /          \
 *     [38, 27]          [43, 3]        [9, 82]      [10]
 *     /      \          /      \        /     \
 *   [38]    [27]      [43]    [3]     [9]   [82]
 *
 * CONQUER phase (merging back):
 *     [38]    [27]      [43]    [3]     [9]   [82]    [10]
 *       \      /          \      /        \     /       |
 *      [27, 38]          [3, 43]         [9, 82]     [10]
 *           \              /                 \         /
 *          [3, 27, 38, 43]                 [9, 10, 82]
 *                    \                      /
 *                [3, 9, 10, 27, 38, 43, 82]
 *
 * Let's trace the merge of [27, 38] and [3, 43]:
 *   Compare 27 and 3  → 3 is smaller  → result = [3]
 *   Compare 27 and 43 → 27 is smaller → result = [3, 27]
 *   Compare 38 and 43 → 38 is smaller → result = [3, 27, 38]
 *   Right array empty, append [43]    → result = [3, 27, 38, 43]
 */


/**
 * Alternative In-Place Style Merge Sort
 *
 * This version modifies the original array instead of creating new arrays.
 * It's more space-efficient but still requires O(n) temporary space for merging.
 *
 * @param {number[]} arr - The array to sort
 * @param {number} left - Starting index
 * @param {number} right - Ending index
 */
function mergeSortInPlace(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    // Find the middle point
    const mid = Math.floor((left + right) / 2);

    // Sort first and second halves
    mergeSortInPlace(arr, left, mid);
    mergeSortInPlace(arr, mid + 1, right);

    // Merge the sorted halves
    mergeInPlace(arr, left, mid, right);
  }
  return arr;
}


/**
 * In-Place Merge Helper
 *
 * @param {number[]} arr - The array being sorted
 * @param {number} left - Starting index of left subarray
 * @param {number} mid - Ending index of left subarray
 * @param {number} right - Ending index of right subarray
 */
function mergeInPlace(arr, left, mid, right) {
  // Create temporary arrays
  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);

  let i = 0; // Index for leftArr
  let j = 0; // Index for rightArr
  let k = left; // Index for main array

  // Merge the temporary arrays back
  while (i < leftArr.length && j < rightArr.length) {
    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i];
      i++;
    } else {
      arr[k] = rightArr[j];
      j++;
    }
    k++;
  }

  // Copy remaining elements
  while (i < leftArr.length) {
    arr[k] = leftArr[i];
    i++;
    k++;
  }

  while (j < rightArr.length) {
    arr[k] = rightArr[j];
    j++;
    k++;
  }
}


/**
 * WHY IS MERGE SORT O(n log n)?
 *
 * Let's break down the complexity:
 *
 * 1. DIVIDING PHASE:
 *    - We split the array in half repeatedly
 *    - This creates a binary tree of splits
 *    - Height of tree = log₂(n)
 *    - Example: array of 8 elements → 3 levels (log₂8 = 3)
 *
 * 2. MERGING PHASE:
 *    - At each level, we merge all elements once
 *    - Merging n elements takes O(n) time
 *    - We have log(n) levels
 *    - Total: O(n) × O(log n) = O(n log n)
 *
 * Visual for n=8:
 *   Level 0: [8 elements]           → n work
 *   Level 1: [4] [4]                → n work (4+4)
 *   Level 2: [2] [2] [2] [2]        → n work (2+2+2+2)
 *   Level 3: [1][1][1][1][1][1][1][1] → n work (1×8)
 *
 *   Total levels: log₂(8) = 3
 *   Work per level: n
 *   Total work: 3n = O(n log n)
 */


// ========== TEST CASES ==========

console.log("=== MERGE SORT EXAMPLES ===\n");

// Test 1: Random array
let arr1 = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", arr1);
console.log("Sorted array:", mergeSort(arr1));
console.log();

// Test 2: Already sorted
let arr2 = [1, 2, 3, 4, 5];
console.log("Already sorted:", arr2);
console.log("After merge sort:", mergeSort(arr2));
console.log();

// Test 3: Reverse sorted
let arr3 = [9, 7, 5, 3, 1];
console.log("Reverse sorted:", arr3);
console.log("After merge sort:", mergeSort(arr3));
console.log();

// Test 4: Array with duplicates
let arr4 = [5, 2, 8, 2, 9, 1, 5];
console.log("With duplicates:", arr4);
console.log("After merge sort:", mergeSort(arr4));
console.log();

// Test 5: In-place version
let arr5 = [38, 27, 43, 3, 9, 82, 10];
console.log("In-place version - Original:", arr5);
mergeSortInPlace(arr5);
console.log("In-place version - Sorted:", arr5);
console.log();

// Test 6: Large array (to show efficiency)
let arr6 = Array.from({length: 1000}, () => Math.floor(Math.random() * 1000));
console.log("Sorting 1000 random numbers...");
const startTime = Date.now();
const sorted = mergeSort(arr6);
const endTime = Date.now();
console.log(`Time taken: ${endTime - startTime}ms`);
console.log("First 10 elements:", sorted.slice(0, 10));
console.log("Last 10 elements:", sorted.slice(-10));


/**
 * KEY TAKEAWAYS FOR STUDENTS:
 *
 * 1. DIVIDE AND CONQUER: Classic example of this algorithmic paradigm
 *
 * 2. CONSISTENT PERFORMANCE: Always O(n log n), never degrades to O(n²)
 *
 * 3. STABILITY: Maintains relative order of equal elements (important for complex objects)
 *
 * 4. RECURSIVE: Elegant recursive solution (can also be implemented iteratively)
 *
 * 5. NOT IN-PLACE: Requires O(n) extra space (trade-off for guaranteed performance)
 *
 * 6. PREDICTABLE: Great when you need guaranteed performance
 *
 * 7. PARALLELIZABLE: Can easily be parallelized (both halves can be sorted simultaneously)
 *
 * COMPARISON WITH OTHER ALGORITHMS:
 * - Faster than: Bubble Sort, Selection Sort, Insertion Sort for large arrays
 * - Slower than: Quick Sort (average case), but faster in worst case
 * - More space than: Quick Sort, Heap Sort (which are in-place)
 * - More stable than: Quick Sort, Heap Sort
 *
 * REAL-WORLD USAGE:
 * - Used in Java's Arrays.sort() for objects
 * - Used in Python's sorted() and list.sort() (Timsort is based on merge sort)
 * - Database systems for external sorting
 * - Sorting linked lists (where merge sort is O(1) space!)
 */
