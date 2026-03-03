# Lesson 06 Demo 03 — Deploying a Node.js Application

**Objective:** Deploy a Node.js application to the web using GitHub and Vercel, making it accessible from any browser.

**Tools:** VS Code, npm, Git, GitHub account, Vercel account

**Prerequisites:** Basic Git commands, GitHub and Vercel accounts

---

## What is Deployment?

Deployment means taking your local application and hosting it on a server so anyone on the internet can access it. We'll use:

- **GitHub** — to store and version control our code
- **Vercel** — a cloud platform that automatically deploys from GitHub

Vercel is free for personal projects and handles HTTPS, scaling, and continuous deployment automatically.

---

## Step 1: Create the Node.js Application

```bash
mkdir deploying
cd deploying
npm init -y
touch index.js
code .
```

Write the following in `index.js`:

```js
const http = require('http');

const server = http.createServer((req, res) => {
    const url = req.url;

    if (url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
            <head><title>My Node App</title></head>
            <body>
                <h1>Hello from Node.js!</h1>
                <p>Deployed on Vercel</p>
                <nav>
                    <a href="/about">About</a> |
                    <a href="/api/status">API Status</a>
                </nav>
            </body>
            </html>
        `);
        return;
    }

    if (url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<html><body><h1>About</h1><p>A simple Node.js app.</p></body></html>');
        return;
    }

    if (url === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'online',
            timestamp: new Date().toISOString(),
            node: process.version
        }));
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
});

// Use PORT from environment (Vercel sets this) or default to 3000
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

Update `package.json` to include a start script:

```json
{
  "name": "deploying",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  }
}
```

Test locally:

```bash
npm start
```

Visit `http://localhost:3000` to verify it works.

---

## Step 2: Configure for Vercel

Create a `vercel.json` file to tell Vercel how to run your app:

```bash
touch vercel.json
```

Add the following:

```json
{
  "version": 2,
  "builds": [
    { "src": "index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "index.js" }
  ]
}
```

This tells Vercel:
- Use the Node.js runtime for `index.js`
- Route all requests (`/(.*)`) to your server

---

## Step 3: Initialize Git and Push to GitHub

Create a `.gitignore` to exclude `node_modules`:

```bash
echo "node_modules" > .gitignore
```

Initialize Git and commit:

```bash
git init
git add .
git commit -m "Initial commit: Node.js app ready for deployment"
```

### Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click **New repository** (or the "+" icon → "New repository")
3. Name it `node-deploy-demo` (or any name you prefer)
4. Leave it **public** (or private if you prefer)
5. **Don't** initialize with README (we already have files)
6. Click **Create repository**

### Push Your Code

GitHub will show instructions. Run these commands (replace `YOUR_USERNAME`):

```bash
git remote add origin https://github.com/YOUR_USERNAME/node-deploy-demo.git
git branch -M main
git push -u origin main
```

When prompted for credentials:
- **Username:** Your GitHub username
- **Password:** Use a Personal Access Token (not your password)

### Generate a Personal Access Token (if needed)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **Generate new token (classic)**
3. Give it a name like "Vercel Deploy"
4. Select the `repo` scope
5. Click **Generate token**
6. Copy the token and use it as your password when pushing

---

## Step 4: Deploy on Vercel

### Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project**
3. Find your `node-deploy-demo` repository and click **Import**

### Configure the Project

Vercel should auto-detect the settings from `vercel.json`. If prompted:

- **Framework Preset:** Other
- **Build Command:** (leave empty)
- **Output Directory:** (leave empty)
- **Install Command:** `npm install`

Click **Deploy**.

### Wait for Deployment

Vercel will:
1. Clone your repository
2. Install dependencies
3. Build and deploy your app

This takes about 30-60 seconds.

---

## Step 5: Access Your Live App

Once deployed, Vercel provides a URL like:

```
https://node-deploy-demo.vercel.app
```

Click it to see your app running live on the internet!

### Test the Routes

- `https://your-app.vercel.app/` — Home page
- `https://your-app.vercel.app/about` — About page
- `https://your-app.vercel.app/api/status` — JSON API

---

## Step 6: Automatic Deployments

The best part: Vercel auto-deploys when you push changes.

Make a change to `index.js`:

```js
// Change the home page message
res.end(`
    <html>
    <head><title>My Node App</title></head>
    <body>
        <h1>Hello from Node.js! (Updated)</h1>
        ...
    </body>
    </html>
`);
```

Push to GitHub:

```bash
git add .
git commit -m "Update home page message"
git push
```

Vercel automatically detects the push and redeploys. Within a minute, your live site is updated.

---

## Project Structure

Your final project should look like:

```
deploying/
├── index.js          # Your Node.js server
├── package.json      # Project metadata and scripts
├── vercel.json       # Vercel deployment configuration
├── .gitignore        # Excludes node_modules from git
└── node_modules/     # Dependencies (not committed)
```

---

## Summary

| Step | What it does |
|---|---|
| Create app | Build a Node.js HTTP server locally |
| Add `vercel.json` | Configure how Vercel runs your app |
| Initialize Git | Version control your project |
| Push to GitHub | Store code in a remote repository |
| Import to Vercel | Connect Vercel to your GitHub repo |
| Deploy | Vercel builds and hosts your app |
| Auto-deploy | Future pushes trigger automatic redeployment |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| "Permission denied" on push | Use a Personal Access Token instead of password |
| Vercel build fails | Check the build logs in Vercel dashboard |
| App shows "500 error" | Check `vercel.json` routing matches your code |
| Port issues | Always use `process.env.PORT || 3000` |
