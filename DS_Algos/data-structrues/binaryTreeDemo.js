// Interactive Binary Tree Demo
// Demonstrates tree creation, insertion, traversal, and search operations
// Run this file to see how each operation works step-by-step

// Node class - building block of the tree
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;  // Points to left child (smaller values)
        this.right = null; // Points to right child (larger values)
    }
}

// Binary Search Tree class
class BinarySearchTree {
    constructor() {
        this.root = null; // Starting point of the tree
    }

    // Insert a new value into the correct position
    insert(value) {
        const newNode = new Node(value);

        console.log(`\nInserting ${value}...`);

        // Special case: empty tree
        if (this.root === null) {
            this.root = newNode;
            console.log(`  ${value} becomes the root (first node in tree)`);
            return this;
        }

        // Navigate through tree to find insertion point
        let current = this.root;
        while (true) {
            // Don't insert duplicates
            if (value === current.value) {
                console.log(`  ${value} already exists, skipping`);
                return this;
            }

            // Value goes on the left side (smaller than current)
            if (value < current.value) {
                console.log(`  ${value} < ${current.value}, go left`);

                if (current.left === null) {
                    current.left = newNode;
                    console.log(`  ${value} inserted as left child of ${current.value}`);
                    return this;
                }
                current = current.left;
            }
            // Value goes on the right side (larger than current)
            else {
                console.log(`  ${value} > ${current.value}, go right`);

                if (current.right === null) {
                    current.right = newNode;
                    console.log(`  ${value} inserted as right child of ${current.value}`);
                    return this;
                }
                current = current.right;
            }
        }
    }

    // Search for a specific value in the tree
    search(value) {
        console.log(`\nSearching for ${value}...`);

        if (this.root === null) {
            console.log(`  Tree is empty`);
            return null;
        }

        let current = this.root;
        let steps = 0;

        while (current) {
            steps++;
            console.log(`  Step ${steps}: Checking node ${current.value}`);

            // Found it!
            if (value === current.value) {
                console.log(`  ✓ Found ${value} in ${steps} steps!`);
                return current;
            }

            // Search left subtree
            if (value < current.value) {
                console.log(`    ${value} < ${current.value}, searching left...`);
                current = current.left;
            }
            // Search right subtree
            else {
                console.log(`    ${value} > ${current.value}, searching right...`);
                current = current.right;
            }
        }

        console.log(`  ✗ ${value} not found after ${steps} steps`);
        return null;
    }

    // Find the smallest value in the tree
    // Always the leftmost node
    findMin() {
        console.log(`\nFinding minimum value...`);

        if (!this.root) {
            console.log(`  Tree is empty`);
            return null;
        }

        let current = this.root;
        let steps = 0;

        console.log(`  Starting at root: ${current.value}`);

        // Keep going left until we can't anymore
        while (current.left) {
            steps++;
            console.log(`  Step ${steps}: Moving left from ${current.value} to ${current.left.value}`);
            current = current.left;
        }

        console.log(`  ✓ Minimum value is ${current.value}`);
        return current.value;
    }

    // Find the largest value in the tree
    // Always the rightmost node
    findMax() {
        console.log(`\nFinding maximum value...`);

        if (!this.root) {
            console.log(`  Tree is empty`);
            return null;
        }

        let current = this.root;
        let steps = 0;

        console.log(`  Starting at root: ${current.value}`);

        // Keep going right until we can't anymore
        while (current.right) {
            steps++;
            console.log(`  Step ${steps}: Moving right from ${current.value} to ${current.right.value}`);
            current = current.right;
        }

        console.log(`  ✓ Maximum value is ${current.value}`);
        return current.value;
    }

    // In-order traversal (Left → Root → Right)
    // This visits nodes in sorted order for a BST
    inOrderTraversal() {
        console.log(`\nIn-Order Traversal (Left → Root → Right):`);
        const result = [];

        function traverse(node) {
            if (!node) return;

            // Visit left subtree first
            traverse(node.left);

            // Then visit current node
            console.log(`  Visiting node: ${node.value}`);
            result.push(node.value);

            // Finally visit right subtree
            traverse(node.right);
        }

        traverse(this.root);
        console.log(`  Result: [${result.join(', ')}] (sorted order!)`);
        return result;
    }

    // Pre-order traversal (Root → Left → Right)
    // Useful for copying the tree structure
    preOrderTraversal() {
        console.log(`\nPre-Order Traversal (Root → Left → Right):`);
        const result = [];

        function traverse(node) {
            if (!node) return;

            // Visit current node first
            console.log(`  Visiting node: ${node.value}`);
            result.push(node.value);

            // Then left subtree
            traverse(node.left);

            // Then right subtree
            traverse(node.right);
        }

        traverse(this.root);
        console.log(`  Result: [${result.join(', ')}]`);
        return result;
    }

    // Post-order traversal (Left → Right → Root)
    // Useful for deleting the tree (delete children before parent)
    postOrderTraversal() {
        console.log(`\nPost-Order Traversal (Left → Right → Root):`);
        const result = [];

        function traverse(node) {
            if (!node) return;

            // Visit left subtree first
            traverse(node.left);

            // Then right subtree
            traverse(node.right);

            // Finally visit current node
            console.log(`  Visiting node: ${node.value}`);
            result.push(node.value);
        }

        traverse(this.root);
        console.log(`  Result: [${result.join(', ')}]`);
        return result;
    }

    // Visual representation of tree structure
    printTree() {
        console.log(`\nTree Structure:`);

        function printNode(node, prefix = '', isLeft = true) {
            if (!node) return;

            console.log(prefix + (isLeft ? '├── ' : '└── ') + node.value);

            if (node.left || node.right) {
                if (node.left) {
                    printNode(node.left, prefix + (isLeft ? '│   ' : '    '), true);
                }
                if (node.right) {
                    printNode(node.right, prefix + (isLeft ? '│   ' : '    '), false);
                }
            }
        }

        if (this.root) {
            console.log(this.root.value + ' (root)');
            if (this.root.left) printNode(this.root.left, '', true);
            if (this.root.right) printNode(this.root.right, '', false);
        } else {
            console.log('  (empty tree)');
        }
    }
}

// ============================================
// INTERACTIVE DEMO
// ============================================

console.log('='.repeat(50));
console.log('BINARY SEARCH TREE INTERACTIVE DEMO');
console.log('='.repeat(50));

// Create a new tree
const tree = new BinarySearchTree();

console.log('\n--- STEP 1: Building the Tree ---');
console.log('Inserting values: 50, 30, 70, 20, 40, 60, 80');

// Insert values one by one with explanations
tree.insert(50); // Becomes root
tree.insert(30); // Goes left of 50
tree.insert(70); // Goes right of 50
tree.insert(20); // Goes left of 30
tree.insert(40); // Goes right of 30
tree.insert(60); // Goes left of 70
tree.insert(80); // Goes right of 70

// Show the tree structure
tree.printTree();

console.log('\n--- STEP 2: Searching for Values ---');
tree.search(40); // Should find it
tree.search(100); // Should not find it

console.log('\n--- STEP 3: Finding Min/Max Values ---');
tree.findMin(); // Should be 20 (leftmost)
tree.findMax(); // Should be 80 (rightmost)

console.log('\n--- STEP 4: Tree Traversals ---');
tree.inOrderTraversal();   // [20, 30, 40, 50, 60, 70, 80] - sorted!
tree.preOrderTraversal();  // [50, 30, 20, 40, 70, 60, 80]
tree.postOrderTraversal(); // [20, 40, 30, 60, 80, 70, 50]

console.log('\n' + '='.repeat(50));
console.log('DEMO COMPLETE!');
console.log('='.repeat(50));

console.log(`
KEY TAKEAWAYS:
1. Binary Search Tree property: Left < Parent < Right
2. Insertion: Navigate left/right based on value comparison
3. Search: O(log n) average time by eliminating half the tree each step
4. In-order traversal: Gives sorted output for BST
5. Min value: Always leftmost node
6. Max value: Always rightmost node
`);
