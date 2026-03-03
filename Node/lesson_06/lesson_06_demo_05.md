# Lesson 06 Demo 05 — Child Processes and Multi-Core Processing

**Objective:** Use Node.js child processes to run CPU-intensive tasks without blocking the main thread.

**Tools:** VS Code, Node.js

**Prerequisites:** None

---

## The Problem: Blocking the Event Loop

Node.js is single-threaded. If you run a heavy computation, it blocks everything — no other requests can be handled until it finishes. This is a major problem for servers.

---

## Step 1: See the Problem (Blocking Code)

```bash
mkdir childDemo
cd childDemo
touch blocking.js
code .
```

Write the following in `blocking.js`:

```js
function heavyComputation() {
    let sum = 0;
    // Count to 5 billion — takes several seconds
    for (let i = 0; i < 5e9; i++) {
        sum += i;
    }
    return sum;
}

console.log('Start:', new Date().toTimeString());
console.log('Result:', heavyComputation());
console.log('End:', new Date().toTimeString());
```

```bash
node blocking.js
```

Notice:
- Nothing else can happen while this runs
- The entire Node.js process is frozen
- On a server, this would block ALL incoming requests

---

## Step 2: The Solution — Child Processes

Node.js can spawn separate processes to handle heavy work. The main process stays responsive while child processes do the computation.

There are three ways to create child processes:

| Method | Use case |
|---|---|
| `spawn()` | Run any command, stream output |
| `exec()` | Run a command, buffer output |
| `fork()` | Run a Node.js script with IPC messaging |

For Node.js scripts, `fork()` is ideal because it sets up a communication channel between parent and child.

---

## Step 3: Create a Child Process Worker

Create `compute.js` — this will run in a separate process:

```js
// This runs in a child process
process.on('message', (msg) => {
    if (msg === 'start') {
        console.log('[Child] Starting heavy computation...');

        let sum = 0;
        for (let i = 0; i < 5e9; i++) {
            sum += i;
        }

        console.log('[Child] Done!');

        // Send result back to parent
        process.send({ result: sum });
    }
});
```

Now create `parent.js`:

```js
const { fork } = require('child_process');

console.log('[Parent] Spawning child process...');

const child = fork('./compute.js');

// Send message to child
child.send('start');

// Receive result from child
child.on('message', (data) => {
    console.log('[Parent] Received result:', data.result);
});

child.on('exit', (code) => {
    console.log('[Parent] Child exited with code:', code);
});

// Parent can do other things while child works
console.log('[Parent] I can still do other work!');
setInterval(() => {
    console.log('[Parent] Still running...', new Date().toTimeString());
}, 2000);
```

```bash
node parent.js
```

Notice:
- The parent logs "I can still do other work!" immediately
- The parent continues printing every 2 seconds
- When the child finishes, the result arrives via message

---

## Step 4: Build a Non-Blocking Server

Now let's use this in a real HTTP server. The server stays responsive even during heavy computation.

Create `server.js`:

```js
const http = require('http');
const { fork } = require('child_process');

const PORT = 3000;

const server = http.createServer((req, res) => {
    const url = req.url;

    // Light endpoint — responds instantly
    if (url === '/') {
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({
            message: 'Server is responsive!',
            time: new Date().toTimeString()
        }));
    }

    // Heavy endpoint — uses child process
    if (url === '/compute') {
        const startTime = new Date();

        // Fork a child process
        const child = fork('./compute.js');
        child.send('start');

        child.on('message', (data) => {
            const endTime = new Date();
            const duration = (endTime - startTime) / 1000;

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                result: data.result,
                startTime: startTime.toTimeString(),
                endTime: endTime.toTimeString(),
                duration: `${duration} seconds`
            }));
        });

        return;
    }

    // 404
    res.statusCode = 404;
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
    console.log('Endpoints:');
    console.log('  GET /         — Quick response (test responsiveness)');
    console.log('  GET /compute  — Heavy computation (uses child process)');
});
```

```bash
node server.js
```

### Test It

Open two browser tabs (or use curl):

1. Visit `http://127.0.0.1:3000/compute` — starts heavy computation
2. Immediately visit `http://127.0.0.1:3000/` — responds instantly!

Without the child process, the second request would hang until the first completed.

---

## Step 5: Worker Pool Pattern

Spawning a new process for each request is expensive. A worker pool reuses processes:

Create `worker-pool.js`:

```js
const { fork } = require('child_process');
const http = require('http');

const PORT = 3000;
const NUM_WORKERS = 4;

// Create a pool of workers
const workers = [];
const taskQueue = [];

for (let i = 0; i < NUM_WORKERS; i++) {
    const worker = fork('./compute.js');
    worker.busy = false;
    worker.id = i;

    worker.on('message', (data) => {
        // Send result to the waiting callback
        if (worker.callback) {
            worker.callback(data);
            worker.callback = null;
        }

        worker.busy = false;

        // Check if there's queued work
        if (taskQueue.length > 0) {
            const next = taskQueue.shift();
            runTask(worker, next.callback);
        }
    });

    workers.push(worker);
}

function runTask(worker, callback) {
    worker.busy = true;
    worker.callback = callback;
    worker.send('start');
}

function queueTask(callback) {
    // Find an available worker
    const available = workers.find(w => !w.busy);

    if (available) {
        runTask(available, callback);
    } else {
        // All workers busy — queue the task
        taskQueue.push({ callback });
    }
}

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({
            message: 'Server responsive!',
            workers: NUM_WORKERS,
            queueLength: taskQueue.length
        }));
    }

    if (req.url === '/compute') {
        const startTime = Date.now();

        queueTask((data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                result: data.result,
                duration: `${(Date.now() - startTime) / 1000}s`
            }));
        });

        return;
    }

    res.statusCode = 404;
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`Server with ${NUM_WORKERS} workers at http://127.0.0.1:${PORT}`);
});
```

```bash
node worker-pool.js
```

Now the server reuses workers instead of spawning new processes for each request.

---

## Step 6: Using `spawn` for Shell Commands

`fork` is for Node.js scripts. `spawn` runs any command:

Create `spawn-example.js`:

```js
const { spawn } = require('child_process');

// Run 'ls -la' command
const ls = spawn('ls', ['-la']);

ls.stdout.on('data', (data) => {
    console.log('Output:', data.toString());
});

ls.stderr.on('data', (data) => {
    console.error('Error:', data.toString());
});

ls.on('close', (code) => {
    console.log('Process exited with code:', code);
});
```

```bash
node spawn-example.js
```

---

## Summary

| Method | Purpose | Communication |
|---|---|---|
| `fork(script)` | Run Node.js file in child process | `send()` / `on('message')` |
| `spawn(cmd, args)` | Run any command | Streams (stdout, stderr) |
| `exec(cmd)` | Run command, buffer output | Callback with full output |

| Pattern | When to use |
|---|---|
| Single fork | One-off heavy task |
| Worker pool | Many concurrent heavy tasks |
| Spawn | Run shell commands |

### Key Takeaways

- **Never** run CPU-intensive code in the main thread of a server
- Use `fork()` to offload work to child processes
- Child processes communicate via `send()` and `on('message')`
- Worker pools are more efficient than forking per-request
- The main thread stays responsive while children do heavy work
