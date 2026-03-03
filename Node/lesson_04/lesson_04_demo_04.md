# Lesson 04 Demo 04 — Practical EventEmitter Patterns

**Objective:** Build a custom class that extends `EventEmitter` to see how Node.js modules like `http.Server` and `fs.ReadStream` work internally — applied through a file download tracker.

**Tools:** VS Code, npm

**Prerequisites:** Completion of Demo 03

---

## Why Extend EventEmitter?

In Demo 03 we used `EventEmitter` directly. In practice, you rarely do that — instead, you create a **class** that extends `EventEmitter` and emits events as part of its own logic. This is exactly how Node's built-in modules work:

- `http.Server` extends `EventEmitter` → emits `'request'`, `'error'`
- `fs.ReadStream` extends `EventEmitter` → emits `'data'`, `'end'`, `'error'`
- `process` is an `EventEmitter` → emits `'exit'`, `'uncaughtException'`

In this demo we'll build a `DownloadTracker` that emits `'start'`, `'progress'`, `'complete'`, and `'error'` events.

---

## Step 1: Create a Custom EventEmitter Class

Use the same `eventDemo` directory from the previous demo. Replace `index.js` with:

```js
const { EventEmitter } = require('events');

class DownloadTracker extends EventEmitter {
    constructor(fileName, totalSize) {
        super(); // must call super() to initialize EventEmitter
        this.fileName = fileName;
        this.totalSize = totalSize;
        this.downloaded = 0;
    }
}

const download = new DownloadTracker('video.mp4', 100);

download.on('start', () => {
    console.log(`Starting download: ${download.fileName}`);
});

download.emit('start');
```

```bash
node index.js
```

`super()` calls the `EventEmitter` constructor, which sets up the internal listener registry. Without it, `.on()` and `.emit()` would not work. The class now has all `EventEmitter` methods plus its own properties (`fileName`, `totalSize`, `downloaded`).

---

## Step 2: Simulate Progress Events

Add a method to the class that simulates downloading in chunks and emits progress events.

Replace `index.js` with:

```js
const { EventEmitter } = require('events');

class DownloadTracker extends EventEmitter {
    constructor(fileName, totalSize) {
        super();
        this.fileName = fileName;
        this.totalSize = totalSize;
        this.downloaded = 0;
    }

    start() {
        this.emit('start', this.fileName);

        const chunkSize = 25;
        const interval = setInterval(() => {
            this.downloaded += chunkSize;
            const percent = Math.min((this.downloaded / this.totalSize) * 100, 100);

            this.emit('progress', percent);

            if (this.downloaded >= this.totalSize) {
                clearInterval(interval);
                this.emit('complete', this.fileName);
            }
        }, 500);
    }
}

const download = new DownloadTracker('video.mp4', 100);

download.on('start', (file) => {
    console.log(`[START] Downloading ${file}...`);
});

download.on('progress', (percent) => {
    console.log(`[PROGRESS] ${percent}%`);
});

download.on('complete', (file) => {
    console.log(`[COMPLETE] ${file} finished downloading`);
});

download.start();
```

```bash
node index.js
```

The class emits events from inside its own methods. The consumer (the code that calls `download.start()`) doesn't need to know how the download works — it just listens for events. This is the same pattern you use with streams: `stream.on('data', ...)`, `stream.on('end', ...)`.

---

## Step 3: Handle Errors

Add error handling to the class. If a download "fails" midway, emit an `'error'` event.

Replace `index.js` with:

```js
const { EventEmitter } = require('events');

class DownloadTracker extends EventEmitter {
    constructor(fileName, totalSize) {
        super();
        this.fileName = fileName;
        this.totalSize = totalSize;
        this.downloaded = 0;
    }

    start() {
        this.emit('start', this.fileName);

        const chunkSize = 25;
        const interval = setInterval(() => {
            this.downloaded += chunkSize;
            const percent = Math.min((this.downloaded / this.totalSize) * 100, 100);

            // Simulate a network failure at 50%
            if (percent === 50) {
                clearInterval(interval);
                this.emit('error', new Error(`Network timeout downloading ${this.fileName}`));
                return;
            }

            this.emit('progress', percent);

            if (this.downloaded >= this.totalSize) {
                clearInterval(interval);
                this.emit('complete', this.fileName);
            }
        }, 500);
    }
}

const download = new DownloadTracker('video.mp4', 100);

download.on('start', (file) => console.log(`[START] ${file}`));
download.on('progress', (pct) => console.log(`[PROGRESS] ${pct}%`));
download.on('complete', (file) => console.log(`[COMPLETE] ${file}`));

// Must register an 'error' listener — without it, Node crashes
download.on('error', (err) => {
    console.error(`[ERROR] ${err.message}`);
});

download.start();
```

```bash
node index.js
```

The download starts, reports 25%, then fails at 50% with a caught error. Remove the `download.on('error', ...)` listener and run it again to see Node crash with an unhandled error — this is why error listeners are mandatory.

---

## Step 4: Use `once` for Cleanup

Use `.once()` to run cleanup logic exactly one time when the download finishes or fails, regardless of how many progress events fired.

Replace `index.js` with:

```js
const { EventEmitter } = require('events');

class DownloadTracker extends EventEmitter {
    constructor(fileName, totalSize) {
        super();
        this.fileName = fileName;
        this.totalSize = totalSize;
        this.downloaded = 0;
    }

    start() {
        this.emit('start', this.fileName);

        const chunkSize = 25;
        const interval = setInterval(() => {
            this.downloaded += chunkSize;
            const percent = Math.min((this.downloaded / this.totalSize) * 100, 100);

            this.emit('progress', percent);

            if (this.downloaded >= this.totalSize) {
                clearInterval(interval);
                this.emit('complete', this.fileName);
            }
        }, 500);
    }
}

const download = new DownloadTracker('video.mp4', 100);

download.on('start', (file) => console.log(`[START] ${file}`));
download.on('progress', (pct) => console.log(`[PROGRESS] ${pct}%`));

// once: runs exactly one time, then removes itself
download.once('complete', (file) => {
    console.log(`[CLEANUP] Removing temp files for ${file}`);
});

download.once('complete', (file) => {
    console.log(`[DONE] ${file} is ready to play`);
});

download.start();
```

```bash
node index.js
```

Both `.once()` listeners fire when `'complete'` is emitted, but they would not fire again if `'complete'` were emitted a second time. This is useful for teardown logic — closing connections, deleting temp files, or sending a final notification.

---

## Summary

| Pattern | Example | Why it matters |
|---|---|---|
| Extend `EventEmitter` | `class Foo extends EventEmitter` | How `http.Server`, streams, and other Node modules work |
| Emit from methods | `this.emit('progress', data)` | Class controls when events fire; consumers just listen |
| `'error'` event | `this.emit('error', new Error())` | Unhandled `'error'` crashes Node — always add a listener |
| `.once()` for cleanup | `download.once('complete', ...)` | One-time teardown that auto-removes after firing |
| Progress reporting | `emitter.on('progress', ...)` | Real-time updates without polling |

> **Key takeaway:** When you see `.on('data', ...)` or `.on('error', ...)` anywhere in Node.js, you're using `EventEmitter`. Building your own emitter class is the same pattern — just applied to your own domain.
