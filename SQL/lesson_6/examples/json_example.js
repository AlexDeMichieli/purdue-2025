/**
 * Lesson 06 Demo 01 - JSON Example in JavaScript/Node.js
 * This demonstrates creating and handling JSON structures
 *
 * Run with: node json_example.js
 */

// Create a JSON object
const person = {
    name: "John",
    age: 30,
    city: "New York"
};

// Convert to JSON string (like cJSON_Print in C)
const jsonString = JSON.stringify(person, null, 4);

console.log("JSON Output:");
console.log(jsonString);

// Create more complex structure with arrays and nested objects
const employee = {
    name: "Jane Doe",
    age: 28,
    department: "Engineering",
    skills: ["Python", "MongoDB", "JavaScript"],
    address: {
        street: "123 Main St",
        city: "Boston",
        zip: "02101"
    },
    phoneNumbers: [
        { type: "home", number: "555-1234" },
        { type: "work", number: "555-5678" }
    ]
};

console.log("\nComplex JSON Output:");
console.log(JSON.stringify(employee, null, 4));

// Parse JSON string back to object
const jsonInput = '{"product": "Laptop", "price": 999.99}';
const parsed = JSON.parse(jsonInput);
console.log("\nParsed JSON:", parsed);
console.log(`Product: ${parsed.product}, Price: $${parsed.price}`);

// Simulating BSON-like structure (what MongoDB stores)
const bsonLikeDocument = {
    _id: "ObjectId('615a9f9f1b8a080a0416d53f')",  // In real BSON, this is a special type
    name: "John Doe",
    age: 30,
    createdAt: new Date().toISOString()  // BSON has native Date type
};

console.log("\nBSON-like Document:");
console.log(JSON.stringify(bsonLikeDocument, null, 4));
