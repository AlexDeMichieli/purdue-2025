//https://leetcode.com/problems/remove-duplicates-from-sorted-list/?envType=problem-list-v2&envId=linked-list
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val);
 *     this.next = (next===undefined ? null : next);
 * }
 */

/**
 * Removes duplicates from a sorted linked list.
 * @param {ListNode} head - The head of the sorted linked list.
 * @return {ListNode} - The head of the modified linked list with duplicates removed.
 */
var deleteDuplicates = function(head) {
    // Edge case: If the list is empty or has only one node, return it as is.
    if (!head || !head.next) {
        return head;
    }

    // Initialize the current pointer to the head of the list.
    let current = head;

    // Traverse the linked list.
    while (current && current.next) {
        // If the current node's value is the same as the next node's value,
        // skip the next node by pointing current.next to current.next.next.
        if (current.val === current.next.val) {
            current.next = current.next.next;
        } else {
            // Otherwise, move the current pointer to the next node.
            current = current.next;
        }
    }

    // Return the modified linked list.
    return head;
};