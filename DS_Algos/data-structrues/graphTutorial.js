/* ============================================================
   PART 1: UNDERSTANDING ADJACENCY LISTS
   ============================================================
   
   What is a Graph?
   ----------------
   A graph is a data structure consisting of:
   - Vertices (nodes): The entities in the graph
   - Edges: Connections between vertices
   
   Example: Social network where people are vertices and friendships are edges
   
   
   What is an Adjacency List?
   --------------------------
   An adjacency list is a way to represent a graph where:
   - Each vertex stores a list of its neighboring vertices
   - We use a hash map (object) where keys are vertices and values are arrays of neighbors
   
   Why use an Adjacency List?
   --------------------------
   - Space efficient for sparse graphs (few edges): O(V + E)
   - Fast to iterate over all edges of a vertex
   - Easy to add vertices and edges
   
   Alternative: Adjacency Matrix
   - Uses a 2D array where matrix[i][j] = 1 if edge exists
   - Better for dense graphs (many edges)
   - Takes O(V²) space regardless of edges
   
   
   Visual Example:
   ---------------
        A
      /   \
     B     C
     |     |
     D --- E
      \   /
        F
   
   Adjacency List representation:
   {
     A: [B, C],
     B: [A, D],
     C: [A, E],
     D: [B, E, F],
     E: [C, D, F],
     F: [D, E]
   }
   
   Notice: Each edge appears twice (undirected graph)
   - Edge A-B means A's list has B AND B's list has A
   
============================================================ */

class Graph {
    constructor() {
        // Initialize empty adjacency list as an object/hash map
        // Keys will be vertex names, values will be arrays of neighbors
        this.adjacencyList = {};
    }

    /* --------------------------------------------------------
       ADD VERTEX
       --------------------------------------------------------
       Time Complexity: O(1)
       
       Simply create a new key in our object with an empty array
       The empty array will later hold all neighboring vertices
    -------------------------------------------------------- */
    addVertex(vertex) {
        // Only add if vertex doesn't already exist (prevent overwriting)
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }

    /* --------------------------------------------------------
       ADD EDGE (Undirected Graph)
       --------------------------------------------------------
       Time Complexity: O(1)
       
       For undirected graphs, we add the connection in BOTH directions:
       - Add v2 to v1's neighbor list
       - Add v1 to v2's neighbor list
       
       For a directed graph, you would only add one direction
    -------------------------------------------------------- */
    addEdge(v1, v2) {
        // Add v2 as a neighbor of v1
        this.adjacencyList[v1].push(v2);
        // Add v1 as a neighbor of v2 (because undirected)
        this.adjacencyList[v2].push(v1);
    }

    /* --------------------------------------------------------
       REMOVE EDGE
       --------------------------------------------------------
       Time Complexity: O(E) where E is number of edges for vertex
       
       Filter out the connections in both directions
    -------------------------------------------------------- */
    removeEdge(vertex1, vertex2) {
        // Remove vertex2 from vertex1's list
        this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
            (v) => v !== vertex2
        );
        // Remove vertex1 from vertex2's list
        this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(
            (v) => v !== vertex1
        );
    }

    /* --------------------------------------------------------
       REMOVE VERTEX
       --------------------------------------------------------
       Time Complexity: O(V + E)
       
       Must remove all edges connected to this vertex first,
       then delete the vertex itself
    -------------------------------------------------------- */
    removeVertex(vertex) {
        // Remove all edges connected to this vertex
        while (this.adjacencyList[vertex].length) {
            const adjacentVertex = this.adjacencyList[vertex].pop();
            this.removeEdge(vertex, adjacentVertex);
        }
        // Delete the vertex from adjacency list
        delete this.adjacencyList[vertex];
    }


    /* ============================================================
       PART 2: DEPTH-FIRST SEARCH (DFS)
       ============================================================
       
       What is DFS?
       ------------
       DFS explores as far as possible along each branch before backtracking.
       Think of it like exploring a maze: go down one path until you hit 
       a dead end, then backtrack and try another path.
       
       Key Characteristics:
       - Uses a STACK (LIFO - Last In, First Out)
       - Goes "deep" before going "wide"
       - Good for: finding paths, detecting cycles, topological sorting
       
       Time Complexity: O(V + E) - visit every vertex and edge once
       Space Complexity: O(V) - for visited set and stack/recursion
       
       
       Traversal Order Example (from A):
       ----------------------------------
             A          
           /   \        DFS might visit: A → B → D → E → C → F
          B     C       (goes deep down B's path first)
          |     |       
          D --- E       Note: Order can vary based on neighbor order
           \   /        
             F          
    
    ============================================================ */

    /* --------------------------------------------------------
       DFS - RECURSIVE APPROACH
       --------------------------------------------------------
       
       How it works:
       1. Start at a vertex, mark it visited, add to result
       2. For each unvisited neighbor, recursively call DFS
       3. The call stack acts as our implicit stack
       
       Pros: Clean, elegant code
       Cons: Can cause stack overflow for very deep graphs
    -------------------------------------------------------- */
    depthFirstRecursive(start) {
        const result = [];           // Stores order of visited vertices
        const visited = {};          // Tracks which vertices we've seen
        const adjacencyList = this.adjacencyList;  // Reference for inner function

        // IIFE (Immediately Invoked Function Expression) for recursion
        (function dfs(vertex) {
            // Base case: if vertex is null/undefined, return
            if (!vertex) return null;

            // Mark current vertex as visited
            visited[vertex] = true;
            
            // Add to our result array
            result.push(vertex);

            // Recursively visit all unvisited neighbors
            adjacencyList[vertex].forEach((neighbor) => {
                if (!visited[neighbor]) {
                    return dfs(neighbor);  // Recursive call
                }
            });
        })(start);  // Start the recursion with our starting vertex

        return result;
    }

    /* --------------------------------------------------------
       DFS - ITERATIVE APPROACH
       --------------------------------------------------------
       
       How it works:
       1. Use an explicit stack (array with push/pop)
       2. Push starting vertex onto stack
       3. While stack not empty:
          - Pop a vertex
          - If not visited, mark visited and add to result
          - Push all unvisited neighbors onto stack
       
       Pros: No risk of stack overflow
       Cons: Slightly more code, order may differ from recursive
       
       Why order might differ:
       - Recursive processes neighbors in order (first to last)
       - Iterative with stack processes in reverse (last to first)
    -------------------------------------------------------- */
    depthFirstIterative(start) {
        const stack = [start];       // Initialize stack with starting vertex
        const result = [];           // Stores order of visited vertices
        const visited = {};          // Tracks which vertices we've seen
        let currentVertex;

        // Mark start as visited BEFORE entering loop
        visited[start] = true;

        while (stack.length) {
            // Pop the top vertex from stack (LIFO)
            currentVertex = stack.pop();
            
            // Add to result
            result.push(currentVertex);

            // Push all unvisited neighbors onto stack
            this.adjacencyList[currentVertex].forEach((neighbor) => {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;  // Mark visited when pushing
                    stack.push(neighbor);
                }
            });
        }

        return result;
    }


    /* ============================================================
       PART 3: BREADTH-FIRST SEARCH (BFS)
       ============================================================
       
       What is BFS?
       ------------
       BFS explores all neighbors at the current depth before moving 
       to vertices at the next depth level.
       Think of it like ripples in a pond: explore outward in circles.
       
       Key Characteristics:
       - Uses a QUEUE (FIFO - First In, First Out)
       - Goes "wide" before going "deep"
       - Good for: shortest path (unweighted), level-order traversal
       
       Time Complexity: O(V + E) - visit every vertex and edge once
       Space Complexity: O(V) - for visited set and queue
       
       
       Traversal Order Example (from A):
       ----------------------------------
             A          Level 0: A
           /   \        Level 1: B, C
          B     C       Level 2: D, E
          |     |       Level 3: F
          D --- E       
           \   /        BFS visits: A → B → C → D → E → F
             F          (explores level by level)
       
       
       DFS vs BFS - When to use which?
       --------------------------------
       Use DFS when:
       - You want to visit every node (traversal)
       - Finding any path between two nodes
       - Detecting cycles
       - Topological sorting
       - Solving mazes (exploring all paths)
       
       Use BFS when:
       - Finding SHORTEST path (unweighted graph)
       - Finding nodes within K distance
       - Level-order processing
       - Web crawling (closest pages first)
       
    ============================================================ */

    /* --------------------------------------------------------
       BFS - ITERATIVE APPROACH
       --------------------------------------------------------
       
       How it works:
       1. Use a queue (array with push/shift)
       2. Enqueue starting vertex
       3. While queue not empty:
          - Dequeue a vertex (from front)
          - Add to result
          - Enqueue all unvisited neighbors
       
       Note: BFS is typically done iteratively.
       Recursive BFS is possible but awkward and not commonly used.
    -------------------------------------------------------- */
    breadthFirst(start) {
        const queue = [start];       // Initialize queue with starting vertex
        const result = [];           // Stores order of visited vertices
        const visited = {};          // Tracks which vertices we've seen
        let currentVertex;

        // Mark start as visited
        visited[start] = true;

        while (queue.length) {
            // Dequeue from front of queue (FIFO)
            // shift() removes and returns first element
            currentVertex = queue.shift();
            
            // Add to result
            result.push(currentVertex);

            // Enqueue all unvisited neighbors
            this.adjacencyList[currentVertex].forEach((neighbor) => {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;  // Mark visited when enqueueing
                    queue.push(neighbor);      // Add to back of queue
                }
            });
        }

        return result;
    }

    // Helper method to visualize the graph
    printGraph() {
        console.log("\nAdjacency List:");
        console.log("---------------");
        for (let vertex in this.adjacencyList) {
            console.log(`${vertex} -> [${this.adjacencyList[vertex].join(", ")}]`);
        }
        console.log("");
    }
}


/* ============================================================
   PART 4: DEMONSTRATION
   ============================================================ */

// Create a new graph
let g = new Graph();

// Step 1: Add all vertices
console.log("=== Building the Graph ===\n");
console.log("Adding vertices: A, B, C, D, E, F");
g.addVertex("A");
g.addVertex("B");
g.addVertex("C");
g.addVertex("D");
g.addVertex("E");
g.addVertex("F");

// Step 2: Add edges to connect vertices
console.log("\nAdding edges:");
console.log("  A--B, A--C, B--D, C--E, D--E, D--F, E--F");
g.addEdge("A", "B");
g.addEdge("A", "C");
g.addEdge("B", "D");
g.addEdge("C", "E");
g.addEdge("D", "E");
g.addEdge("D", "F");
g.addEdge("E", "F");

// Show the resulting adjacency list
g.printGraph();

/*
   Visual representation of our graph:
   
          A
        /   \
       B     C
       |     |
       D --- E
        \   /
          F
*/

// Step 3: Run traversals
console.log("=== Graph Traversals ===\n");

console.log("DFS Recursive from A:", g.depthFirstRecursive("A"));
// Expected: explores deeply before backtracking

console.log("DFS Iterative from A:", g.depthFirstIterative("A"));
// May differ slightly from recursive due to stack order

console.log("BFS from A:", g.breadthFirst("A"));
// Expected: A, then A's neighbors, then their neighbors...

/*
   Key Takeaways:
   --------------
   1. Adjacency List: Object with vertices as keys, neighbor arrays as values
   2. DFS: Uses stack, goes deep first - good for exploring all paths
   3. BFS: Uses queue, goes wide first - good for shortest path
   4. Both have O(V + E) time complexity
   5. Always track visited nodes to avoid infinite loops in cyclic graphs
*/
