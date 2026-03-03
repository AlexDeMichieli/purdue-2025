# Lesson 13 Demo 02 — Implementing Page Object Model in Cypress

**Objective:** Master the Page Object Model (POM) pattern to create maintainable, scalable, and reusable Cypress test suites

**Tools:** VS Code, Node.js, Cypress

**Prerequisites:** Basic Cypress knowledge (selectors, commands, hooks)

---

## Overview

The **Page Object Model (POM)** is a design pattern that creates an object-oriented layer between your tests and the web application UI. Instead of writing selectors and actions directly in test files, you encapsulate them in reusable page classes.

### Why Use Page Object Model?

| Without POM | With POM |
|-------------|----------|
| Selectors scattered across tests | Selectors centralized in one place |
| Duplicate code in multiple tests | Reusable methods across tests |
| Hard to maintain when UI changes | Change once, apply everywhere |
| Tests are tightly coupled to UI | Tests focus on business logic |
| Poor readability | Self-documenting, readable tests |

### POM Architecture

```
cypress/
├── e2e/
│   ├── tests/
│   │   ├── login.cy.js          ← Test files (business logic)
│   │   ├── checkout.cy.js
│   │   └── products.cy.js
│   └── pages/
│       ├── LoginPage.js         ← Page Objects (UI interaction)
│       ├── ProductsPage.js
│       └── CheckoutPage.js
```

**Key Concept:** Separate *what* you're testing (business logic) from *how* you interact with the page (selectors and actions).

---

## Step 1: Project Setup

Create a new Cypress project with proper structure:

```bash
mkdir cypress-pom-demo
cd cypress-pom-demo
npm init -y
npm install cypress --save-dev
```

Create the folder structure:

```bash
mkdir -p cypress/e2e/tests
mkdir -p cypress/e2e/pages
```

Open VS Code:

```bash
code .
```

---

## Step 2: Create Your First Page Object

Create `cypress/e2e/pages/LoginPage.js`:

```js
// LoginPage.js - Page Object for Login functionality
class LoginPage {
  // 1. Define selectors as getter methods
  get usernameInput() {
    return cy.get('[data-test="username"]');
  }

  get passwordInput() {
    return cy.get('[data-test="password"]');
  }

  get loginButton() {
    return cy.get('[data-test="login-button"]');
  }

  get errorMessage() {
    return cy.get('[data-test="error"]');
  }

  // 2. Define page actions as methods
  visit() {
    cy.visit('https://www.saucedemo.com/');
    return this; // Enable method chaining
  }

  fillUsername(username) {
    this.usernameInput.clear().type(username);
    return this; // Enable method chaining
  }

  fillPassword(password) {
    this.passwordInput.clear().type(password);
    return this; // Enable method chaining
  }

  clickLogin() {
    this.loginButton.click();
    return this;
  }

  // 3. High-level action that combines steps
  login(username, password) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.clickLogin();
  }

  // 4. Assertion helpers
  verifyLoginSuccess() {
    cy.url().should('include', '/inventory.html');
  }

  verifyErrorMessage(expectedMessage) {
    this.errorMessage.should('contain.text', expectedMessage);
  }
}

export default LoginPage;
```

**What's happening:**
- **Getters** return Cypress commands for elements
- **Methods** encapsulate actions (typing, clicking)
- **`return this`** enables method chaining: `page.visit().fillUsername()`
- **High-level methods** combine multiple steps into one action

---

## Step 3: Write Tests Using Page Objects

Create `cypress/e2e/tests/login.cy.js`:

```js
import LoginPage from '../pages/LoginPage';

describe('Login Test Suite', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    // Navigate to login page before each test
    loginPage.visit();
  });

  it('should login successfully with valid credentials', () => {
    // Use high-level method
    loginPage.login('standard_user', 'secret_sauce');
    
    // Verify success
    loginPage.verifyLoginSuccess();
  });

  it('should show error with invalid username', () => {
    loginPage.login('invalid_user', 'secret_sauce');
    
    loginPage.verifyErrorMessage('Epic sadface: Username and password do not match');
  });

  it('should show error with invalid password', () => {
    loginPage.login('standard_user', 'wrong_password');
    
    loginPage.verifyErrorMessage('Epic sadface: Username and password do not match');
  });

  it('should show error with locked out user', () => {
    loginPage.login('locked_out_user', 'secret_sauce');
    
    loginPage.verifyErrorMessage('Epic sadface: Sorry, this user has been locked out');
  });

  it('should enable method chaining', () => {
    // Chain methods for concise tests
    loginPage
      .visit()
      .fillUsername('standard_user')
      .fillPassword('secret_sauce')
      .clickLogin();
    
    loginPage.verifyLoginSuccess();
  });
});
```

**Benefits:**
- Tests are **readable** — no raw selectors
- Tests focus on **business logic**, not UI details
- If selectors change, update **one file** (LoginPage.js), not all tests

---

## Step 4: Create Additional Page Objects

Create `cypress/e2e/pages/ProductsPage.js`:

```js
class ProductsPage {
  // Selectors
  get title() {
    return cy.get('.title');
  }

  get products() {
    return cy.get('.inventory_item');
  }

  get addToCartButtons() {
    return cy.get('button[id^="add-to-cart"]');
  }

  get shoppingCartBadge() {
    return cy.get('.shopping_cart_badge');
  }

  get shoppingCartLink() {
    return cy.get('.shopping_cart_link');
  }

  // Actions
  verifyPageLoaded() {
    this.title.should('have.text', 'Products');
  }

  addProductToCart(productName) {
    cy.contains('.inventory_item', productName)
      .find('button')
      .click();
    return this;
  }

  verifyCartCount(expectedCount) {
    this.shoppingCartBadge.should('have.text', expectedCount.toString());
  }

  goToCart() {
    this.shoppingCartLink.click();
  }

  getProductPrice(productName) {
    return cy.contains('.inventory_item', productName)
      .find('.inventory_item_price')
      .invoke('text');
  }
}

export default ProductsPage;
```

Create `cypress/e2e/pages/CartPage.js`:

```js
class CartPage {
  get cartItems() {
    return cy.get('.cart_item');
  }

  get checkoutButton() {
    return cy.get('[data-test="checkout"]');
  }

  get continueShoppingButton() {
    return cy.get('[data-test="continue-shopping"]');
  }

  get removeButtons() {
    return cy.get('button[id^="remove"]');
  }

  verifyCartItemExists(productName) {
    cy.contains('.cart_item', productName).should('exist');
  }

  verifyCartItemCount(expectedCount) {
    this.cartItems.should('have.length', expectedCount);
  }

  removeItem(productName) {
    cy.contains('.cart_item', productName)
      .find('button')
      .click();
    return this;
  }

  proceedToCheckout() {
    this.checkoutButton.click();
  }
}

export default CartPage;
```

---

## Step 5: Multi-Page Test Flow

Create `cypress/e2e/tests/shopping-flow.cy.js`:

```js
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';
import CartPage from '../pages/CartPage';

describe('Complete Shopping Flow', () => {
  const loginPage = new LoginPage();
  const productsPage = new ProductsPage();
  const cartPage = new CartPage();

  beforeEach(() => {
    // Login before each test
    loginPage.visit();
    loginPage.login('standard_user', 'secret_sauce');
    productsPage.verifyPageLoaded();
  });

  it('should add single product to cart', () => {
    // Add product
    productsPage.addProductToCart('Sauce Labs Backpack');
    productsPage.verifyCartCount(1);
    
    // Go to cart
    productsPage.goToCart();
    
    // Verify cart contents
    cartPage.verifyCartItemExists('Sauce Labs Backpack');
    cartPage.verifyCartItemCount(1);
  });

  it('should add multiple products to cart', () => {
    productsPage
      .addProductToCart('Sauce Labs Backpack')
      .addProductToCart('Sauce Labs Bike Light')
      .addProductToCart('Sauce Labs Bolt T-Shirt');
    
    productsPage.verifyCartCount(3);
    
    productsPage.goToCart();
    cartPage.verifyCartItemCount(3);
  });

  it('should remove product from cart', () => {
    // Add two products
    productsPage.addProductToCart('Sauce Labs Backpack');
    productsPage.addProductToCart('Sauce Labs Bike Light');
    
    // Go to cart and remove one
    productsPage.goToCart();
    cartPage.removeItem('Sauce Labs Backpack');
    
    // Verify only one remains
    cartPage.verifyCartItemCount(1);
    cartPage.verifyCartItemExists('Sauce Labs Bike Light');
  });
});
```

**Notice:** The test reads like a story, with **no selectors**. All UI details are hidden in page objects.

---

## Step 6: Advanced Techniques - Base Page Class

Create a reusable base page with common functionality:

Create `cypress/e2e/pages/BasePage.js`:

```js
class BasePage {
  // Common navigation
  visit(path = '') {
    cy.visit(`https://www.saucedemo.com${path}`);
    return this;
  }

  // Common waiting
  waitForElement(selector, timeout = 10000) {
    cy.get(selector, { timeout }).should('be.visible');
    return this;
  }

  // Common text verification
  verifyText(selector, expectedText) {
    cy.get(selector).should('have.text', expectedText);
  }

  // Common URL verification
  verifyUrl(expectedUrl) {
    cy.url().should('include', expectedUrl);
  }

  // Common click action
  clickElement(selector) {
    cy.get(selector).click();
    return this;
  }

  // Screenshot helper
  takeScreenshot(name) {
    cy.screenshot(name);
    return this;
  }
}

export default BasePage;
```

Update `LoginPage.js` to extend `BasePage`:

```js
import BasePage from './BasePage';

class LoginPage extends BasePage {
  // Selectors
  get usernameInput() {
    return cy.get('[data-test="username"]');
  }

  get passwordInput() {
    return cy.get('[data-test="password"]');
  }

  get loginButton() {
    return cy.get('[data-test="login-button"]');
  }

  // Override visit to use specific path
  visit() {
    super.visit('/'); // Call parent class method
    return this;
  }

  // Page-specific methods
  login(username, password) {
    this.usernameInput.type(username);
    this.passwordInput.type(password);
    this.loginButton.click();
  }

  verifyLoginSuccess() {
    this.verifyUrl('/inventory.html'); // Use BasePage method
  }
}

export default LoginPage;
```

---

## Step 7: Dynamic Selectors and Parameterization

Create `cypress/e2e/pages/ProductsPageAdvanced.js`:

```js
import BasePage from './BasePage';

class ProductsPageAdvanced extends BasePage {
  // Dynamic selector for any product by name
  getProductByName(productName) {
    return cy.contains('.inventory_item', productName);
  }

  // Dynamic add to cart button for specific product
  getAddToCartButton(productName) {
    return this.getProductByName(productName).find('button');
  }

  // Parameterized actions
  addProductToCart(productName) {
    this.getAddToCartButton(productName).click();
    cy.log(`Added "${productName}" to cart`);
    return this;
  }

  sortProducts(sortOption) {
    const sortOptions = {
      'name-asc': 'az',
      'name-desc': 'za',
      'price-low': 'lohi',
      'price-high': 'hilo'
    };
    
    cy.get('[data-test="product_sort_container"]')
      .select(sortOptions[sortOption]);
    return this;
  }

  verifyProductOrder(expectedOrder) {
    cy.get('.inventory_item_name').then($names => {
      const actualOrder = [...$names].map(el => el.innerText);
      expect(actualOrder).to.deep.equal(expectedOrder);
    });
  }

  verifyProductsContain(searchTerm) {
    cy.get('.inventory_item_name').each($name => {
      cy.wrap($name).should('contain.text', searchTerm);
    });
  }
}

export default ProductsPageAdvanced;
```

Test using advanced page:

```js
import LoginPage from '../pages/LoginPage';
import ProductsPageAdvanced from '../pages/ProductsPageAdvanced';

describe('Advanced Product Tests', () => {
  const loginPage = new LoginPage();
  const productsPage = new ProductsPageAdvanced();

  beforeEach(() => {
    loginPage.visit().login('standard_user', 'secret_sauce');
  });

  it('should sort products by price', () => {
    productsPage.sortProducts('price-low');
    
    // Verify first product is cheapest
    cy.get('.inventory_item_price').first()
      .should('contain', '$7.99');
  });

  it('should add products dynamically', () => {
    const productsToAdd = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Fleece Jacket'
    ];

    // Add all products using loop
    productsToAdd.forEach(product => {
      productsPage.addProductToCart(product);
    });

    // Verify cart count
    cy.get('.shopping_cart_badge').should('have.text', '3');
  });
});
```

---

## Step 8: Page Object with Fixtures

Create test data file `cypress/fixtures/users.json`:

```json
{
  "validUser": {
    "username": "standard_user",
    "password": "secret_sauce"
  },
  "lockedUser": {
    "username": "locked_out_user",
    "password": "secret_sauce"
  },
  "problemUser": {
    "username": "problem_user",
    "password": "secret_sauce"
  },
  "invalidUser": {
    "username": "invalid_user",
    "password": "wrong_password"
  }
}
```

Create `cypress/fixtures/products.json`:

```json
{
  "backpack": {
    "name": "Sauce Labs Backpack",
    "price": "$29.99"
  },
  "bikeLight": {
    "name": "Sauce Labs Bike Light",
    "price": "$9.99"
  },
  "tshirt": {
    "name": "Sauce Labs Bolt T-Shirt",
    "price": "$15.99"
  }
}
```

Use fixtures in tests:

```js
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';

describe('Data-Driven Tests with Fixtures', () => {
  const loginPage = new LoginPage();
  const productsPage = new ProductsPage();

  before(() => {
    // Load fixtures
    cy.fixture('users').as('users');
    cy.fixture('products').as('products');
  });

  it('should login with fixture data', function() {
    // Access fixture data
    const user = this.users.validUser;
    
    loginPage.visit();
    loginPage.login(user.username, user.password);
    productsPage.verifyPageLoaded();
  });

  it('should verify product prices from fixtures', function() {
    const user = this.users.validUser;
    const product = this.products.backpack;

    loginPage.visit().login(user.username, user.password);
    
    productsPage.getProductPrice(product.name).then(actualPrice => {
      expect(actualPrice).to.equal(product.price);
    });
  });

  it('should test multiple users', function() {
    const users = this.users;

    // Test valid user
    loginPage.visit().login(users.validUser.username, users.validUser.password);
    productsPage.verifyPageLoaded();

    // Test locked user
    loginPage.visit().login(users.lockedUser.username, users.lockedUser.password);
    loginPage.verifyErrorMessage('locked out');
  });
});
```

---

## Step 9: Custom Commands with Page Objects

Add to `cypress/support/commands.js`:

```js
import LoginPage from '../e2e/pages/LoginPage';
import ProductsPage from '../e2e/pages/ProductsPage';

// Custom command to login and navigate to products
Cypress.Commands.add('loginAsStandardUser', () => {
  const loginPage = new LoginPage();
  const productsPage = new ProductsPage();
  
  loginPage.visit();
  loginPage.login('standard_user', 'secret_sauce');
  productsPage.verifyPageLoaded();
});

// Custom command to add products
Cypress.Commands.add('addProductsToCart', (productNames) => {
  const productsPage = new ProductsPage();
  
  productNames.forEach(name => {
    productsPage.addProductToCart(name);
  });
});

// Custom command for complete test setup
Cypress.Commands.add('setupShoppingTest', () => {
  cy.loginAsStandardUser();
  cy.log('Test setup complete - user logged in');
});
```

Use custom commands:

```js
describe('Simplified Tests with Custom Commands', () => {
  beforeEach(() => {
    cy.setupShoppingTest();
  });

  it('should add products quickly', () => {
    cy.addProductsToCart([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light'
    ]);
    
    cy.get('.shopping_cart_badge').should('have.text', '2');
  });
});
```

---

## Step 10: Complete E-Commerce Test Suite

Create `cypress/e2e/tests/complete-flow.cy.js`:

```js
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';
import CartPage from '../pages/CartPage';

describe('Complete E-Commerce User Journey', () => {
  const loginPage = new LoginPage();
  const productsPage = new ProductsPage();
  const cartPage = new CartPage();

  it('completes full shopping experience', () => {
    // Step 1: Login
    cy.log('Step 1: User logs in');
    loginPage.visit();
    loginPage.login('standard_user', 'secret_sauce');
    productsPage.verifyPageLoaded();

    // Step 2: Browse and add products
    cy.log('Step 2: User adds products to cart');
    productsPage.addProductToCart('Sauce Labs Backpack');
    productsPage.verifyCartCount(1);
    
    productsPage.addProductToCart('Sauce Labs Bike Light');
    productsPage.verifyCartCount(2);

    // Step 3: Review cart
    cy.log('Step 3: User reviews cart');
    productsPage.goToCart();
    cartPage.verifyCartItemExists('Sauce Labs Backpack');
    cartPage.verifyCartItemExists('Sauce Labs Bike Light');
    cartPage.verifyCartItemCount(2);

    // Step 4: Modify cart
    cy.log('Step 4: User removes one item');
    cartPage.removeItem('Sauce Labs Bike Light');
    cartPage.verifyCartItemCount(1);

    // Step 5: Proceed to checkout
    cy.log('Step 5: User proceeds to checkout');
    cartPage.proceedToCheckout();
    cy.url().should('include', '/checkout-step-one');

    // Screenshot for documentation
    cy.screenshot('checkout-page');
  });

  it('handles error scenarios gracefully', () => {
    // Invalid login
    loginPage.visit();
    loginPage.login('invalid', 'invalid');
    loginPage.verifyErrorMessage('do not match');
    loginPage.takeScreenshot('login-error');

    // Locked user
    loginPage.visit();
    loginPage.login('locked_out_user', 'secret_sauce');
    loginPage.verifyErrorMessage('locked out');
  });

  it('supports multiple products workflow', () => {
    const products = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket'
    ];

    // Login
    loginPage.visit().login('standard_user', 'secret_sauce');

    // Add all products
    products.forEach(product => {
      productsPage.addProductToCart(product);
    });

    // Verify cart
    productsPage.verifyCartCount(products.length);
    productsPage.goToCart();
    cartPage.verifyCartItemCount(products.length);

    // Verify each product in cart
    products.forEach(product => {
      cartPage.verifyCartItemExists(product);
    });
  });
});
```

---

## Step 11: Run and Verify Tests

Open Cypress Test Runner:

```bash
npx cypress open
```

Run tests in headless mode:

```bash
npx cypress run --spec "cypress/e2e/tests/**/*.cy.js"
```

Run specific test file:

```bash
npx cypress run --spec "cypress/e2e/tests/shopping-flow.cy.js"
```

---

## Summary

### Page Object Model Benefits

| Aspect | Benefit |
|--------|---------|
| 🔄 **Maintainability** | Change selectors once, apply everywhere |
| 📖 **Readability** | Tests read like user stories |
| ♻️ **Reusability** | Share page logic across tests |
| 🔌 **Decoupling** | Tests independent of UI implementation |
| ✅ **Testability** | Easier to test page logic separately |
| 📝 **Documentation** | Page objects serve as living documentation |

### POM Structure

```
cypress/
├── e2e/
│   ├── tests/              ← Test files (what to test)
│   │   ├── login.cy.js
│   │   ├── checkout.cy.js
│   │   └── products.cy.js
│   └── pages/              ← Page Objects (how to interact)
│       ├── BasePage.js     ← Common functionality
│       ├── LoginPage.js    ← Login page logic
│       ├── ProductsPage.js ← Products page logic
│       └── CartPage.js     ← Cart page logic
├── fixtures/               ← Test data
│   ├── users.json
│   └── products.json
└── support/
    ├── commands.js         ← Custom commands with POM
    └── e2e.js
```

### Page Object Class Anatomy

```js
class PageName extends BasePage {
  // 1. SELECTORS (getters)
  get element() {
    return cy.get('[data-test="selector"]');
  }

  // 2. ACTIONS (methods that interact)
  clickButton() {
    this.element.click();
    return this; // Enable chaining
  }

  fillField(value) {
    this.element.type(value);
    return this;
  }

  // 3. COMPOUND ACTIONS (high-level)
  completeForm(data) {
    this.fillField(data.value);
    this.clickButton();
  }

  // 4. ASSERTIONS (verification)
  verifyPageLoaded() {
    cy.url().should('include', '/expected-path');
  }
}
```

### Best Practices

✅ **DO:**
- Use getter methods for selectors
- Return `this` for method chaining
- Create high-level methods for common workflows
- Use a BasePage for shared functionality
- Name methods clearly: `login()`, `addToCart()`, `verifySuccess()`
- Keep page objects focused on ONE page or component
- Use fixtures for test data
- Document complex methods with comments

❌ **DON'T:**
- Put assertions in page object actions (keep them separate)
- Make page objects too generic (balance reusability with specificity)
- Mix test logic with page interaction logic
- Use `cy.get()` directly in test files (use page objects instead)
- Create god objects with too many responsibilities
- Forget to return `this` when chaining is useful

### Common Patterns

#### 1. Login Pattern
```js
// In test
loginPage.visit().login(username, password);
productsPage.verifyPageLoaded();
```

#### 2. Multi-Step Flow Pattern
```js
// In test
loginPage.visit().login(user, pass);
productsPage.addProduct(name).goToCart();
cartPage.verifyItem(name).checkout();
```

#### 3. Dynamic Selection Pattern
```js
// In page object
getProductByName(name) {
  return cy.contains('.product', name);
}

addProductToCart(name) {
  this.getProductByName(name).find('button').click();
}
```

#### 4. Fixtures with POM Pattern
```js
// In test
cy.fixture('users').then(users => {
  loginPage.login(users.admin.username, users.admin.password);
});
```

#### 5. Custom Commands with POM Pattern
```js
// In commands.js
Cypress.Commands.add('loginAsStandardUser', () => {
  const loginPage = new LoginPage();
  loginPage.visit().login('standard_user', 'secret_sauce');
});

// In test
cy.loginAsStandardUser();
```

### POM vs Direct Selectors

**Without POM (Bad):**
```js
it('should login', () => {
  cy.get('[data-test="username"]').type('user');
  cy.get('[data-test="password"]').type('pass');
  cy.get('[data-test="login-button"]').click();
  cy.url().should('include', '/inventory');
});
```

**With POM (Good):**
```js
it('should login', () => {
  loginPage.visit().login('user', 'pass');
  loginPage.verifyLoginSuccess();
});
```

### Comparison Table

| Feature | Direct Selectors | Page Object Model |
|---------|------------------|-------------------|
| Maintainability | ❌ Change in many places | ✅ Change once |
| Readability | ❌ Technical, selector-heavy | ✅ Business logic focused |
| Reusability | ❌ Copy-paste code | ✅ Import and reuse |
| Test Independence | ❌ Tightly coupled to UI | ✅ Loosely coupled |
| Learning Curve | ✅ Easy to start | ⚠️ Requires structure |
| Small Projects | ✅ Quick and simple | ⚠️ May be overkill |
| Large Projects | ❌ Becomes unmanageable | ✅ Essential |

---

## Challenge Exercise

Build a **Complete User Management System Test Suite** with Page Object Model:

**Requirements:**

1. **Create Page Objects:**
   - `LoginPage.js` — Login functionality
   - `DashboardPage.js` — Main dashboard after login
   - `UsersPage.js` — User list and management
   - `UserEditPage.js` — Edit user details
   - `BasePage.js` — Common utilities

2. **Implement Features in Page Objects:**
   - Login with credentials
   - Navigate to users section
   - Search for users
   - Filter users by role
   - Edit user details
   - Delete users
   - Verify success messages

3. **Write Test Suites:**
   - `auth.cy.js` — Login/logout tests
   - `user-management.cy.js` — CRUD operations
   - `search-filter.cy.js` — Search and filter tests
   - `end-to-end.cy.js` — Complete user journey

4. **Advanced Requirements:**
   - Use `BasePage` for common navigation
   - Implement method chaining
   - Use fixtures for test data (`users.json`, `roles.json`)
   - Create custom commands that use page objects
   - Add dynamic selectors for user rows
   - Handle error scenarios with appropriate assertions
   - Screenshot on failure

5. **Test Scenarios to Cover:**
   - ✅ Admin can create new user
   - ✅ Admin can edit existing user
   - ✅ Admin can delete user
   - ✅ Search finds correct users
   - ✅ Filter by role works correctly
   - ✅ Invalid login shows error
   - ✅ Non-admin cannot access user management

**Bonus:**
- Implement a `PageFactory` to manage page object instances
- Add TypeScript types for better IntelliSense
- Create a `TestDataBuilder` pattern for complex test data
- Use `cy.session()` to cache login state
- Implement visual regression testing with Applitools

---

## Next Steps

- Explore **Cucumber with Cypress** for BDD-style tests with POM
- Learn **Component Testing** with page objects for React/Vue components
- Implement **API testing** alongside E2E tests
- Set up **CI/CD pipelines** with Cypress and POM
- Add **screenshot comparison** for visual regression
- Use **TypeScript** for type-safe page objects
- Integrate **Allure reports** for better test documentation
