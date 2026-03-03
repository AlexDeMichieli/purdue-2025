# Lesson 06 Demo 01 — Fetching Data from APIs

**Objective:** Use the Fetch API to retrieve data from external APIs, handle responses, and work with JSON data.

**Tools:** VS Code, npm

**Prerequisites:** None

---

## What is the Fetch API?

`fetch()` is a modern way to make HTTP requests. It returns a Promise, making it easy to chain with `.then()` or use with `async`/`await`. Node.js 18+ has `fetch` built-in; for older versions, you can install `node-fetch`.

---

## Step 1: Set Up the Project

```bash
mkdir fetchDemo
cd fetchDemo
npm init -y
code .
```

If you're on Node.js 18+, `fetch` is built-in. For older versions:

```bash
npm install node-fetch
```

---

## Step 2: Basic Fetch with Promises

Create `index.js`:

```js
// For Node < 18, uncomment this line:
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => {
        console.log('Status:', response.status);
        return response.json();
    })
    .then((users) => {
        console.log(`Fetched ${users.length} users:\n`);
        users.forEach((user) => {
            console.log(`  ${user.id}. ${user.name} (${user.email})`);
        });
    })
    .catch((error) => {
        console.error('Fetch failed:', error.message);
    });
```

```bash
node index.js
```

The chain: `fetch()` returns a Response → `.json()` parses it → second `.then()` receives the data.

---

## Step 3: Fetch with Async/Await (Cleaner)

Replace `index.js`:

```js
async function getUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const users = await response.json();

        console.log(`Fetched ${users.length} users:\n`);
        users.forEach((user) => {
            console.log(`  ${user.id}. ${user.name} — ${user.company.name}`);
        });
    } catch (error) {
        console.error('Failed to fetch users:', error.message);
    }
}

getUsers();
```

```bash
node index.js
```

`async`/`await` makes the code read like synchronous code while still being non-blocking.

---

## Step 4: Fetch a Single Resource

Replace `index.js`:

```js
async function getUser(id) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

    if (!response.ok) {
        throw new Error(`User ${id} not found`);
    }

    return response.json();
}

async function getUserPosts(userId) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    return response.json();
}

async function main() {
    try {
        const user = await getUser(1);
        console.log(`User: ${user.name} (${user.email})\n`);

        const posts = await getUserPosts(user.id);
        console.log(`${user.name}'s posts:`);
        posts.slice(0, 3).forEach((post) => {
            console.log(`  - ${post.title}`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
```

```bash
node index.js
```

This fetches a user, then fetches their posts — a common pattern when APIs have related resources.

---

## Step 5: Parallel Fetching

Fetching sequentially is slow. Use `Promise.all` to fetch multiple resources at once:

Replace `index.js`:

```js
async function fetchMultipleUsers(ids) {
    const requests = ids.map((id) =>
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
            .then((res) => res.json())
    );

    return Promise.all(requests);
}

async function main() {
    console.log('Fetching users 1, 2, and 3 in parallel...\n');

    const startTime = Date.now();
    const users = await fetchMultipleUsers([1, 2, 3]);
    const elapsed = Date.now() - startTime;

    users.forEach((user) => {
        console.log(`  ${user.id}. ${user.name} — ${user.email}`);
    });

    console.log(`\nCompleted in ${elapsed}ms`);
}

main();
```

```bash
node index.js
```

`Promise.all` waits for all requests to complete. Much faster than awaiting each one sequentially.

---

## Step 6: POST Request (Sending Data)

Replace `index.js`:

```js
async function createPost(post) {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    });

    if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status}`);
    }

    return response.json();
}

async function main() {
    const newPost = {
        title: 'My First Post',
        body: 'This is the content of my post.',
        userId: 1
    };

    console.log('Creating post...\n');

    const created = await createPost(newPost);

    console.log('Post created:');
    console.log(`  ID: ${created.id}`);
    console.log(`  Title: ${created.title}`);
    console.log(`  Body: ${created.body}`);
}

main();
```

```bash
node index.js
```

POST requests need `method`, `headers`, and `body`. The API returns the created resource (with an assigned `id`).

---

## Step 7: Error Handling

Replace `index.js`:

```js
async function fetchWithRetry(url, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.log(`Attempt ${attempt} failed: ${error.message}`);

            if (attempt === retries) {
                throw new Error(`Failed after ${retries} attempts`);
            }

            // Wait before retrying (exponential backoff)
            await new Promise((r) => setTimeout(r, 1000 * attempt));
        }
    }
}

async function main() {
    try {
        // This URL will fail
        const data = await fetchWithRetry('https://jsonplaceholder.typicode.com/invalid', 3);
        console.log(data);
    } catch (error) {
        console.error('Final error:', error.message);
    }
}

main();
```

```bash
node index.js
```

Real-world apps should handle network failures gracefully. This example retries with exponential backoff.

---

## Summary

| Concept | Example | What it does |
|---|---|---|
| Basic fetch | `fetch(url)` | Returns a Promise that resolves to a Response |
| Parse JSON | `response.json()` | Returns a Promise that resolves to parsed data |
| Check status | `response.ok` | `true` if status is 200-299 |
| Async/await | `const data = await fetch(url)` | Cleaner syntax for Promises |
| Parallel fetch | `Promise.all([...])` | Run multiple fetches concurrently |
| POST request | `fetch(url, { method: 'POST', body })` | Send data to the server |
| Error handling | `try/catch` | Handle network and HTTP errors |
