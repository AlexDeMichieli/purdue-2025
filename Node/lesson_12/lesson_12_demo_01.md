# Lesson 12 Demo 01 — Installing Cypress and Testing with the Launchpad

**Objective:** Install Cypress and use the Launchpad to run automated end-to-end tests for web applications

**Tools:** VS Code, Node.js, npm, Cypress

**Prerequisites:** Node.js, npm, basic understanding of web applications

---

## Overview

Cypress is a modern end-to-end testing framework for web applications. Unlike traditional testing tools that run outside the browser, Cypress runs directly in the browser alongside your application, giving you fast, reliable, and easy-to-debug tests.

### Why Cypress?

| Feature | Benefit |
|---------|---------|
| **Real-time reloading** | See changes instantly as you write tests |
| **Automatic waiting** | No need for sleep/wait commands |
| **Time travel** | Hover over commands to see what happened at each step |
| **Debuggability** | Use Chrome DevTools while tests run |
| **Screenshots & videos** | Automatic capture of failures |

---

## Step 1: Project Setup

Create a new project directory:

```bash
mkdir cypress-demo
cd cypress-demo
```

Initialize a Node.js project:

```bash
npm init -y
```

This creates a `package.json` file with default settings.

---

## Step 2: Install Cypress

Install Cypress as a development dependency:

```bash
npm install cypress --save-dev
```

**What's happening:** Cypress is downloaded and installed. The first installation may take a few minutes as it downloads the Cypress binary (~400MB).

After installation, your `package.json` will include:

```json
{
  "devDependencies": {
    "cypress": "^13.6.0"
  }
}
```

### 2.1 Add helpful npm scripts

Open `package.json` and add these scripts:

```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "test": "cypress run"
  }
}
```

Now you can use:
- `npm run cypress:open` — Opens Cypress Launchpad (GUI)
- `npm run cypress:run` — Runs tests headlessly (CI/CD)
- `npm test` — Alias for running tests

---

## Step 3: Open Cypress Launchpad

Launch Cypress for the first time:

```bash
npx cypress open
```

Or using the npm script:

```bash
npm run cypress:open
```

**What happens on first launch:**
1. Cypress creates a default folder structure
2. The Cypress Launchpad GUI opens
3. Example test files are generated

### 3.1 Understand the Launchpad options

The Launchpad presents two testing types:

| Type | Purpose | Use Case |
|------|---------|----------|
| **E2E Testing** | Test full user workflows | Login flows, checkout processes, navigation |
| **Component Testing** | Test individual React/Vue components | Isolated component behavior |

For this demo, we'll use **E2E Testing**.

---

## Step 4: Configure E2E Testing

### 4.1 Initial setup

1. Click **E2E Testing** in the Launchpad
2. Cypress will create configuration files:
   - `cypress.config.js` — Main configuration
   - `cypress/support/e2e.js` — Global commands and hooks
   - `cypress/support/commands.js` — Custom commands

3. Click **Continue** to proceed

### 4.2 Select a browser

Cypress supports multiple browsers:
- ✅ Chrome
- ✅ Edge
- ✅ Firefox
- ✅ Electron (default, headless)

Select **Chrome** and click **Start E2E Testing in Chrome**

---

## Step 5: Create Your First Test Spec

### 5.1 Create a new spec

1. Click **Create new spec** in the specs list
2. Cypress suggests a filename (e.g., `spec.cy.js`)
3. Click **Create Spec**
4. Click **Okay, run the spec**

Cypress will:
- Create the file at `cypress/e2e/spec.cy.js`
- Open Chrome
- Run the default test

### 5.2 Understand the default test

The generated test looks like this:

```js
describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})
```

**What it does:** Visits a URL and confirms the page loads (no assertions, so it passes if no errors occur).

---

## Step 6: Write Your First Real Test

Open the project in VS Code:

```bash
code .
```

### 6.1 Edit the test spec

Navigate to `cypress/e2e/spec.cy.js` and replace the content with:

```js
describe('My First Cypress Test', () => {
  it('visits the Cypress example site', () => {
    // Visit the page
    cy.visit('https://example.cypress.io')
    
    // Verify the page title
    cy.title().should('include', 'Kitchen Sink')
    
    // Find and click a link
    cy.contains('type').click()
    
    // Verify the URL changed
    cy.url().should('include', '/commands/actions')
    
    // Verify an element exists
    cy.get('.action-email').should('be.visible')
  })
})
```

### 6.2 Run the updated test

If Cypress is still open, it will automatically detect the changes and re-run the test.

If you closed Cypress, reopen it:

```bash
npm run cypress:open
```

Then click on `spec.cy.js` to run it.

**What's happening:**
1. Cypress loads the example site
2. Clicks the "type" link
3. Verifies the URL changed
4. Checks that an email input exists

---

## Step 7: Understand Cypress Test Structure

### 7.1 Basic structure

```js
describe('Test Suite Name', () => {
  it('Test Case Description', () => {
    // Test code here
  })
})
```

| Command | Purpose |
|---------|---------|
| `describe()` | Groups related tests (test suite) |
| `it()` | Individual test case |
| `cy.*` | Cypress commands for interacting with the page |

### 7.2 Common Cypress commands

| Command | Purpose | Example |
|---------|---------|---------|
| `cy.visit(url)` | Navigate to a URL | `cy.visit('https://example.com')` |
| `cy.get(selector)` | Select element by CSS selector | `cy.get('#username')` |
| `cy.contains(text)` | Find element by text content | `cy.contains('Submit')` |
| `cy.click()` | Click an element | `cy.get('button').click()` |
| `cy.type(text)` | Type into an input | `cy.get('#email').type('test@example.com')` |
| `cy.should()` | Make an assertion | `cy.get('h1').should('be.visible')` |

---

## Step 8: Create a More Advanced Test

Create a new file: `cypress/e2e/form-test.cy.js`

```js
describe('Form Interaction Tests', () => {
  beforeEach(() => {
    // Run before each test — visit the page
    cy.visit('https://example.cypress.io/commands/actions')
  })

  it('fills out and submits a form', () => {
    // Type into email field
    cy.get('.action-email')
      .type('test@example.com')
      .should('have.value', 'test@example.com')
    
    // Type into password field
    cy.get('.action-disabled')
      .should('be.disabled')
    
    // Select from dropdown
    cy.get('.action-select')
      .select('apples')
      .should('have.value', 'fr-apples')
  })

  it('interacts with checkboxes and radio buttons', () => {
    // Check a checkbox
    cy.get('.action-checkboxes [type="checkbox"]')
      .first()
      .check()
      .should('be.checked')
    
    // Uncheck a checkbox
    cy.get('.action-checkboxes [type="checkbox"]')
      .first()
      .uncheck()
      .should('not.be.checked')
    
    // Select a radio button
    cy.get('.action-radios [type="radio"]')
      .first()
      .check()
      .should('be.checked')
  })

  it('performs multiple actions', () => {
    // Type into multiple fields
    cy.get('.action-email').type('user@example.com')
    cy.get('.action-form').find('[type="text"]').type('John Doe')
    
    // Clear a field
    cy.get('.action-email').clear()
    
    // Verify it's empty
    cy.get('.action-email').should('have.value', '')
  })
})
```

Run this test in the Launchpad by clicking on `form-test.cy.js`.

---

## Step 9: Testing a Real Website

Let's test a real-world scenario. Create `cypress/e2e/google-search.cy.js`:

```js
describe('Google Search Test', () => {
  it('searches for Cypress testing', () => {
    // Visit Google
    cy.visit('https://www.google.com')
    
    // Accept cookies if prompted (conditional)
    cy.get('body').then($body => {
      if ($body.find('button:contains("Accept all")').length > 0) {
        cy.contains('button', 'Accept all').click()
      }
    })
    
    // Find search box and type
    cy.get('[name="q"]')
      .type('Cypress testing framework{enter}')
    
    // Verify results loaded
    cy.get('#search').should('exist')
    
    // Verify Cypress appears in results
    cy.contains('Cypress').should('be.visible')
  })
})
```

---

## Step 10: Using Hooks and Setup

Create `cypress/e2e/hooks-demo.cy.js`:

```js
describe('Hooks Demo', () => {
  before(() => {
    // Runs once before all tests in this describe block
    cy.log('Starting test suite')
  })

  beforeEach(() => {
    // Runs before each test
    cy.visit('https://example.cypress.io')
  })

  afterEach(() => {
    // Runs after each test
    cy.log('Test completed')
  })

  after(() => {
    // Runs once after all tests
    cy.log('Test suite complete')
  })

  it('test 1', () => {
    cy.contains('get').should('be.visible')
  })

  it('test 2', () => {
    cy.contains('type').should('be.visible')
  })
})
```

**Hooks execution order:**
1. `before()` — Once at the start
2. `beforeEach()` — Before test 1
3. Test 1 runs
4. `afterEach()` — After test 1
5. `beforeEach()` — Before test 2
6. Test 2 runs
7. `afterEach()` — After test 2
8. `after()` — Once at the end

---

## Step 11: Configure Cypress

Edit `cypress.config.js` at the project root:

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // Base URL for cy.visit()
    baseUrl: 'https://example.cypress.io',
    
    // Viewport size
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Timeout settings
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    
    // Video and screenshot settings
    video: true,
    screenshotOnRunFailure: true,
    
    setupNodeEvents(on, config) {
      // Node event listeners
    },
  },
})
```

Now you can use `cy.visit('/')` instead of `cy.visit('https://example.cypress.io')`.

---

## Step 12: Running Tests Headlessly

Run all tests in the terminal without opening a browser:

```bash
npm run cypress:run
```

Or run a specific test file:

```bash
npx cypress run --spec "cypress/e2e/spec.cy.js"
```

Or run tests in a specific browser:

```bash
npx cypress run --browser chrome
```

**Output:** Cypress runs all tests and generates:
- Test results in the terminal
- Videos in `cypress/videos/`
- Screenshots of failures in `cypress/screenshots/`

---

## Step 13: Understanding the Folder Structure

After setup, your project looks like this:

```
cypress-demo/
├── cypress/
│   ├── e2e/                    # Your test files
│   │   ├── spec.cy.js
│   │   └── form-test.cy.js
│   ├── fixtures/               # Test data (JSON files)
│   │   └── example.json
│   ├── support/                # Helper functions
│   │   ├── commands.js         # Custom commands
│   │   └── e2e.js              # Runs before every test
│   ├── downloads/              # Downloaded files during tests
│   ├── screenshots/            # Failure screenshots
│   └── videos/                 # Test recordings
├── cypress.config.js           # Cypress configuration
├── package.json
└── node_modules/
```

---

## Step 14: Create Custom Commands

Add reusable commands in `cypress/support/commands.js`:

```js
// Custom login command
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login')
  cy.get('#username').type(username)
  cy.get('#password').type(password)
  cy.get('button[type="submit"]').click()
})

// Custom command to check if element contains text
Cypress.Commands.add('containsText', (selector, text) => {
  cy.get(selector).should('contain', text)
})
```

Use them in your tests:

```js
describe('Login Test', () => {
  it('logs in successfully', () => {
    cy.login('testuser', 'password123')
    cy.containsText('.welcome-message', 'Welcome back')
  })
})
```

---

## Summary

### Key Cypress Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `cy.visit(url)` | Navigate to URL | `cy.visit('/')` |
| `cy.get(selector)` | Find element | `cy.get('#submit-btn')` |
| `cy.contains(text)` | Find by text | `cy.contains('Login')` |
| `cy.click()` | Click element | `cy.get('button').click()` |
| `cy.type(text)` | Type into input | `cy.get('#email').type('test@test.com')` |
| `cy.should(assertion)` | Assert condition | `.should('be.visible')` |
| `cy.url()` | Get current URL | `cy.url().should('include', '/dashboard')` |

### Test Structure

```js
describe('Test Suite', () => {
  before(() => {})      // Once before all tests
  beforeEach(() => {})  // Before each test
  afterEach(() => {})   // After each test
  after(() => {})       // Once after all tests
  
  it('test case', () => {
    // Test code
  })
})
```

### Common Assertions

| Assertion | Purpose |
|-----------|---------|
| `.should('exist')` | Element exists in DOM |
| `.should('be.visible')` | Element is visible |
| `.should('have.text', 'Hello')` | Exact text match |
| `.should('contain', 'Hello')` | Contains text |
| `.should('have.value', 'test')` | Input value |
| `.should('be.checked')` | Checkbox is checked |
| `.should('be.disabled')` | Element is disabled |

### Running Tests

| Command | Purpose |
|---------|---------|
| `npx cypress open` | Open Launchpad (GUI) |
| `npx cypress run` | Run all tests headlessly |
| `npx cypress run --spec "path/to/test.cy.js"` | Run specific test |
| `npx cypress run --browser chrome` | Run in specific browser |

### Best Practices

✅ **Use `baseUrl`** in config to avoid repeating full URLs  
✅ **Use `beforeEach()`** to reset state before each test  
✅ **Keep tests independent** — each test should run in isolation  
✅ **Use data attributes** (`data-testid`) for selectors instead of classes  
✅ **Avoid hard-coded waits** — Cypress automatically waits  
✅ **Create custom commands** for repeated actions  
✅ **Organize tests** in logical folders (`cypress/e2e/auth/`, `cypress/e2e/checkout/`)

### Cypress vs Traditional Testing

| Feature | Selenium | Cypress |
|---------|----------|---------|
| **Setup** | Complex | Simple (`npm install`) |
| **Speed** | Slower | Faster |
| **Waiting** | Manual waits | Automatic retry |
| **Debugging** | Difficult | Easy (time travel, DevTools) |
| **Real-time reload** | No | Yes |
| **Browser support** | All browsers | Chrome, Firefox, Edge, Electron |

---

## Challenge Exercise

Build a **Login & Dashboard Test Suite** for a demo app:

**Requirements:**

1. **Test File: `login.cy.js`**
   - Visit login page
   - Fill in credentials
   - Click submit
   - Verify redirect to dashboard
   - Verify welcome message appears

2. **Test File: `navigation.cy.js`**
   - Test all navigation links work
   - Verify each page loads correctly
   - Verify page titles are correct

3. **Test File: `form-validation.cy.js`**
   - Test form with empty fields
   - Test form with invalid email
   - Test form with valid data
   - Verify error messages display correctly

4. **Use hooks** to:
   - Log in before each test
   - Clear cookies after each test

5. **Create custom commands** for:
   - `cy.login(email, password)`
   - `cy.logout()`

**Bonus:** Configure Cypress to run tests on multiple viewports (mobile, tablet, desktop)!

---

## Next Steps

- Test form validation and error handling
- Test API requests with `cy.request()`
- Test file uploads with `cy.fixture()`
- Integrate Cypress with CI/CD (GitHub Actions, GitLab CI)
- Use Cypress Dashboard for test analytics
- Write component tests for React/Vue components
