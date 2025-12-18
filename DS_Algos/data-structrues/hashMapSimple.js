// https://javascript.plainenglish.io/how-to-implement-a-hash-map-be6a2696f250
// Time complexity: O(1) average for insertion, deletion, and access
// Uses separate chaining to handle hash collisions

class Hashmap {
    constructor() {
        // Array to store key-value pairs
        // Each index holds a "bucket" (array) to handle hash collisions
        this.storage = [];
    }

    // Hash function: converts string key to numeric index
    // Simple approach: sums ASCII values of all characters
    // Note: This can cause collisions (different keys -> same hash)
    hashStr(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash += str.charCodeAt(i);
        }
        return hash;
    }

    // Add or update a key-value pair
    set(key, val) {
        const index = this.hashStr(key);

        // Create bucket at this index if it doesn't exist
        if (!this.storage[index]) {
            this.storage[index] = [];
        }

        // Check if key already exists in the bucket and update its value
        for (let pair of this.storage[index]) {
            if (pair[0] === key) {
                pair[1] = val;
                return;
            }
        }

        // Key doesn't exist yet, add new [key, value] pair to bucket
        this.storage[index].push([key, val]);
    }

    // Retrieve value by key
    get(key) {
        const index = this.hashStr(key);

        // Return undefined if bucket doesn't exist
        if (!this.storage[index]) {
            return undefined;
        }

        // Search through bucket for matching key
        for (let pair of this.storage[index]) {
            if (pair[0] === key) {
                return pair[1];
            }
        }

        // Key not found in bucket
        return undefined;
    }

    // Remove a key-value pair
    delete(key) {
        const index = this.hashStr(key);

        // Return false if bucket doesn't exist
        if (!this.storage[index]) return false;

        // Find and remove the key-value pair from bucket
        for (let i = 0; i < this.storage[index].length; i++) {
            if (this.storage[index][i][0] === key) {
                this.storage[index].splice(i, 1);
                return true;
            }
        }

        // Key not found
        return false;
    }

    // Check if key exists in hashmap
    has(key) {
        return this.get(key) !== undefined;
    }
}

// Demo
const m = new Hashmap();
m.set("name", "Jake");
m.set("age", 25);
m.set("city", "NYC");

console.log(m.get("name"));  // Jake
console.log(m.get("age"));   // 25
console.log(m.has("city"));  // true
m.delete("city");
console.log(m.has("city"));  // false
