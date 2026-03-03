# Lesson 04 Demo 02 — File System Operations

**Objective:** Use the `fs` module to read, write, and delete files — applied through a simple contact manager that saves data to disk.

**Tools:** VS Code, npm

**Prerequisites:** None

---

## Step 1: Set Up the Project and Read Files

Create a project directory with a starter data file:

```bash
mkdir nodeDemo
cd nodeDemo
touch index.js contacts.json
code .
```

Add the following to `contacts.json`:

```json
[
    { "name": "Alice", "email": "alice@example.com" },
    { "name": "Bob", "email": "bob@example.com" },
    { "name": "Charlie", "email": "charlie@example.com" }
]
```

### Asynchronous read (`fs.readFile`)

Write the following in `index.js`:

```js
const fs = require('fs');

fs.readFile('./contacts.json', 'utf8', (error, data) => {
    if (error) {
        console.error("Error reading file:", error);
        return;
    }

    const contacts = JSON.parse(data);
    console.log(`Loaded ${contacts.length} contacts:\n`);
    contacts.forEach((c) => console.log(`  ${c.name} — ${c.email}`));
});
```

```bash
node index.js
```

`fs.readFile` is **non-blocking** — Node continues running other code while the file is being read. The `'utf8'` encoding argument tells Node to return a string instead of a raw `Buffer`, so you don't need to call `.toString()`.

### Synchronous read (`fs.readFileSync`)

Replace `index.js` with:

```js
const fs = require('fs');

const data = fs.readFileSync('./contacts.json', 'utf8');
const contacts = JSON.parse(data);

console.log(`Loaded ${contacts.length} contacts:\n`);
contacts.forEach((c) => console.log(`  ${c.name} — ${c.email}`));
```

```bash
node index.js
```

`fs.readFileSync` is **blocking** — execution halts until the file is fully read. Simpler to write, but it blocks the event loop. Use it for scripts and startup code, not inside request handlers.

---

## Step 2: Write Files

### Synchronous write (`writeFileSync`)

Replace `index.js` with:

```js
const { readFileSync, writeFileSync } = require('fs');

// Load existing contacts
const contacts = JSON.parse(readFileSync('./contacts.json', 'utf8'));

// Add a new contact
contacts.push({ name: 'Diana', email: 'diana@example.com' });

// Save back to disk
writeFileSync('./contacts.json', JSON.stringify(contacts, null, 4));
console.log(`Saved ${contacts.length} contacts`);
```

```bash
node index.js
```

Open `contacts.json` to confirm Diana was added. `JSON.stringify(data, null, 4)` pretty-prints the JSON with 4-space indentation. If the file doesn't exist, `writeFileSync` creates it. If it does exist, the content is replaced.

### Asynchronous write (`fs.writeFile`)

Replace `index.js` with:

```js
const fs = require('fs');

// Export contacts to a CSV file
fs.readFile('./contacts.json', 'utf8', (error, data) => {
    if (error) {
        console.error("Error reading contacts:", error);
        return;
    }

    const contacts = JSON.parse(data);
    const csv = 'name,email\n' + contacts.map((c) => `${c.name},${c.email}`).join('\n');

    fs.writeFile('./contacts-export.csv', csv, (error) => {
        if (error) {
            console.error("Error writing CSV:", error);
            return;
        }
        console.log("Exported contacts to contacts-export.csv");
    });
});
```

```bash
node index.js
```

This reads the JSON, converts it to CSV, and writes the export — all asynchronously. Open `contacts-export.csv` to see the result.

---

## Step 3: Delete Files

### Asynchronous delete (`unlink`)

Replace `index.js` with:

```js
const { unlink } = require('fs');

unlink('./contacts-export.csv', (error) => {
    if (error) {
        console.error("Error deleting file:", error);
        return;
    }
    console.log("Deleted contacts-export.csv");
});
```

```bash
node index.js
```

Verify that `contacts-export.csv` has been removed. The function is called `unlink` because it removes the file's link from the filesystem — the traditional Unix name for deleting a file.

### Synchronous delete (`unlinkSync`)

First regenerate a file to delete, then replace `index.js`:

```js
const { writeFileSync, unlinkSync } = require('fs');

// Create a temp file, then immediately clean it up
writeFileSync('./temp.txt', 'temporary data');
console.log("Created temp.txt");

unlinkSync('./temp.txt');
console.log("Deleted temp.txt");
```

```bash
node index.js
```

Both operations happen sequentially and block until complete — useful for quick scripts where you need guaranteed ordering.

---

## Summary

| Operation | Async (non-blocking) | Sync (blocking) |
|---|---|---|
| **Read** | `fs.readFile(path, encoding, callback)` | `fs.readFileSync(path, encoding)` |
| **Write** | `fs.writeFile(path, data, callback)` | `fs.writeFileSync(path, data)` |
| **Delete** | `fs.unlink(path, callback)` | `fs.unlinkSync(path)` |

- **Async** methods use callbacks and don't block the event loop — use these in server code.
- **Sync** methods block until done — use these in scripts, CLI tools, or application startup.
- Write methods create the file if it doesn't exist and overwrite it if it does.
- Pass `'utf8'` to read methods to get a string instead of a `Buffer`.
- All async callbacks follow the error-first convention: `(error, data) => { ... }`.
