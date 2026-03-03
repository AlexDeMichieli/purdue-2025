# Lesson 02 Demo 01 — Working with Requests and Responses

**Objective:** Work with HTTP requests and responses — managing headers, routing, redirection, and parsing query parameters for client-server communication.

**Tools:** VS Code, npm

**Prerequisites:** Completion of Demo 02, basic Linux and npm knowledge

---

## Step 1: Create a Basic Server

Set up a minimal HTTP server in `index.js`:

```js
const http = require('http');
const SERVER_PORT = 3000;
const SERVER_HOSTNAME = "127.0.0.1";

const server = http.createServer();

server.on("listening", () => console.log("Server listening"));
server.on("error", (err) => console.log("Server error:", err.message));
server.on("request", (req, res) => {
  // all request handling goes here
});

server.listen(SERVER_PORT, SERVER_HOSTNAME, () => {
  console.log(`Server is up and listening on port ${SERVER_PORT}`);
});
```

```bash
node index.js
```

The `request` event fires every time a client (browser, curl, etc.) connects to the server. The callback receives two objects:
- **`req`** (IncomingMessage) — information about the incoming request (URL, headers, method)
- **`res`** (ServerResponse) — methods to send data back to the client

---

## Step 2: Send a Response

The `Content-Type` header tells the browser how to interpret the response body. Replace the request handler to try each format.

### Plain Text

```js
server.on("request", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, this is a plain text response");
});
```

### HTML

```js
server.on("request", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<html><body><h2>Node Server</h2><p>Serving HTML</p></body></html>");
});
```

### JSON

```js
server.on("request", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    platform: process.platform,
    date: new Date(),
    message: "Hello from the server"
  }));
});
```

Visit `http://127.0.0.1:3000` after each change to see the difference.

> Restart the server (`Ctrl+C` then `node index.js`) after every code change — Node.js doesn't hot-reload by default.

---

## Step 3: Request and Response Headers

Headers carry metadata about the request and response. You can read incoming headers from `req` and set outgoing headers on `res`.

```js
server.on("request", (req, res) => {
  // Read headers from the incoming request
  const { headers, method, url } = req;
  const userAgent = headers["user-agent"];

  // Set response headers
  res.writeHead(200, {
    "Content-Type": "application/json",
    "X-Powered-By": "Node.js"
  });

  res.end(JSON.stringify({
    platform: process.platform,
    requestMethod: method,
    requestUrl: url,
    userAgent: userAgent,
    date: new Date()
  }));
});
```

Common request headers you can inspect: `user-agent`, `accept`, `content-type`, `authorization`, `host`.

---

## Step 4: Route the Requests

Routing means responding differently based on the request URL. Use `req.url` and conditional logic.

```js
server.on("request", (req, res) => {
  const url = req.url;

  if (url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end("<html><body><h1>Welcome to My App</h1></body></html>");
  }

  if (url === "/quote") {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end("<html><body><h1>Search the Candle rather than cursing the Darkness</h1></body></html>");
  }

  // 404 for anything else
  res.writeHead(404, { "Content-Type": "text/plain" });
  return res.end("404 Not Found");
});
```

Note the `return` before each `res.end()` — this prevents the code from falling through and trying to send multiple responses (which would crash the server).

The 404 fallback at the bottom handles any URL that doesn't match a known route.

---

## Step 5: Redirect the Requests

A redirect tells the browser to go to a different URL. Set a `3xx` status code and a `Location` header.

Add this **before** the 404 fallback in the routing code above:

```js
if (url === "/api") {
  res.writeHead(302, { Location: "/" });
  return res.end();
}
```

| Status Code | Meaning | When to use |
|---|---|---|
| `301` | Moved Permanently | URL has changed forever (browsers cache this) |
| `302` | Found (Temporary) | Temporary redirect (e.g., after login) |
| `307` | Temporary Redirect | Like 302 but preserves the HTTP method |

---

## Step 6: Parse Query Parameters

Query parameters are the `?key=value&key2=value2` part of a URL. Node's built-in `URLSearchParams` is the cleanest way to parse them.

```js
server.on("request", (req, res) => {
  // Extract query string from the URL
  const queryString = req.url.split("?")[1] || "";
  const params = new URLSearchParams(queryString);

  // Convert to a plain object
  const queryObj = Object.fromEntries(params);

  res.writeHead(200, { "Content-Type": "application/json" });
  return res.end(JSON.stringify(queryObj));
});
```

Test it: `http://127.0.0.1:3000?name=Alex&role=dev` returns `{"name":"Alex","role":"dev"}`.

---

## Complete Example

Here's a single `index.js` that combines routing, redirects, headers, and query parsing:

```js
const http = require("http");
const PORT = 3000;

const server = http.createServer((req, res) => {
  const [path, queryString] = req.url.split("?");

  if (path === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end("<html><body><h1>Welcome to My App</h1></body></html>");
  }

  if (path === "/quote") {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end("<html><body><h1>Search the Candle rather than cursing the Darkness</h1></body></html>");
  }

  if (path === "/api") {
    res.writeHead(302, { Location: "/" });
    return res.end();
  }

  if (path === "/search") {
    const params = new URLSearchParams(queryString);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      query: Object.fromEntries(params),
      userAgent: req.headers["user-agent"]
    }));
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  return res.end("404 Not Found");
});

server.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
```

Test the routes:
- `http://127.0.0.1:3000/` — Welcome page
- `http://127.0.0.1:3000/quote` — Quote page
- `http://127.0.0.1:3000/api` — Redirects to `/`
- `http://127.0.0.1:3000/search?name=Alex&role=dev` — Returns JSON query params
- `http://127.0.0.1:3000/anything-else` — 404

---

## Summary

| Concept | Key API | What it does |
|---|---|---|
| Create server | `http.createServer(callback)` | Starts listening for HTTP requests |
| Read request info | `req.url`, `req.method`, `req.headers` | Inspect what the client sent |
| Set response type | `res.writeHead(status, headers)` | Set status code and headers |
| Send response | `res.end(body)` | Send body and finish the response |
| Route | `if (req.url === "/path")` | Serve different content per URL |
| Redirect | `res.writeHead(302, { Location: url })` | Send client to a different URL |
| Parse query params | `new URLSearchParams(queryString)` | Extract `?key=value` pairs |
