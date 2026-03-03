# Lesson 07 Demo 01 — Consuming GitHub API Using Node.js

**Objective:** Fetch GitHub user data in a Node.js application using the GitHub API

**Tools:** VS Code, Node.js

**Prerequisites:** GitHub account

---

## Overview

In this demo, you'll learn how to make HTTP requests to external APIs using Node.js. We'll use the GitHub API to fetch user profile data and display it in the console.

---

## Step 1: Set up a Node.js Project

First, check your Node.js version:

```bash
node --version
```

Create a directory for the project and navigate into it:

```bash
mkdir github-api-demo
cd github-api-demo
```

Initialize a Node.js project:

```bash
npm init -y
```

This creates a `package.json` file with default settings.

---

## Step 2: Install Required Packages

Install Axios — a popular HTTP client for Node.js:

```bash
npm install axios
```

Axios simplifies making HTTP requests compared to Node.js's built-in `http` module.

---

## Step 3: Create a Script to Fetch User Data

Create a file named `index.js`:

```bash
touch index.js
```

Open it in VS Code:

```bash
code .
```

Add the following code to `index.js`:

```js
const axios = require('axios');

async function getUser(username) {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        console.log(response.data);
    } catch (error) {
        console.error('Error fetching user:', error.message);
    }
}

// Replace 'octocat' with your GitHub username
getUser('octocat');
```

### How This Works

- **`axios.get()`** sends a GET request to the GitHub API
- **`await`** waits for the response before continuing
- **`response.data`** contains the user profile information
- **`try/catch`** handles errors (e.g., user not found, network issues)

---

## Step 4: Run the Script

Execute the script:

```bash
node index.js
```

You should see output like:

```json
{
  login: 'octocat',
  id: 583231,
  avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
  name: 'The Octocat',
  company: '@github',
  blog: 'https://github.blog',
  location: 'San Francisco',
  email: null,
  bio: null,
  public_repos: 8,
  followers: 11234,
  following: 9,
  created_at: '2011-01-25T18:44:36Z',
  ...
}
```

---

## Step 5: Customize the Output

Let's display only the most relevant information. Update `index.js`:

```js
const axios = require('axios');

async function getUser(username) {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        const user = response.data;

        console.log('\n=== GitHub User Profile ===');
        console.log(`Name: ${user.name || 'N/A'}`);
        console.log(`Username: ${user.login}`);
        console.log(`Bio: ${user.bio || 'N/A'}`);
        console.log(`Location: ${user.location || 'N/A'}`);
        console.log(`Public Repos: ${user.public_repos}`);
        console.log(`Followers: ${user.followers}`);
        console.log(`Following: ${user.following}`);
        console.log(`Profile: ${user.html_url}`);
        console.log('===========================\n');
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error(`User '${username}' not found.`);
        } else {
            console.error('Error fetching user:', error.message);
        }
    }
}

// Replace 'octocat' with your GitHub username
getUser('octocat');
```

Run it again:

```bash
node index.js
```

Now the output is much cleaner and easier to read.

---

## Step 6: Fetch Data for Multiple Users

Let's fetch data for several users at once:

```js
const axios = require('axios');

async function getUser(username) {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${username}:`, error.message);
        return null;
    }
}

async function getUsersData(usernames) {
    console.log('Fetching user data...\n');

    for (const username of usernames) {
        const user = await getUser(username);
        
        if (user) {
            console.log(`${user.name || user.login} (@${user.login})`);
            console.log(`  Repos: ${user.public_repos} | Followers: ${user.followers}`);
            console.log(`  ${user.html_url}\n`);
        }
    }
}

// Fetch data for multiple users
getUsersData(['octocat', 'torvalds', 'gvanrossum']);
```

```bash
node index.js
```

---

## Step 7: Fetch User Repositories

The GitHub API has many endpoints. Let's fetch a user's repositories:

```js
const axios = require('axios');

async function getUserRepos(username) {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}/repos`);
        const repos = response.data;

        console.log(`\n=== Repositories for @${username} ===\n`);

        repos.slice(0, 5).forEach((repo, index) => {
            console.log(`${index + 1}. ${repo.name}`);
            console.log(`   Description: ${repo.description || 'No description'}`);
            console.log(`   Stars: ${repo.stargazers_count} | Forks: ${repo.forks_count}`);
            console.log(`   URL: ${repo.html_url}\n`);
        });

        console.log(`Total repositories: ${repos.length}\n`);
    } catch (error) {
        console.error('Error fetching repos:', error.message);
    }
}

// Replace with your GitHub username
getUserRepos('octocat');
```

```bash
node index.js
```

---

## Summary

### What You Learned

- How to make HTTP GET requests using Axios
- How to consume REST APIs in Node.js
- How to handle async/await and errors
- How to parse and display JSON data
- How to work with the GitHub API

### GitHub API Endpoints You Used

| Endpoint | Description |
|---|---|
| `GET /users/:username` | Get user profile |
| `GET /users/:username/repos` | Get user repositories |

### Next Steps

- Explore other GitHub API endpoints: [https://docs.github.com/en/rest](https://docs.github.com/en/rest)
- Add authentication using a Personal Access Token for higher rate limits
- Create a CLI tool to search and display GitHub data
- Try other APIs (e.g., weather, cryptocurrency, news)

---

## Challenge Exercise

Create a script that:
1. Accepts a GitHub username as a command-line argument
2. Fetches and displays the user's profile
3. Lists their top 5 most-starred repositories

**Hint:** Use `process.argv[2]` to get command-line arguments and sort repos by `stargazers_count`.
