# Lesson 04 Demo 01 — Creating Test Cases

**Objective:** Create test cases using the `node:test` module to verify real functions — covering sync tests, async tests, subtests, skipping, and `describe`/`it` syntax.

**Tools:** VS Code, npm

**Prerequisites:** A basic understanding of JavaScript

---

## Project Setup

Create a project directory with two files — a small utility module and a test file:

```bash
mkdir testDemo
cd testDemo
touch utils.js index.js
code .
```

Add the following helper functions to `utils.js`:

```js
function add(a, b) {
    return a + b;
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function isEmail(str) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

async function fetchUser(id) {
    // Simulates an async database lookup
    const users = { 1: 'Alice', 2: 'Bob', 3: 'Charlie' };
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (users[id]) {
                resolve({ id, name: users[id] });
            } else {
                reject(new Error(`User ${id} not found`));
            }
        }, 100);
    });
}

module.exports = { add, capitalize, isEmail, fetchUser };
```

Now all the tests in the following steps will verify these functions.

---

## Step 1: Basic Tests

Write the following in `index.js`:

```js
const test = require('node:test');
const assert = require('assert');
const { add, capitalize, isEmail } = require('./utils');

test('add returns the sum of two numbers', (t) => {
    assert.strictEqual(add(2, 3), 5);
});

test('add handles negative numbers', (t) => {
    assert.strictEqual(add(-1, -4), -5);
});

test('capitalize uppercases the first letter', (t) => {
    assert.strictEqual(capitalize('hello'), 'Hello');
});

test('capitalize returns empty string for empty input', (t) => {
    assert.strictEqual(capitalize(''), '');
});

test('isEmail validates correct emails', (t) => {
    assert.strictEqual(isEmail('alice@example.com'), true);
});

test('isEmail rejects invalid emails', (t) => {
    assert.strictEqual(isEmail('not-an-email'), false);
});
```

```bash
node index.js
```

Each `test()` runs a function and passes if no exception is thrown. `assert.strictEqual` compares both value and type — `strictEqual(1, '1')` would fail because number !== string.

---

## Step 2: Async Tests

Replace `index.js` with:

```js
const test = require('node:test');
const assert = require('assert');
const { fetchUser } = require('./utils');

test('fetchUser returns the correct user', async (t) => {
    const user = await fetchUser(1);
    assert.strictEqual(user.name, 'Alice');
});

test('fetchUser rejects for unknown IDs', async (t) => {
    await assert.rejects(
        () => fetchUser(999),
        { message: 'User 999 not found' }
    );
});
```

```bash
node index.js
```

Async tests use `async`/`await`. `assert.rejects` verifies that a promise rejects with the expected error — useful for testing error paths without wrapping everything in try/catch.

---

## Step 3: Subtests

Group related assertions under a parent test using `t.test()`. The `await` keyword is required — parent tests do **not** wait for subtests by default, and any outstanding subtest is canceled and treated as a failure.

Replace `index.js` with:

```js
const test = require('node:test');
const assert = require('assert');
const { add, capitalize } = require('./utils');

test('add', async (t) => {
    await t.test('positive numbers', () => {
        assert.strictEqual(add(2, 3), 5);
    });

    await t.test('negative numbers', () => {
        assert.strictEqual(add(-1, -4), -5);
    });

    await t.test('zeros', () => {
        assert.strictEqual(add(0, 0), 0);
    });
});

test('capitalize', async (t) => {
    await t.test('normal string', () => {
        assert.strictEqual(capitalize('hello'), 'Hello');
    });

    await t.test('already capitalized', () => {
        assert.strictEqual(capitalize('Hello'), 'Hello');
    });

    await t.test('empty string', () => {
        assert.strictEqual(capitalize(''), '');
    });
});
```

```bash
node index.js
```

The output nests subtests under their parent, making it easy to see which specific case failed.

---

## Step 4: Skip Tests

Replace `index.js` with:

```js
const test = require('node:test');
const assert = require('assert');
const { add, isEmail } = require('./utils');

test('add works', (t) => {
    assert.strictEqual(add(1, 2), 3);
});

// Skip with the options object — body never runs
test('feature not yet implemented', { skip: true }, (t) => {
    // This would test a function that doesn't exist yet
});

// Skip with a reason — shows up in the test output
test('email validation edge cases', { skip: 'need to define edge case list' }, (t) => {
    assert.strictEqual(isEmail('user@.com'), false);
});

// Skip from inside the test body
test('conditional skip', (t) => {
    const dbAvailable = false;
    if (!dbAvailable) {
        t.skip('database not available in this environment');
        return;
    }
    // database tests would go here
});
```

```bash
node index.js
```

Skipped tests appear in the output as skipped (not as passes or failures). This is useful for work-in-progress tests, environment-specific tests, or temporarily disabling a flaky test without deleting it.

---

## Step 5: `describe` and `it` Syntax

Replace `index.js` with:

```js
const { describe, it } = require('node:test');
const assert = require('assert');
const { add, capitalize, isEmail, fetchUser } = require('./utils');

describe('add', () => {
    it('should return the sum of two numbers', () => {
        assert.strictEqual(add(10, 5), 15);
    });

    it('should handle decimals', () => {
        assert.strictEqual(add(0.1, 0.2).toFixed(1), '0.3');
    });
});

describe('capitalize', () => {
    it('should uppercase the first letter', () => {
        assert.strictEqual(capitalize('node'), 'Node');
    });

    it('should return empty string for falsy input', () => {
        assert.strictEqual(capitalize(''), '');
        assert.strictEqual(capitalize(null), '');
    });
});

describe('isEmail', () => {
    it('should accept valid emails', () => {
        assert.strictEqual(isEmail('bob@test.com'), true);
    });

    it('should reject strings without @', () => {
        assert.strictEqual(isEmail('bob-at-test.com'), false);
    });
});

describe('fetchUser', () => {
    it('should return a user object', async () => {
        const user = await fetchUser(2);
        assert.strictEqual(user.name, 'Bob');
    });

    it('should throw for unknown users', async () => {
        await assert.rejects(() => fetchUser(99));
    });
});
```

```bash
node index.js
```

`describe` groups related tests into a named suite. `it` defines individual cases. This is the same pattern used by Mocha and Jest, so the syntax transfers directly if you switch frameworks later.

---

## Summary

| Concept | API | What it does |
|---|---|---|
| Define a test | `test('name', callback)` | Creates a single test case |
| Assert equality | `assert.strictEqual(a, b)` | Fails if `a !== b` (type + value) |
| Assert rejection | `assert.rejects(fn, expected)` | Fails if the promise doesn't reject |
| Async test | `test('name', async (t) => { ... })` | Test that uses promises |
| Subtests | `await t.test('name', callback)` | Nest tests inside a parent test |
| Skip a test | `{ skip: true }` or `t.skip()` | Report but don't execute the test |
| Group tests | `describe('name', callback)` | Organize tests into named suites |
| Individual test | `it('name', callback)` | Define a test inside a `describe` block |
