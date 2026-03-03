# Lesson 13 Demo 01 — Structuring and Executing a Cypress Test Suite with Lifecycle Hooks

**Objective:** Master Cypress test organization using lifecycle hooks for clean setup, reliable execution, and proper teardown

**Tools:** VS Code, Node.js, Cypress

**Prerequisites:** Cypress installed, basic understanding of test structure

---

## Overview

Cypress lifecycle hooks help you organize test setup and teardown logic, making tests more maintainable and reducing code duplication.

### Lifecycle Hooks

| Hook | Runs | Use Case |
|------|------|----------|
| `before()` | Once before all tests in a block | One-time setup (login, database seed) |
| `beforeEach()` | Before each test | Reset state, navigate to page |
| `afterEach()` | After each test | Cleanup, log results, take screenshots |
| `after()` | Once after all tests in a block | Final cleanup, generate reports |

---

## Step 1: Project Setup

If you don't have a Cypress project from previous demos:

```bash
mkdir cypress-hooks-demo
cd cypress-hooks-demo
npm init -y
npm install cypress --save-dev
```

Open VS Code:

```bash
code .
```

---

## Step 2: Understanding Lifecycle Hooks Execution Order

Create `cypress/e2e/hooks-execution.cy.js`:

```js
describe('Lifecycle Hooks Execution Order', () => {
  before(() => {
    console.log('1. before() - Runs ONCE before all tests')
  })

  beforeEach(() => {
    console.log('2. beforeEach() - Runs BEFORE EACH test')
  })

  afterEach(() => {
    console.log('3. afterEach() - Runs AFTER EACH test')
  })

  after(() => {
    console.log('4. after() - Runs ONCE after all tests')
  })

  it('Test 1', () => {
    console.log('   → Running Test 1')
    expect(true).to.be.true
  })

  it('Test 2', () => {
    console.log('   → Running Test 2')
    expect(true).to.be.true
  })
})
```

**Expected console output:**
```
1. before() - Runs ONCE before all tests
2. beforeEach() - Runs BEFORE EACH test
   → Running Test 1
3. afterEach() - Runs AFTER EACH test
2. beforeEach() - Runs BEFORE EACH test
   → Running Test 2
3. afterEach() - Runs AFTER EACH test
4. after() - Runs ONCE after all tests
```

---

## Step 3: Basic Test Suite with Hooks

Create `cypress/e2e/login-suite.cy.js`:

```js
describe('Login Feature Test Suite', () => {
  beforeEach(() => {
    // Setup: Visit the login page before each test
    cy.visit('https://www.saucedemo.com/')
    cy.log('Navigated to login page')
  })

  afterEach(() => {
    // Teardown: Log test completion
    cy.log('Test completed')
  })

  it('should display login form', () => {
    cy.get('[data-test="username"]').should('be.visible')
    cy.get('[data-test="password"]').should('be.visible')
    cy.get('[data-test="login-button"]').should('be.visible')
  })

  it('should allow user to type username', () => {
    cy.get('[data-test="username"]')
      .type('standard_user')
      .should('have.value', 'standard_user')
  })

  it('should allow user to type password', () => {
    cy.get('[data-test="password"]')
      .type('secret_sauce')
      .should('have.value', 'secret_sauce')
  })

  it('should successfully log in with valid credentials', () => {
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()
    
    // Verify successful login
    cy.url().should('include', '/inventory.html')
    cy.get('.title').should('contain', 'Products')
  })

  it('should show error with invalid credentials', () => {
    cy.get('[data-test="username"]').type('invalid_user')
    cy.get('[data-test="password"]').type('wrong_password')
    cy.get('[data-test="login-button"]').click()
    
    // Verify error message
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Username and password do not match')
  })
})
```

Run the tests:

```bash
npx cypress open
```

1. Select **E2E Testing**
2. Choose **Chrome**
3. Click on `login-suite.cy.js`

**What's happening:** `beforeEach()` runs before each test, ensuring every test starts with a fresh page load. `afterEach()` logs completion after each test.

---

## Step 4: Using `before()` and `after()` for Expensive Operations

Create `cypress/e2e/product-suite.cy.js`:

```js
describe('Product Catalog Tests', () => {
  // One-time setup before all tests
  before(() => {
    cy.log('Starting Product Catalog Test Suite')
    
    // Perform expensive one-time operations
    cy.visit('https://www.saucedemo.com/')
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()
    
    // Wait for products to load
    cy.url().should('include', '/inventory.html')
  })

  beforeEach(() => {
    // Return to products page before each test
    cy.visit('https://www.saucedemo.com/inventory.html')
  })

  afterEach(() => {
    // Take screenshot if test fails
    cy.screenshot()
  })

  after(() => {
    // Cleanup: Logout
    cy.get('#react-burger-menu-btn').click()
    cy.get('#logout_sidebar_link').click()
    cy.log('Logged out successfully')
  })

  it('should display all products', () => {
    cy.get('.inventory_item').should('have.length', 6)
  })

  it('should allow adding item to cart', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    cy.get('.shopping_cart_badge').should('have.text', '1')
  })

  it('should show product details', () => {
    cy.get('.inventory_item').first().click()
    cy.get('.inventory_details_name').should('be.visible')
    cy.get('.inventory_details_desc').should('be.visible')
    cy.get('.inventory_details_price').should('be.visible')
  })

  it('should allow sorting products', () => {
    cy.get('[data-test="product_sort_container"]').select('Price (low to high)')
    
    // Verify first item is cheapest
    cy.get('.inventory_item_price')
      .first()
      .should('contain', '$7.99')
  })
})
```

**Key difference:** 
- `before()` logs in once (expensive operation)
- `beforeEach()` just navigates to the products page (fast)
- `after()` logs out once at the end

---

## Step 5: Nested Describe Blocks with Scoped Hooks

Create `cypress/e2e/nested-hooks.cy.js`:

```js
describe('E-Commerce Application', () => {
  before(() => {
    cy.log('Suite Setup: E-Commerce Application')
  })

  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/')
  })

  after(() => {
    cy.log('Suite Teardown: E-Commerce Application')
  })

  // Nested describe block for Login tests
  describe('Login Functionality', () => {
    beforeEach(() => {
      cy.log('Login test starting')
    })

    it('should login with valid credentials', () => {
      cy.get('[data-test="username"]').type('standard_user')
      cy.get('[data-test="password"]').type('secret_sauce')
      cy.get('[data-test="login-button"]').click()
      cy.url().should('include', '/inventory.html')
    })

    it('should reject invalid credentials', () => {
      cy.get('[data-test="username"]').type('invalid_user')
      cy.get('[data-test="password"]').type('wrong_password')
      cy.get('[data-test="login-button"]').click()
      cy.get('[data-test="error"]').should('be.visible')
    })
  })

  // Nested describe block for Shopping Cart
  describe('Shopping Cart', () => {
    beforeEach(() => {
      // Login first
      cy.get('[data-test="username"]').type('standard_user')
      cy.get('[data-test="password"]').type('secret_sauce')
      cy.get('[data-test="login-button"]').click()
      cy.url().should('include', '/inventory.html')
    })

    afterEach(() => {
      // Clear cart after each test
      cy.get('.shopping_cart_link').click()
      cy.get('.cart_item').each(($item) => {
        cy.wrap($item).find('[data-test^="remove"]').click()
      })
    })

    it('should add items to cart', () => {
      cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
      cy.get('.shopping_cart_badge').should('have.text', '1')
      
      cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click()
      cy.get('.shopping_cart_badge').should('have.text', '2')
    })

    it('should remove items from cart', () => {
      // Add items first
      cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
      cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click()
      cy.get('.shopping_cart_badge').should('have.text', '2')
      
      // Remove one item
      cy.get('[data-test="remove-sauce-labs-backpack"]').click()
      cy.get('.shopping_cart_badge').should('have.text', '1')
    })
  })
})
```

**Execution order:**
1. Outer `before()` runs once
2. Outer `beforeEach()` runs before every test
3. Inner `beforeEach()` runs only for tests in that `describe` block
4. Test runs
5. Inner `afterEach()` runs
6. Outer `afterEach()` runs (if present)
7. After all tests, inner `after()` runs
8. Finally, outer `after()` runs

---

## Step 6: Using Hooks for Test Data Setup

Create `cypress/e2e/data-setup.cy.js`:

```js
describe('User Management Tests', () => {
  let testUsers = []

  before(() => {
    // Create test data once
    testUsers = [
      { username: 'standard_user', password: 'secret_sauce', valid: true },
      { username: 'locked_out_user', password: 'secret_sauce', valid: false },
      { username: 'problem_user', password: 'secret_sauce', valid: true }
    ]
    
    cy.log(`Created ${testUsers.length} test users`)
  })

  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/')
  })

  it('should test each user type', () => {
    testUsers.forEach((user) => {
      cy.log(`Testing user: ${user.username}`)
      
      cy.get('[data-test="username"]').clear().type(user.username)
      cy.get('[data-test="password"]').clear().type(user.password)
      cy.get('[data-test="login-button"]').click()
      
      if (user.valid) {
        cy.url().should('include', '/inventory.html')
        cy.visit('https://www.saucedemo.com/') // Go back for next user
      } else {
        cy.get('[data-test="error"]').should('be.visible')
        cy.get('[data-test="error-button"]').click() // Clear error
      }
    })
  })
})
```

---

## Step 7: Conditional Hooks with Test Context

Create `cypress/e2e/conditional-hooks.cy.js`:

```js
describe('Conditional Hook Execution', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/')
  })

  afterEach(function() {
    // Access test context with `this`
    if (this.currentTest.state === 'failed') {
      cy.log('Test failed! Taking screenshot...')
      cy.screenshot(`failed-${this.currentTest.title}`)
    }
  })

  it('should pass successfully', () => {
    cy.get('[data-test="username"]').should('exist')
    expect(true).to.be.true
  })

  it('should fail intentionally', () => {
    cy.get('[data-test="nonexistent-element"]').should('exist')
  })
})
```

**What's happening:** The `afterEach()` hook checks if the test failed and takes a screenshot only when needed.

---

## Step 8: Reusable Hook Patterns

Create `cypress/support/hooks.js`:

```js
// Reusable login hook
export const loginBeforeEach = () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/')
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()
    cy.url().should('include', '/inventory.html')
  })
}

// Reusable logout hook
export const logoutAfterEach = () => {
  afterEach(() => {
    cy.get('#react-burger-menu-btn').click()
    cy.get('#logout_sidebar_link').click()
  })
}

// Reusable screenshot hook
export const screenshotOnFailure = () => {
  afterEach(function() {
    if (this.currentTest.state === 'failed') {
      cy.screenshot(`${this.currentTest.parent.title}--${this.currentTest.title}`)
    }
  })
}
```

Import and use in `cypress/support/e2e.js`:

```js
import './commands'
import { screenshotOnFailure } from './hooks'

// Apply screenshot hook globally
screenshotOnFailure()
```

Use login/logout hooks in tests:

```js
import { loginBeforeEach, logoutAfterEach } from '../support/hooks'

describe('Authenticated User Tests', () => {
  loginBeforeEach()
  logoutAfterEach()

  it('should view products', () => {
    cy.get('.inventory_item').should('have.length.at.least', 1)
  })

  it('should add to cart', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    cy.get('.shopping_cart_badge').should('exist')
  })
})
```

---

## Step 9: Advanced Patterns - Setup and Teardown

Create `cypress/e2e/advanced-hooks.cy.js`:

```js
describe('Advanced Hook Patterns', () => {
  let startTime

  before(() => {
    // Store suite start time
    startTime = Date.now()
    cy.log('Test suite started')
  })

  beforeEach(function() {
    // Store test start time
    this.testStartTime = Date.now()
  })

  afterEach(function() {
    // Calculate test duration
    const duration = Date.now() - this.testStartTime
    cy.log(`Test took ${duration}ms`)
  })

  after(() => {
    // Calculate total suite duration
    const totalDuration = Date.now() - startTime
    cy.log(`Total suite duration: ${totalDuration}ms`)
  })

  it('test 1', () => {
    cy.visit('https://www.saucedemo.com/')
    cy.wait(100)
  })

  it('test 2', () => {
    cy.visit('https://www.saucedemo.com/')
    cy.wait(200)
  })

  it('test 3', () => {
    cy.visit('https://www.saucedemo.com/')
    cy.wait(50)
  })
})
```

---

## Step 10: Complete E-Commerce Test Suite

Create `cypress/e2e/complete-suite.cy.js`:

```js
describe('Complete E-Commerce Test Suite', () => {
  // Global setup
  before(() => {
    cy.log('=== Starting E-Commerce Test Suite ===')
  })

  // Navigate to homepage before each test
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/')
  })

  // Global teardown
  after(() => {
    cy.log('=== E-Commerce Test Suite Complete ===')
  })

  describe('Authentication', () => {
    it('should login successfully', () => {
      cy.get('[data-test="username"]').type('standard_user')
      cy.get('[data-test="password"]').type('secret_sauce')
      cy.get('[data-test="login-button"]').click()
      cy.url().should('include', '/inventory.html')
    })

    it('should show error for invalid credentials', () => {
      cy.get('[data-test="username"]').type('invalid')
      cy.get('[data-test="password"]').type('wrong')
      cy.get('[data-test="login-button"]').click()
      cy.get('[data-test="error"]').should('be.visible')
    })
  })

  describe('Product Browsing', () => {
    beforeEach(() => {
      // Login for product tests
      cy.get('[data-test="username"]').type('standard_user')
      cy.get('[data-test="password"]').type('secret_sauce')
      cy.get('[data-test="login-button"]').click()
    })

    it('should display all products', () => {
      cy.get('.inventory_item').should('have.length', 6)
    })

    it('should sort products by price', () => {
      cy.get('[data-test="product_sort_container"]').select('lohi')
      cy.get('.inventory_item_price').first().should('contain', '$7.99')
    })
  })

  describe('Shopping Cart', () => {
    beforeEach(() => {
      // Login and go to products
      cy.get('[data-test="username"]').type('standard_user')
      cy.get('[data-test="password"]').type('secret_sauce')
      cy.get('[data-test="login-button"]').click()
    })

    afterEach(() => {
      // Clear cart after each test
      cy.get('.shopping_cart_link').click()
      cy.get('body').then(($body) => {
        if ($body.find('.cart_item').length > 0) {
          cy.get('.cart_item').each(() => {
            cy.get('[data-test^="remove"]').first().click()
          })
        }
      })
    })

    it('should add item to cart', () => {
      cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
      cy.get('.shopping_cart_badge').should('have.text', '1')
    })

    it('should remove item from cart', () => {
      cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
      cy.get('[data-test="remove-sauce-labs-backpack"]').click()
      cy.get('.shopping_cart_badge').should('not.exist')
    })
  })

  describe('Checkout', () => {
    beforeEach(() => {
      // Login, add item, go to cart
      cy.get('[data-test="username"]').type('standard_user')
      cy.get('[data-test="password"]').type('secret_sauce')
      cy.get('[data-test="login-button"]').click()
      cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
      cy.get('.shopping_cart_link').click()
    })

    it('should complete checkout flow', () => {
      cy.get('[data-test="checkout"]').click()
      cy.get('[data-test="firstName"]').type('John')
      cy.get('[data-test="lastName"]').type('Doe')
      cy.get('[data-test="postalCode"]').type('12345')
      cy.get('[data-test="continue"]').click()
      cy.get('[data-test="finish"]').click()
      cy.get('.complete-header').should('contain', 'Thank you')
    })
  })
})
```

---

## Summary

### Lifecycle Hook Execution Order

```
before()                    ← Runs once before all tests
├─ beforeEach()             ← Runs before test 1
│  ├─ Test 1
│  └─ afterEach()           ← Runs after test 1
├─ beforeEach()             ← Runs before test 2
│  ├─ Test 2
│  └─ afterEach()           ← Runs after test 2
└─ after()                  ← Runs once after all tests
```

### Hook Comparison

| Hook | Frequency | Use Case | Example |
|------|-----------|----------|---------|
| `before()` | Once (start) | Login, seed database | Setup expensive operations |
| `beforeEach()` | Before each test | Navigate to page, reset state | Ensure clean test state |
| `afterEach()` | After each test | Take screenshots, clear cookies | Cleanup after test |
| `after()` | Once (end) | Logout, generate reports | Final cleanup |

### Best Practices

✅ **Use `beforeEach()` for page navigation** — ensures every test starts fresh  
✅ **Use `before()` for expensive operations** — login once, test many times  
✅ **Keep hooks focused** — each hook should do one thing well  
✅ **Use nested `describe()` blocks** — group related tests with shared setup  
✅ **Clean up in `afterEach()`** — prevent test pollution  
✅ **Name hooks clearly** — add comments explaining what they do  
✅ **Use `after()` sparingly** — failures can prevent it from running  

❌ **Avoid complex logic in hooks** — makes debugging harder  
❌ **Don't rely on test execution order** — each test should be independent  
❌ **Avoid side effects between tests** — clean up properly  
❌ **Don't put assertions in hooks** — assertions belong in tests

### Common Patterns

```js
// Pattern 1: Page navigation
beforeEach(() => {
  cy.visit('/login')
})

// Pattern 2: Authentication
beforeEach(() => {
  cy.visit('/login')
  cy.get('#username').type('testuser')
  cy.get('#password').type('password')
  cy.get('#submit').click()
})

// Pattern 3: Screenshot on failure
afterEach(function() {
  if (this.currentTest.state === 'failed') {
    cy.screenshot()
  }
})

// Pattern 4: Data cleanup
afterEach(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
})

// Pattern 5: Nested hooks for scoped setup
describe('Authenticated tests', () => {
  beforeEach(() => {
    // Login for all tests in this block
  })
  
  describe('Admin features', () => {
    beforeEach(() => {
      // Additional setup for admin tests
    })
  })
})
```

### Hook Scope Rules

```js
describe('Outer', () => {
  before(() => {})       // Runs once for Outer block
  beforeEach(() => {})   // Runs before all tests in Outer
  
  describe('Inner 1', () => {
    beforeEach(() => {}) // Runs before tests in Inner 1 (after Outer beforeEach)
    it('test 1', () => {})
  })
  
  describe('Inner 2', () => {
    beforeEach(() => {}) // Runs before tests in Inner 2 (after Outer beforeEach)
    it('test 2', () => {})
  })
  
  after(() => {})        // Runs once after all tests in Outer
})
```

---

## Challenge Exercise

Build a **Complete User Flow Test Suite** with proper hook usage:

**Requirements:**

1. **Test File Structure:**
   ```
   describe('User Journey')
     ├─ describe('Registration')
     │  ├─ it('validates email format')
     │  └─ it('creates new account')
     ├─ describe('Login')
     │  ├─ it('logs in with new account')
     │  └─ it('remembers user session')
     ├─ describe('Profile Management')
     │  ├─ it('updates profile info')
     │  └─ it('uploads profile picture')
     └─ describe('Logout')
        └─ it('logs out successfully')
   ```

2. **Use hooks appropriately:**
   - `before()` — Set up test data
   - `beforeEach()` — Navigate to starting page
   - `afterEach()` — Clean up state
   - `after()` — Remove test data

3. **Implement:**
   - Reusable custom hooks
   - Screenshot on failure
   - Test duration logging
   - Data cleanup between tests

4. **Ensure:**
   - Tests can run independently
   - Tests can run in any order
   - No test pollution
   - Clear, readable organization

**Bonus:** Create a reusable hook library that can be imported into multiple test files!

---

## Next Steps

- Learn about Cypress fixtures for test data
- Explore Cypress aliases for reusing elements
- Implement custom commands with hooks
- Set up Cypress plugins for enhanced functionality
- Integrate with CI/CD pipelines
- Create parallel test execution strategies
