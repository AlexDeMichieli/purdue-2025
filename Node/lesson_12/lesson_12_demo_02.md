# Lesson 12 Demo 02 — Locating Web Elements Using Cypress

**Objective:** Master different strategies for locating and interacting with web elements using Cypress selectors

**Tools:** VS Code, Node.js, Cypress

**Prerequisites:** Basic understanding of HTML and CSS selectors

---

## Overview

Locating elements is the foundation of any Cypress test. Cypress provides multiple ways to find elements on a page, each with specific use cases.

### Cypress Selector Methods

| Method | Purpose | Use Case |
|--------|---------|----------|
| `cy.get()` | Select by CSS selector | IDs, classes, attributes |
| `cy.contains()` | Find by text content | Buttons, links, labels |
| `cy.find()` | Search within a parent | Scoped searches |
| `cy.first()` / `cy.last()` | Get first/last match | Lists, tables |
| `cy.eq()` | Get element by index | Specific item in collection |
| `cy.filter()` | Filter elements | Conditional selection |
| `cy.not()` | Exclude elements | Negative selection |
| `cy.parent()` / `cy.children()` | Traverse DOM | Navigation within elements |

---

## Step 1: Project Setup

If you don't already have a Cypress project from Demo 01, create one:

```bash
mkdir cypress-locators-demo
cd cypress-locators-demo
npm init -y
npm install cypress --save-dev
```

Open VS Code:

```bash
code .
```

---

## Step 2: Initialize Cypress and Create Test File

Launch Cypress:

```bash
npx cypress open
```

1. Select **E2E Testing**
2. Click **Continue**
3. Choose **Chrome** browser
4. Click **Create new spec**
5. Name it `locators.cy.js`
6. Click **Create Spec**

---

## Step 3: Basic Selectors - IDs, Classes, and Attributes

Replace the content of `cypress/e2e/locators.cy.js` with:

```js
describe('Cypress Element Locators', () => {
  beforeEach(() => {
    // Visit the Cypress example page before each test
    cy.visit('https://example.cypress.io/commands/actions')
  })

  it('locates elements by ID', () => {
    // Select by ID using #
    cy.get('#email1')
      .type('test@example.com')
      .should('have.value', 'test@example.com')
  })

  it('locates elements by class', () => {
    // Select by class using .
    cy.get('.action-email')
      .clear()
      .type('hello@cypress.io')
      .should('have.value', 'hello@cypress.io')
  })

  it('locates elements by attribute', () => {
    // Select by any attribute using [attribute="value"]
    cy.get('[type="email"]')
      .first()
      .type('attribute@test.com')
    
    // Select by data attribute (recommended)
    cy.get('[data-testid="submit-btn"]').should('exist')
  })

  it('locates elements by tag name', () => {
    // Select all input elements
    cy.get('input[type="email"]')
      .should('have.length.at.least', 1)
  })
})
```

Save the file and watch Cypress automatically run the tests.

**What's happening:** 
- `#id` selects by ID (most specific)
- `.class` selects by class name
- `[attribute="value"]` selects by any HTML attribute
- `tag` selects by HTML tag

---

## Step 4: Text-Based Selectors

Add these tests to your file:

```js
describe('Text-Based Locators', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io')
  })

  it('finds elements by exact text', () => {
    // Find element containing exact text
    cy.contains('type').click()
    
    // Verify URL changed
    cy.url().should('include', '/commands/actions')
  })

  it('finds elements by partial text', () => {
    // Contains works with partial matches
    cy.contains('Querying').click()
    cy.url().should('include', '/commands/querying')
  })

  it('finds specific elements with text', () => {
    // Combine selector with text
    cy.contains('a', 'type').should('have.attr', 'href')
    cy.contains('button', 'Submit').should('exist')
  })

  it('finds elements with regex', () => {
    // Use regular expressions for flexible matching
    cy.contains(/^type$/i).should('be.visible')
  })
})
```

**Key points:**
- `cy.contains()` is one of the most powerful Cypress commands
- It finds elements by text content
- You can combine it with a selector: `cy.contains('button', 'Submit')`
- It supports regular expressions for pattern matching

---

## Step 5: Chaining and Traversal

Add these tests:

```js
describe('Chaining and DOM Traversal', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/traversal')
  })

  it('chains selectors for precise targeting', () => {
    // Find within a specific form
    cy.get('form')
      .find('input[type="text"]')
      .first()
      .type('Chained selection')
  })

  it('uses parent-child relationships', () => {
    // Get parent of an element
    cy.get('.breadcrumb-item')
      .parent()
      .should('have.class', 'breadcrumb')
    
    // Get children of an element
    cy.get('.list-group')
      .children()
      .should('have.length.at.least', 1)
  })

  it('selects siblings', () => {
    // Get next sibling
    cy.get('.traversal-next-sibling')
      .next()
      .should('contain', 'sibling')
    
    // Get previous sibling
    cy.get('.traversal-prev-sibling')
      .prev()
      .should('exist')
  })

  it('traverses up to find ancestors', () => {
    // Find closest parent matching selector
    cy.get('.traversal-list')
      .closest('.container')
      .should('exist')
    
    // Find all matching parents
    cy.get('.traversal-list')
      .parents()
      .should('have.length.at.least', 4)
  })
})
```

**Traversal commands:**
- `.find()` — Search within element
- `.parent()` — Get parent element
- `.children()` — Get child elements
- `.next()` / `.prev()` — Get siblings
- `.closest()` — Find nearest ancestor matching selector

---

## Step 6: Filtering and Selection

Add these tests:

```js
describe('Filtering and Selection', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/querying')
  })

  it('selects first and last elements', () => {
    // Get first element
    cy.get('.query-list li')
      .first()
      .should('contain', 'apples')
    
    // Get last element
    cy.get('.query-list li')
      .last()
      .should('contain', 'grapes')
  })

  it('selects elements by index', () => {
    // Get element at specific index (0-based)
    cy.get('.query-list li')
      .eq(1)
      .should('contain', 'oranges')
    
    // Get third element
    cy.get('.query-list li')
      .eq(2)
      .should('contain', 'bananas')
  })

  it('filters elements', () => {
    // Filter by class
    cy.get('.query-list li')
      .filter('.third')
      .should('contain', 'bananas')
    
    // Filter by attribute
    cy.get('button')
      .filter('[disabled]')
      .should('exist')
  })

  it('excludes elements with not()', () => {
    // Select all except those matching selector
    cy.get('.query-list li')
      .not('.third')
      .should('have.length', 3)
  })

  it('slices collections', () => {
    // Get elements from index 1 to 3
    cy.get('.query-list li')
      .slice(1, 3)
      .should('have.length', 2)
  })
})
```

**Selection commands:**
- `.first()` — First element in collection
- `.last()` — Last element in collection
- `.eq(index)` — Element at specific index
- `.filter(selector)` — Keep matching elements
- `.not(selector)` — Remove matching elements
- `.slice(start, end)` — Get range of elements

---

## Step 7: Best Practices - Data Attributes

Create a simple HTML test page. Create `cypress/fixtures/test-page.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
</head>
<body>
    <h1>Element Locator Test Page</h1>
    
    <!-- Good: Using data-testid -->
    <button data-testid="submit-button" class="btn btn-primary">
        Submit
    </button>
    
    <!-- Good: Using data-cy (Cypress convention) -->
    <input data-cy="email-input" type="email" placeholder="Email">
    
    <!-- Good: Semantic IDs -->
    <form id="login-form">
        <input data-cy="username" name="username" type="text">
        <input data-cy="password" name="password" type="password">
        <button data-cy="login-btn" type="submit">Log In</button>
    </form>
    
    <!-- Table for advanced selectors -->
    <table data-cy="users-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr data-cy="user-row" data-user-id="1">
                <td>John Doe</td>
                <td>john@example.com</td>
                <td><button data-cy="delete-btn">Delete</button></td>
            </tr>
            <tr data-cy="user-row" data-user-id="2">
                <td>Jane Smith</td>
                <td>jane@example.com</td>
                <td><button data-cy="delete-btn">Delete</button></td>
            </tr>
        </tbody>
    </table>
</body>
</html>
```

Create a test file `cypress/e2e/best-practices.cy.js`:

```js
describe('Locator Best Practices', () => {
  beforeEach(() => {
    // Load local HTML file
    cy.visit('cypress/fixtures/test-page.html')
  })

  it('uses data-cy attributes (recommended)', () => {
    // Cypress-specific data attributes are best
    cy.get('[data-cy="email-input"]')
      .type('test@example.com')
    
    cy.get('[data-cy="submit-button"]')
      .click()
  })

  it('uses data-testid attributes', () => {
    // Generic test attributes work too
    cy.get('[data-testid="submit-button"]')
      .should('be.visible')
  })

  it('combines data attributes with selectors', () => {
    // More specific targeting
    cy.get('form[id="login-form"]')
      .find('[data-cy="username"]')
      .type('testuser')
    
    cy.get('[data-cy="password"]')
      .type('password123')
    
    cy.get('[data-cy="login-btn"]')
      .click()
  })

  it('works with dynamic lists', () => {
    // Get all user rows
    cy.get('[data-cy="user-row"]')
      .should('have.length', 2)
    
    // Target specific user by data attribute
    cy.get('[data-cy="user-row"][data-user-id="1"]')
      .should('contain', 'John Doe')
    
    // Click delete button for specific user
    cy.get('[data-cy="user-row"][data-user-id="2"]')
      .find('[data-cy="delete-btn"]')
      .click()
  })
})
```

---

## Step 8: Advanced Selector Combinations

Create `cypress/e2e/advanced-selectors.cy.js`:

```js
describe('Advanced Selector Techniques', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/querying')
  })

  it('uses multiple selectors', () => {
    // Select by multiple classes
    cy.get('.query-button.btn-primary')
      .should('exist')
  })

  it('uses descendant selectors', () => {
    // Direct child selector
    cy.get('.query-list > li')
      .should('have.length', 4)
    
    // Descendant selector (any level)
    cy.get('.container li')
      .should('have.length.at.least', 4)
  })

  it('uses attribute selectors', () => {
    // Exact match
    cy.get('[type="submit"]').should('exist')
    
    // Contains
    cy.get('[class*="query"]').should('exist')
    
    // Starts with
    cy.get('[class^="query"]').should('exist')
    
    // Ends with
    cy.get('[class$="list"]').should('exist')
  })

  it('uses nth-child selectors', () => {
    // Third child
    cy.get('.query-list li:nth-child(3)')
      .should('contain', 'bananas')
    
    // Even children
    cy.get('.query-list li:nth-child(even)')
      .should('have.length', 2)
    
    // Odd children
    cy.get('.query-list li:nth-child(odd)')
      .should('have.length', 2)
  })

  it('combines multiple conditions', () => {
    // Multiple attributes
    cy.get('button[type="button"][disabled]')
      .should('exist')
    
    // Class and attribute
    cy.get('.query-button[type="button"]')
      .should('exist')
  })
})
```

---

## Step 9: Custom Commands for Reusable Selectors

Add to `cypress/support/commands.js`:

```js
// Custom command to select by data-cy attribute
Cypress.Commands.add('getByCy', (selector) => {
  return cy.get(`[data-cy="${selector}"]`)
})

// Custom command to select by data-testid
Cypress.Commands.add('getByTestId', (selector) => {
  return cy.get(`[data-testid="${selector}"]`)
})

// Custom command to select by role
Cypress.Commands.add('getByRole', (role) => {
  return cy.get(`[role="${role}"]`)
})

// Custom command to find within a section
Cypress.Commands.add('within', { prevSubject: true }, (subject, selector) => {
  return cy.wrap(subject).find(selector)
})
```

Use them in tests:

```js
describe('Custom Selector Commands', () => {
  beforeEach(() => {
    cy.visit('cypress/fixtures/test-page.html')
  })

  it('uses custom data-cy selector', () => {
    cy.getByCy('email-input')
      .type('custom@example.com')
    
    cy.getByCy('submit-button')
      .click()
  })

  it('uses custom data-testid selector', () => {
    cy.getByTestId('submit-button')
      .should('be.visible')
  })

  it('chains custom commands', () => {
    cy.getByCy('users-table')
      .within('tbody tr')
      .should('have.length', 2)
  })
})
```

---

## Step 10: Real-World Application Test

Create `cypress/e2e/form-submission.cy.js`:

```js
describe('Complete Form Submission Flow', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/actions')
  })

  it('completes a full form interaction', () => {
    // Email input
    cy.get('#email1')
      .should('be.visible')
      .type('user@example.com')
      .should('have.value', 'user@example.com')
    
    // Disabled input (verify it's disabled)
    cy.get('.action-disabled')
      .should('be.disabled')
    
    // Dropdown selection
    cy.get('.action-select')
      .select('apples')
      .should('have.value', 'fr-apples')
    
    // Multiple selection
    cy.get('.action-select-multiple')
      .select(['apples', 'oranges', 'bananas'])
    
    // Checkbox interactions
    cy.get('.action-checkboxes [type="checkbox"]')
      .first()
      .check()
      .should('be.checked')
    
    // Radio button selection
    cy.get('.action-radios [type="radio"]')
      .check('radio2', { force: true })
      .should('be.checked')
    
    // Range slider
    cy.get('.action-range')
      .invoke('val', 25)
      .trigger('change')
    
    // File upload
    cy.get('.action-input-hidden')
      .selectFile('cypress/fixtures/example.json', { force: true })
  })

  it('validates form with assertions', () => {
    cy.get('form').within(() => {
      // All within the form context
      cy.get('#email1')
        .type('test@test.com')
        .should('have.value', 'test@test.com')
        .and('have.attr', 'type', 'email')
      
      cy.get('.action-email')
        .should('be.visible')
        .and('not.be.disabled')
    })
  })

  it('handles dynamic content', () => {
    // Wait for element to appear
    cy.get('.action-email', { timeout: 10000 })
      .should('exist')
    
    // Interact with dynamically loaded content
    cy.get('.action-email')
      .type('dynamic@example.com')
  })
})
```

---

## Summary

### Selector Priority (Best to Worst)

| Priority | Selector Type | Example | Why? |
|----------|--------------|---------|------|
| 🥇 Best | `data-cy` / `data-testid` | `[data-cy="submit"]` | Won't change with design |
| 🥈 Good | `id` | `#login-button` | Unique, but may change |
| 🥉 OK | ` contains` with text | `cy.contains('Submit')` | Can break with text changes |
| ⚠️ Fragile | Class names | `.btn-primary` | Design changes break tests |
| ❌ Avoid | Tag + position | `div > p:nth-child(3)` | Extremely fragile |

### Common Selector Methods

| Method | Syntax | Use Case |
|--------|--------|----------|
| `cy.get()` | `cy.get('[data-cy="btn"]')` | Select by CSS |
| `cy.contains()` | `cy.contains('Submit')` | Find by text |
| `cy.find()` | `cy.get('form').find('input')` | Search within parent |
| `cy.filter()` | `.filter('.active')` | Keep matching |
| `cy.not()` | `.not('.disabled')` | Exclude matching |
| `cy.first()` | `.first()` | Get first element |
| `cy.last()` | `.last()` | Get last element |
| `cy.eq()` | `.eq(2)` | Get by index |

### Selector Syntax

```js
// By ID
cy.get('#element-id')

// By class
cy.get('.class-name')

// By attribute
cy.get('[data-cy="value"]')
cy.get('[type="email"]')

// By text
cy.contains('Click me')
cy.contains('button', 'Click me')

// Chaining
cy.get('form').find('input').first()

// Multiple conditions
cy.get('button[type="submit"][disabled]')

// Descendant selectors
cy.get('.parent .child')      // Any descendant
cy.get('.parent > .child')    // Direct child only

// Attribute operators
cy.get('[class^="btn"]')      // Starts with
cy.get('[class$="primary"]')  // Ends with
cy.get('[class*="btn"]')      // Contains
```

### Best Practices

✅ **Use `data-cy` or `data-testid` attributes** for test-specific selectors  
✅ **Prefer IDs and unique attributes** over classes  
✅ **Use `cy.contains()` for buttons and links** when text is stable  
✅ **Chain selectors** to be more specific: `cy.get('form').find('[data-cy="email"]')`  
✅ **Use `.within()`** to scope searches to a specific section  
✅ **Create custom commands** for frequently used selectors  

❌ **Avoid relying on CSS classes** that change with design  
❌ **Don't use overly specific selectors** like `div > p:nth-child(3) > span`  
❌ **Don't rely on text content** that may be translated or change  
❌ **Avoid XPath** — Cypress doesn't support it natively

### Common Patterns

```js
// Form filling pattern
cy.get('form').within(() => {
  cy.get('[data-cy="username"]').type('testuser')
  cy.get('[data-cy="password"]').type('password')
  cy.get('[data-cy="submit"]').click()
})

// Table interaction pattern
cy.get('[data-cy="users-table"]')
  .find('tbody tr')
  .eq(1)
  .find('[data-cy="delete-btn"]')
  .click()

// Dynamic list pattern
cy.get('[data-cy="item"]')
  .should('have.length', 5)
  .first()
  .click()

// Conditional selection pattern
cy.get('button').then($buttons => {
  const $submit = $buttons.filter('[type="submit"]')
  cy.wrap($submit).click()
})
```

---

## Challenge Exercise

Build a **Product Search and Filter Test Suite**:

**Create a test that:**

1. Visits an e-commerce site (use `https://example.cypress.io` or a demo site)

2. **Search functionality:**
   - Locate the search input
   - Type a product name
   - Submit the search
   - Verify results appear

3. **Filtering:**
   - Locate and click category filters
   - Verify filtered results
   - Clear filters

4. **Product interaction:**
   - Find a specific product by name
   - Click "Add to Cart"
   - Verify cart count increases

5. **Use multiple selector strategies:**
   - `data-cy` for test-specific elements
   - `cy.contains()` for buttons
   - `.find()` for scoped searches
   - `.filter()` for conditional selection

6. **Create custom commands:**
   - `cy.searchProduct(name)`
   - `cy.addToCart(productIndex)`
   - `cy.filterByCategory(category)`

**Bonus:** Handle edge cases like no results found, sold-out products, and loading states!

---

## Next Steps

- Learn about Cypress aliases for reusing selectors
- Explore Cypress Testing Library for accessibility-based selectors
- Integrate with visual regression testing
- Use Cypress selector playground for generating selectors
- Build a page object model for large test suites
