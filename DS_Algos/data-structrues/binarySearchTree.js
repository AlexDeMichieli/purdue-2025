// Binary Search Tree (BST) Implementation
// Time complexity: O(log n) average for search, insert, delete
// Space complexity: O(n)
// Property: Left child < Parent < Right child

// Node represents each element in the tree
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;  // Left child (smaller values)
        this.right = null; // Right child (larger values)
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null; // Top of the tree
    }

    // Insert a new value into the tree
    insert(value) {
        const newNode = new Node(value);

        // If tree is empty, new node becomes root
        if (this.root === null) {
            this.root = newNode;
            return this;
        }

        // Start at root and find correct position
        let current = this.root;
        while (true) {
            // Ignore duplicate values
            if (value === current.value) return this;

            // Go left if value is smaller
            if (value < current.value) {
                if (current.left === null) {
                    current.left = newNode;
                    return this;
                }
                current = current.left;
            }
            // Go right if value is larger
            else {
                if (current.right === null) {
                    current.right = newNode;
                    return this;
                }
                current = current.right;
            }
        }
    }

    // Search for a value in the tree
    // Returns the node if found, null otherwise
    find(value) {
        if (this.root === null) return null;

        let current = this.root;
        while (current) {
            // Found the value
            if (value === current.value) return current;

            // Go left if value is smaller
            if (value < current.value) {
                current = current.left;
            }
            // Go right if value is larger
            else {
                current = current.right;
            }
        }

        // Value not found
        return null;
    }

    // Check if value exists in tree
    contains(value) {
        return this.find(value) !== null;
    }

    // Breadth-First Search (BFS)
    // Visits nodes level by level (top to bottom, left to right)
    breadthFirstSearch() {
        if (!this.root) return [];

        const queue = [this.root];
        const visited = [];

        while (queue.length > 0) {
            // Remove first node from queue
            const current = queue.shift();
            visited.push(current.value);

            // Add left child to queue
            if (current.left) queue.push(current.left);

            // Add right child to queue
            if (current.right) queue.push(current.right);
        }

        return visited;
    }

    // Depth-First Search - Pre-order (Root, Left, Right)
    // Visit root first, then left subtree, then right subtree
    depthFirstPreOrder() {
        const visited = [];

        function traverse(node) {
            if (!node) return;

            visited.push(node.value);  // Visit root
            traverse(node.left);        // Visit left
            traverse(node.right);       // Visit right
        }

        traverse(this.root);
        return visited;
    }

    // Depth-First Search - In-order (Left, Root, Right)
    // Returns values in sorted order for BST
    depthFirstInOrder() {
        const visited = [];

        function traverse(node) {
            if (!node) return;

            traverse(node.left);        // Visit left
            visited.push(node.value);  // Visit root
            traverse(node.right);       // Visit right
        }

        traverse(this.root);
        return visited;
    }

    // Depth-First Search - Post-order (Left, Right, Root)
    // Useful for deleting tree (children first, then parent)
    depthFirstPostOrder() {
        const visited = [];

        function traverse(node) {
            if (!node) return;

            traverse(node.left);        // Visit left
            traverse(node.right);       // Visit right
            visited.push(node.value);  // Visit root
        }

        traverse(this.root);
        return visited;
    }

    // Get minimum value in tree (leftmost node)
    findMin() {
        if (!this.root) return null;

        let current = this.root;
        while (current.left) {
            current = current.left;
        }
        return current.value;
    }

    // Get maximum value in tree (rightmost node)
    findMax() {
        if (!this.root) return null;

        let current = this.root;
        while (current.right) {
            current = current.right;
        }
        return current.value;
    }
}

// Demo
const tree = new BinarySearchTree();

// Build tree
tree.insert(10);
tree.insert(6);
tree.insert(15);
tree.insert(3);
tree.insert(8);
tree.insert(20);

console.log("BFS:", tree.breadthFirstSearch());        // [10, 6, 15, 3, 8, 20]
console.log("DFS Pre-order:", tree.depthFirstPreOrder());   // [10, 6, 3, 8, 15, 20]
console.log("DFS In-order:", tree.depthFirstInOrder());     // [3, 6, 8, 10, 15, 20] (sorted!)
console.log("DFS Post-order:", tree.depthFirstPostOrder()); // [3, 8, 6, 20, 15, 10]

console.log("Contains 8?", tree.contains(8));   // true
console.log("Contains 100?", tree.contains(100)); // false
console.log("Min value:", tree.findMin());      // 3
console.log("Max value:", tree.findMax());      // 20
